import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QueueTable } from "@/components/cases/queue-table";
import { EmptyStatePanel } from "@/components/cases/empty-state-panel";
import { DataQualityBadge } from "@/components/cases/data-quality-badge";
import { type NationalIdSearchResult } from "@/lib/case-search";

export function NationalIdResultBlock({ result }: { result: NationalIdSearchResult }) {
  if (!result.found) {
    return (
      <EmptyStatePanel
        title="لا توجد نتائج مطابقة"
        description="لم يتم العثور على مستفيد أو حالة أو طلب وارد بهذا الرقم القومي داخل الفرع الحالي."
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>نتيجة البحث للرقم القومي</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="font-mono text-lg" dir="ltr">{result.normalizedNationalId}</div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {result.personMatches.map((person) => (
              <div key={person.id} className="rounded-lg border border-border/40 bg-muted/20 p-4">
                <div className="mb-2 font-bold">{person.fullName}</div>
                <div className="mb-2 text-sm text-muted-foreground" dir="ltr">{person.phone ?? "—"}</div>
                <DataQualityBadge
                  status={person.validationStatus === "VALID" ? "VALID" : person.validationStatus === "INVALID" ? "INVALID" : "UNKNOWN"}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <QueueTable
        items={result.caseMatches}
        emptyTitle="لا توجد حالات مرتبطة بهذا الرقم القومي"
        showDataQualityColumn
      />

      {result.intakeMatches.length > 0 ? (
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>طلبات واردة مرتبطة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.intakeMatches.map((intake) => (
              <div key={intake.id} className="rounded-lg border border-border/40 p-4">
                <div className="font-semibold">{intake.requestorName}</div>
                <div className="text-sm text-muted-foreground">
                  {new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" }).format(new Date(intake.createdAt))} — {intake.status}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
