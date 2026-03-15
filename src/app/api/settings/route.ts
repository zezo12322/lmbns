import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireRoleApi, RoleGroups } from "@/lib/auth-utils";
import { writeAuditLog } from "@/lib/audit";
import { log } from "@/lib/logger";

const ROUTE = "/api/settings";

const settingsSchema = z.object({
  nameArabic: z.string().trim().min(2).max(200),
  nameEnglish: z.string().trim().max(200).optional().or(z.literal("")),
  address: z.string().trim().max(500).optional().or(z.literal("")),
  phones: z.array(z.string().trim().max(30)).max(10).optional(),
  donationChannels: z.array(z.string().trim().max(200)).max(20).optional(),
});

export async function PUT(req: Request) {
  const authResult = await requireRoleApi(RoleGroups.ADMINS);
  if (authResult.error) return authResult.error;
  const session = authResult.session;
  const userId = session.user.id;

  const branchId = session.user.branchId || "branch-bns-01";

  try {
    const body = await req.json();
    const parsed = settingsSchema.safeParse(body);
    if (!parsed.success) {
      log.warn("settings.update.validation_failed", { route: ROUTE, userId });
      return NextResponse.json(
        { error: "بيانات غير صالحة", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const branch = await prisma.branch.findUnique({ where: { id: branchId } });
    if (!branch) {
      return NextResponse.json(
        { error: "الفرع غير موجود" },
        { status: 404 }
      );
    }

    // Merge settings into the Json field
    const newSettings = {
      address: data.address || "",
      phones: (data.phones || []).filter(Boolean),
      donationChannels: (data.donationChannels || []).filter(Boolean),
    };

    await prisma.branch.update({
      where: { id: branchId },
      data: {
        nameArabic: data.nameArabic,
        nameEnglish: data.nameEnglish || null,
        settings: newSettings,
      },
    });

    await writeAuditLog({
      userId,
      action: "UPDATE",
      entityType: "Branch",
      entityId: branchId,
      details: { nameArabic: data.nameArabic },
    });

    log.info("settings.updated", { route: ROUTE, userId, entityId: branchId });
    return NextResponse.json({ success: true });
  } catch (error) {
    log.error("settings.update.failed", { route: ROUTE, userId, error });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
