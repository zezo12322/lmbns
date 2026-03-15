import { requireAuth } from "@/lib/auth-utils";
import { listCasesForQueue, parseQueueFilterParams } from "@/lib/case-queue-logic";
import { QueuePage } from "@/components/cases/queue-page";

export default async function UrgentQueuePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await requireAuth();
  const params = await searchParams;
  const filters = parseQueueFilterParams(params);
  const result = await listCasesForQueue({
    queueKey: "urgent",
    branchId: session.user.branchId || "branch-bns-01",
    sessionUserId: session.user.id,
    filters,
    pagination: { page: typeof params.page === "string" ? params.page : undefined, pageSize: typeof params.pageSize === "string" ? params.pageSize : undefined },
  });

  return <QueuePage title={result.queue.labelAr} description={result.queue.descriptionAr} items={result.items} pagination={result.pagination} basePath="/cases/queues/urgent" searchParams={params} emptyTitle="لا توجد حالات عاجلة أو مرتفعة حالياً" />;
}
