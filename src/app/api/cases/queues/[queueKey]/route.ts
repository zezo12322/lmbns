import { NextResponse } from "next/server";
import { z } from "zod";
import { Priority } from "@prisma/client";
import { requireRoleApi, RoleGroups } from "@/lib/auth-utils";
import { assertValidQueueKey, listCasesForQueue } from "@/lib/case-queue-logic";
import { log } from "@/lib/logger";

const ROUTE = "/api/cases/queues/[queueKey]";

const querySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
  centerId: z.string().trim().optional(),
  villageId: z.string().trim().optional(),
  priority: z.nativeEnum(Priority).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ queueKey: string }> },
) {
  const authResult = await requireRoleApi(RoleGroups.CASE_TEAM);
  if (authResult.error) return authResult.error;

  const session = authResult.session;
  const branchId = session.user.branchId || "branch-bns-01";
  const userId = session.user.id;

  try {
    const { queueKey: rawQueueKey } = await params;
    const queueKey = assertValidQueueKey(rawQueueKey);
    const url = new URL(req.url);
    const query = querySchema.safeParse({
      page: url.searchParams.get("page") ?? undefined,
      pageSize: url.searchParams.get("pageSize") ?? undefined,
      centerId: url.searchParams.get("centerId") ?? undefined,
      villageId: url.searchParams.get("villageId") ?? undefined,
      priority: url.searchParams.get("priority") ?? undefined,
      from: url.searchParams.get("from") ?? undefined,
      to: url.searchParams.get("to") ?? undefined,
    });

    if (!query.success) {
      log.warn("cases.queue.validation_failed", {
        route: ROUTE,
        userId,
        branchId,
        queueKey,
      });

      return NextResponse.json(
        { error: "Invalid query params", details: query.error.flatten() },
        { status: 400 },
      );
    }

    const result = await listCasesForQueue({
      queueKey,
      branchId,
      sessionUserId: userId,
      filters: {
        centerId: query.data.centerId,
        villageId: query.data.villageId,
        priority: query.data.priority,
        from: query.data.from,
        to: query.data.to,
      },
      pagination: {
        page: query.data.page,
        pageSize: query.data.pageSize,
      },
    });

    log.info("cases.queue.loaded", {
      route: ROUTE,
      userId,
      branchId,
      queueKey,
      count: result.items.length,
    });

    return NextResponse.json(result);
  } catch (error) {
    const status = error instanceof Error && error.message.startsWith("Unknown queue key") ? 400 : 500;

    if (status === 400) {
      return NextResponse.json({ error: "Unknown queue key" }, { status });
    }

    log.error("cases.queue.failed", {
      route: ROUTE,
      userId,
      branchId,
      error,
    });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
