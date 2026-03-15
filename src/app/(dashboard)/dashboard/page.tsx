import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AnalyticsChart } from "@/components/ui/analytics-chart";
import { requireAuth } from "@/lib/auth-utils";
import { getCaseQueueSummary } from "@/lib/case-dashboard";
import { CaseOperationsHub } from "@/components/cases/case-operations-hub";
import { EmptyStatePanel } from "@/components/cases/empty-state-panel";

export default async function DashboardPage() {
  const session = await requireAuth();
  const summary = await getCaseQueueSummary({
    branchId: session.user.branchId || "branch-bns-01",
    sessionUserId: session.user.id,
  });
  const totalCases = summary.charts.statusDistribution.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-2">لوحة التشغيل اليومية</h1>
        <p className="text-lg text-muted-foreground">متابعة مباشرة لطوابير الحالات، جودة البيانات، ونقاط التدخل اليومية داخل الفرع.</p>
      </div>

      {totalCases > 0 ? <CaseOperationsHub summary={summary.counts} /> : <EmptyStatePanel title="لا توجد حالات مسجلة بعد" description="ابدأ من طلبات المساعدة أو أنشئ حالات جديدة من دورة الاستقبال الحالية." actionHref="/intake" actionLabel="فتح طلبات المساعدة" />}
      
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">توزيع الحالات حسب المرحلة</CardTitle>
            <CardDescription>صورة سريعة لطبيعة التكدس في دورة معالجة الحالات.</CardDescription>
          </CardHeader>
          <CardContent>
            {summary.charts.statusDistribution.length > 0 ? (
               <AnalyticsChart type="pie" data={summary.charts.statusDistribution.map((item) => ({ name: item.label, value: item.value }))} nameKey="name" valueKey="value" />
            ) : (
               <div className="h-[300px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-lg">
                 لا توجد بيانات كافية لعرض التوزيع المرحلي.
               </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">توزيع الأولويات</CardTitle>
            <CardDescription>الحالات المصنفة حسب درجة الخطورة الحالية.</CardDescription>
          </CardHeader>
          <CardContent>
             {summary.charts.priorityDistribution.length > 0 ? (
               <AnalyticsChart type="bar" data={summary.charts.priorityDistribution.map((item) => ({ name: item.label, value: item.value }))} xKey="name" yKey="value" colors={["#F8AD44"]} />
             ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground bg-muted/20 border border-border/50 border-dashed rounded-lg">
                  <p>لا توجد بيانات كافية لعرض توزيع الأولويات.</p>
               </div>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
