import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRoleApi, RoleGroups } from "@/lib/auth-utils";
import { log } from "@/lib/logger";

const ROUTE = "/api/intake/[id]/convert";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireRoleApi(RoleGroups.CASE_TEAM);
  if (authResult.error) return authResult.error;
  const session = authResult.session;
  const userId = session.user.id;

  const resolvedParams = await params;
  const requestId = resolvedParams.id;

  try {
    const intake = await prisma.intakeRequest.findUnique({
      where: { id: requestId },
    });

    if (!intake || intake.status !== "PENDING") {
      log.warn("intake.convert.invalid_request", { route: ROUTE, userId, entityId: requestId });
      return NextResponse.json({ error: "Invalid intake request" }, { status: 400 });
    }

    const newCase = await prisma.$transaction(async (tx) => {
      // 1. Create or Find Person
      let person = await tx.person.findFirst({
        where: { OR: [{ nationalId: intake.nationalId || undefined }, { phone: intake.phone }] },
      });

      if (!person) {
        const names = intake.requestorName.split(" ");
        person = await tx.person.create({
          data: {
            firstName: names[0] || "بدون اسم",
            lastName: names.slice(1).join(" ") || "بدون عائلة",
            phone: intake.phone,
            nationalId: intake.nationalId,
          },
        });
      }

      // 2. Create Household
      const household = await tx.household.create({
        data: {
          name: `أسرة ${person.firstName} ${person.lastName}`,
        },
      });

      await tx.householdMember.create({
        data: {
          householdId: household.id,
          personId: person.id,
          relationship: "HEAD",
          isPrimary: true,
        },
      });

      // 3. Create Case
      const caseNumber = `BNS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const createdCase = await tx.case.create({
        data: {
          caseNumber,
          branchId: session.user.branchId || "branch-bns-01",
          householdId: household.id,
          intakeRequestId: intake.id,
          title: `طلب مقدم من ${intake.requestorName}`,
          description: intake.description,
          caseType: "OTHER",
          status: "SCREENING",
        },
      });

      // 4. Update Intake Request
      await tx.intakeRequest.update({
        where: { id: intake.id },
        data: { status: "CONVERTED" },
      });

      // 5. Audit Log (inside transaction for atomicity)
      await tx.auditLog.create({
        data: {
          userId,
          action: "CREATE",
          entityType: "CASE",
          entityId: createdCase.id,
          details: { message: "Converted from intake request", intakeId: intake.id },
        },
      });

      return createdCase;
    });

    log.info("intake.converted", {
      route: ROUTE,
      userId,
      entityId: newCase.id,
      intakeId: requestId,
    });
    return NextResponse.json({ success: true, caseId: newCase.id });
  } catch (error) {
    log.error("intake.convert.failed", { route: ROUTE, userId, entityId: requestId, error });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
