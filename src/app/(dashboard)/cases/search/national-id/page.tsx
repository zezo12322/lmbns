import { Card, CardContent } from "@/components/ui/card";
import { requireAuth } from "@/lib/auth-utils";
import { validateNationalId } from "@/lib/national-id";
import { searchCasesByNationalId } from "@/lib/case-search";
import { QueuePageHeader } from "@/components/cases/queue-page-header";
import { NationalIdSearchForm } from "@/components/cases/national-id-search-form";
import { NationalIdResultBlock } from "@/components/cases/national-id-result-block";
import { EmptyStatePanel } from "@/components/cases/empty-state-panel";

export default async function NationalIdSearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await requireAuth();
  const params = await searchParams;
  const input = typeof params.nationalId === "string" ? params.nationalId : "";
  const validation = input ? validateNationalId(input) : null;

  const result = validation?.isExactLength
    ? await searchCasesByNationalId(session.user.branchId || "branch-bns-01", validation.normalized)
    : null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <QueuePageHeader
        title="البحث بالرقم القومي"
        description="بحث داخلي سريع للوصول إلى ملفات المستفيدين والحالات المرتبطة برقم قومي محدد داخل الفرع."
      />

      <NationalIdSearchForm actionPath="/cases/search/national-id" initialValue={input} />

      {!input ? (
        <EmptyStatePanel title="أدخل الرقم القومي لبدء البحث" description="البحث هنا داخلي ومخصص للموظفين، ويعمل بالمطابقة الدقيقة على 14 رقم." />
      ) : null}

      {input && validation && !validation.isExactLength ? (
        <Card className="border-red-200 bg-red-50/60">
          <CardContent className="py-4 text-red-700">الرقم القومي يجب أن يتكون من 14 رقمًا بالضبط.</CardContent>
        </Card>
      ) : null}

      {result ? <NationalIdResultBlock result={result} /> : null}
    </div>
  );
}
