import Link from "next/link";
import { ZodError } from "zod";
import { requireAuth } from "@/lib/auth-utils";
import { searchCasesAdvanced } from "@/lib/case-search";
import { QueuePageHeader } from "@/components/cases/queue-page-header";
import { SearchFilterForm } from "@/components/cases/search-filter-form";
import { QueueTable } from "@/components/cases/queue-table";
import { EmptyStatePanel } from "@/components/cases/empty-state-panel";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

function buildPageHref(
  basePath: string,
  searchParams: Record<string, string | string[] | undefined>,
  page: number,
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string" && value.length > 0 && key !== "page") {
      params.set(key, value);
    }
  }

  params.set("page", String(page));
  return `${basePath}?${params.toString()}`;
}

export default async function AdvancedCaseSearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await requireAuth();
  const params = await searchParams;
  const submitted = Object.keys(params).some((key) => {
    const value = params[key];
    return key !== "page" && key !== "pageSize" && typeof value === "string" && value.length > 0;
  });

  let result: Awaited<ReturnType<typeof searchCasesAdvanced>> | null = null;
  let errorMessage: string | null = null;

  if (submitted) {
    try {
      result = await searchCasesAdvanced(session.user.branchId || "branch-bns-01", params);
    } catch (error) {
      if (error instanceof ZodError) {
        errorMessage = "أحد مرشحات البحث غير صالح. راجع القيم المدخلة ثم أعد المحاولة.";
      } else {
        throw error;
      }
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <QueuePageHeader
        title="البحث المتقدم في الحالات"
        description="ابحث حسب رقم الحالة أو الرقم القومي أو الاسم أو أولوية العمل أو طابور التشغيل للوصول السريع إلى الملفات المطلوبة."
      />

      <SearchFilterForm
        actionPath="/cases/search/advanced"
        values={{
          caseNumber: typeof params.caseNumber === "string" ? params.caseNumber : undefined,
          nationalId: typeof params.nationalId === "string" ? params.nationalId : undefined,
          name: typeof params.name === "string" ? params.name : undefined,
          phone: typeof params.phone === "string" ? params.phone : undefined,
          status: typeof params.status === "string" ? params.status : undefined,
          priority: typeof params.priority === "string" ? params.priority : undefined,
          centerId: typeof params.centerId === "string" ? params.centerId : undefined,
          villageId: typeof params.villageId === "string" ? params.villageId : undefined,
          queue: typeof params.queue === "string" ? params.queue : undefined,
          hasNationalId: typeof params.hasNationalId === "string" ? params.hasNationalId : undefined,
          from: typeof params.from === "string" ? params.from : undefined,
          to: typeof params.to === "string" ? params.to : undefined,
        }}
      />

      {!submitted ? (
        <EmptyStatePanel title="ابدأ بإدخال مرشح واحد على الأقل" description="يمكنك استخدام اسم المستفيد أو الرقم القومي أو الطابور التشغيلي أو حالة الملف لتصفية النتائج." />
      ) : null}

      {errorMessage ? (
        <Card className="border-red-200 bg-red-50/60">
          <CardContent className="py-4 text-red-700">{errorMessage}</CardContent>
        </Card>
      ) : null}

      {result ? (
        <div className="space-y-4">
          <Card className="border-border/50 bg-muted/20 shadow-sm">
            <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm text-muted-foreground">
              <p>
                إجمالي النتائج: <span className="font-bold text-foreground">{result.pagination.total}</span>
              </p>
              <p>
                الصفحة الحالية: <span className="font-bold text-foreground">{result.pagination.page}</span> من {result.pagination.totalPages}
              </p>
            </CardContent>
          </Card>

          <QueueTable
            items={result.items}
            emptyTitle="لا توجد حالات مطابقة لهذه المرشحات"
            emptyDescription="جرّب تخفيف الشروط أو إزالة بعض المرشحات لتوسيع النتائج."
          />

          {result.pagination.totalPages > 1 ? (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                صفحة {result.pagination.page} من {result.pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <Link
                  href={buildPageHref("/cases/search/advanced", params, Math.max(result.pagination.page - 1, 1))}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    !result.pagination.hasPreviousPage && "pointer-events-none opacity-50",
                  )}
                >
                  السابق
                </Link>
                <Link
                  href={buildPageHref("/cases/search/advanced", params, result.pagination.page + 1)}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    !result.pagination.hasNextPage && "pointer-events-none opacity-50",
                  )}
                >
                  التالي
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
