import { NextResponse } from "next/server";
import { requireRoleApi, RoleGroups } from "@/lib/auth-utils";
import { countCasesForQueue } from "@/lib/case-queue-logic";
import { log } from "@/lib/logger";

const ROUTE = "/api/cases/errors/summary";

export async function GET() {
  const authResult = await requireRoleApi(RoleGroups.CASE_TEAM);
  if (authResult.error) return authResult.error;

  const session = authResult.session;
  const branchId = session.user.branchId || "branch-bns-01";
  const userId = session.user.id;

  try {
    const [missingNationalId, invalidNationalId] = await Promise.all([
      countCasesForQueue({ queueKey: "missing-national-id", branchId }),
      countCasesForQueue({ queueKey: "invalid-national-id", branchId }),
    ]);

    log.info("cases.errors.summary", {
      route: ROUTE,
      userId,
      branchId,
    });

    return NextResponse.json({ missingNationalId, invalidNationalId });
  } catch (error) {
    log.error("cases.errors.summary.failed", {
      route: ROUTE,
      userId,
      branchId,
      error,
    });

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}