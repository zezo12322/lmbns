import { NextResponse } from "next/server";
import { requireRoleApi, RoleGroups } from "@/lib/auth-utils";
import { getCaseQueueSummary } from "@/lib/case-dashboard";
import { log } from "@/lib/logger";

const ROUTE = "/api/dashboard/case-queues";

export async function GET() {
  const authResult = await requireRoleApi(RoleGroups.CASE_TEAM);
  if (authResult.error) return authResult.error;

  const session = authResult.session;
  const branchId = session.user.branchId || "branch-bns-01";
  const userId = session.user.id;

  try {
    const summary = await getCaseQueueSummary({
      branchId,
      sessionUserId: userId,
    });

    log.info("dashboard.case_queues.loaded", {
      route: ROUTE,
      userId,
      branchId,
    });

    return NextResponse.json(summary);
  } catch (error) {
    log.error("dashboard.case_queues.failed", {
      route: ROUTE,
      userId,
      branchId,
      error,
    });

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
