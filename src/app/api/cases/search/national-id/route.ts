import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRoleApi, RoleGroups } from "@/lib/auth-utils";
import { searchCasesByNationalId } from "@/lib/case-search";
import { validateNationalId } from "@/lib/national-id";
import { log } from "@/lib/logger";

const ROUTE = "/api/cases/search/national-id";

const querySchema = z.object({
  nationalId: z.string().trim().min(1),
});

export async function GET(req: Request) {
  const authResult = await requireRoleApi(RoleGroups.CASE_TEAM);
  if (authResult.error) return authResult.error;

  const session = authResult.session;
  const branchId = session.user.branchId || "branch-bns-01";
  const userId = session.user.id;

  try {
    const url = new URL(req.url);
    const parsed = querySchema.safeParse({
      nationalId: url.searchParams.get("nationalId") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Missing nationalId query param", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const validation = validateNationalId(parsed.data.nationalId);
    if (!validation.isExactLength) {
      return NextResponse.json(
        { error: "National ID must be exactly 14 digits" },
        { status: 400 },
      );
    }

    const result = await searchCasesByNationalId(branchId, validation.normalized);

    log.info("cases.search.national_id", {
      route: ROUTE,
      userId,
      branchId,
      found: result.found,
    });

    return NextResponse.json(result);
  } catch (error) {
    log.error("cases.search.national_id.failed", {
      route: ROUTE,
      userId,
      branchId,
      error,
    });

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
