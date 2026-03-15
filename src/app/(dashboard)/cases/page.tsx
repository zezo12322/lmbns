import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-utils";
import { getCaseQueueSummary } from "@/lib/case-dashboard";
import { caseListInclude } from "@/lib/case-list-select";
import { mapCaseRowToListItem } from "@/lib/case-presenters";
import { CaseOperationsHub } from "@/components/cases/case-operations-hub";
import { QueueTable } from "@/components/cases/queue-table";
import { QueuePageHeader } from "@/components/cases/queue-page-header";

export default async function CasesPage() {
  const session = await requireAuth();

  const [summary, recentCases] = await Promise.all([
    getCaseQueueSummary({
      branchId: session.user.branchId || "branch-bns-01",
      sessionUserId: session.user.id,
    }),
    prisma.case.findMany({
      where: { branchId: session.user.branchId || "branch-bns-01" },
      include: caseListInclude,
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      take: 10,
    }),
  ]);

  const recentItems = recentCases.map(mapCaseRowToListItem);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <QueuePageHeader
        title="مركز عمليات الحالات"
        description="الوصول السريع إلى طوابير التشغيل، طوابير الأخطاء، وأحدث الحالات التي تم العمل عليها داخل الفرع."
      />

      <CaseOperationsHub summary={summary.counts} />

      <div className="space-y-4">
        <h2 className="text-xl font-bold">آخر الحالات المحدثة</h2>
        <QueueTable
          items={recentItems}
          emptyTitle="لا توجد حالات محدثة حتى الآن"
          emptyDescription="ستظهر هنا أحدث الحالات بمجرد بدء إدخال أو مراجعة البيانات."
        />
      </div>
    </div>
  );
}
