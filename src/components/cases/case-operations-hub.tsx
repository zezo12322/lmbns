import { QueueSummaryCard } from "@/components/cases/queue-summary-card";
import { DashboardQuickLinks } from "@/components/cases/dashboard-quick-links";
import { CASE_QUEUE_DEFINITIONS } from "@/lib/case-queue-definitions";

type HubSummary = {
  specialistNew: number;
  allNew: number;
  underReview: number;
  waitingManager: number;
  urgent: number;
  approved: number;
  rejected: number;
  finalRejected: number;
  missingNationalId: number;
  invalidNationalId: number;
};

export function CaseOperationsHub({ summary }: { summary: HubSummary }) {
  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">طوابير التشغيل اليومية</h2>
          <p className="text-sm text-muted-foreground">أهم الطوابير التي تحتاج متابعة مباشرة من فريق التشغيل.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <QueueSummaryCard title={CASE_QUEUE_DEFINITIONS["specialist-new"].labelAr} value={summary.specialistNew} href={CASE_QUEUE_DEFINITIONS["specialist-new"].routePath} />
          <QueueSummaryCard title={CASE_QUEUE_DEFINITIONS.new.labelAr} value={summary.allNew} href={CASE_QUEUE_DEFINITIONS.new.routePath} />
          <QueueSummaryCard title={CASE_QUEUE_DEFINITIONS["under-review"].labelAr} value={summary.underReview} href={CASE_QUEUE_DEFINITIONS["under-review"].routePath} />
          <QueueSummaryCard title={CASE_QUEUE_DEFINITIONS["waiting-manager"].labelAr} value={summary.waitingManager} href={CASE_QUEUE_DEFINITIONS["waiting-manager"].routePath} tone="warning" />
          <QueueSummaryCard title={CASE_QUEUE_DEFINITIONS.urgent.labelAr} value={summary.urgent} href={CASE_QUEUE_DEFINITIONS.urgent.routePath} tone="danger" />
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">مخرجات القرار</h2>
          <p className="text-sm text-muted-foreground">الحالات التي وصلت لقرارات اعتماد أو رفض وتحتاج مراجعة سريعة.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <QueueSummaryCard title={CASE_QUEUE_DEFINITIONS.approved.labelAr} value={summary.approved} href={CASE_QUEUE_DEFINITIONS.approved.routePath} tone="success" />
          <QueueSummaryCard title={CASE_QUEUE_DEFINITIONS.rejected.labelAr} value={summary.rejected} href={CASE_QUEUE_DEFINITIONS.rejected.routePath} tone="danger" />
          <QueueSummaryCard title={CASE_QUEUE_DEFINITIONS["final-rejected"].labelAr} value={summary.finalRejected} href={CASE_QUEUE_DEFINITIONS["final-rejected"].routePath} tone="danger" />
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">جودة البيانات</h2>
          <p className="text-sm text-muted-foreground">الملفات التي تحتاج تصحيح بيانات الهوية قبل استكمال المعالجة.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <QueueSummaryCard title={CASE_QUEUE_DEFINITIONS["missing-national-id"].labelAr} value={summary.missingNationalId} href={CASE_QUEUE_DEFINITIONS["missing-national-id"].routePath} tone="warning" />
          <QueueSummaryCard title={CASE_QUEUE_DEFINITIONS["invalid-national-id"].labelAr} value={summary.invalidNationalId} href={CASE_QUEUE_DEFINITIONS["invalid-national-id"].routePath} tone="danger" />
        </div>
      </section>

      <DashboardQuickLinks
        links={[
          { title: "الحالات العاجلة", href: "/cases/queues/urgent", icon: "list" },
          { title: "بانتظار المدير", href: "/cases/queues/waiting-manager", icon: "list" },
          { title: "بحث بالرقم القومي", href: "/cases/search/national-id", icon: "search" },
          { title: "بحث متقدم", href: "/cases/search/advanced", icon: "search" },
          { title: "أخطاء الرقم القومي", href: "/cases/errors/missing-national-id", icon: "error" },
          { title: "مركز الحالات", href: "/cases", icon: "list" },
        ]}
      />
    </div>
  );
}
