import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { requireRoleApi, RoleGroups } from "@/lib/auth-utils";
import { searchCasesAdvanced } from "@/lib/case-search";
import { log } from "@/lib/logger";

const ROUTE = "/api/cases/search/advanced";

export async function GET(req: Request) {
  const authResult = await requireRoleApi(RoleGroups.CASE_TEAM);
  if (authResult.error) return authResult.error;

  const session = authResult.session;
  const branchId = session.user.branchId || "branch-bns-01";
  const userId = session.user.id;

  try {
    const url = new URL(req.url);
    const searchParams = Object.fromEntries(url.searchParams.entries());
    const result = await searchCasesAdvanced(branchId, searchParams);

    log.info("cases.search.advanced", {
      route: ROUTE,
      userId,
      branchId,
      count: result.items.length,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid search filters", details: error.flatten() },
        { status: 400 },
      );
    }

    log.error("cases.search.advanced.failed", {
      route: ROUTE,
      userId,
      branchId,
      error,
    });

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
