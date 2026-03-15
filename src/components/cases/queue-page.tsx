import Link from "next/link";
import { QueuePageHeader } from "@/components/cases/queue-page-header";
import { QueueFilterBar } from "@/components/cases/queue-filter-bar";
import { QueueTable } from "@/components/cases/queue-table";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { type CaseListItem } from "@/lib/case-presenters";
import { type PaginationMeta } from "@/lib/pagination";

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

export function QueuePage({
  title,
  description,
  items,
  pagination,
  basePath,
  searchParams,
  emptyTitle,
  emptyDescription,
  showDataQualityColumn = true,
  showFilterBar = true,
}: {
  title: string;
  description: string;
  items: CaseListItem[];
  pagination: PaginationMeta;
  basePath: string;
  searchParams: Record<string, string | string[] | undefined>;
  emptyTitle: string;
  emptyDescription?: string;
  showDataQualityColumn?: boolean;
  /** Render the priority + date-range filter bar above the table (default: true). */
  showFilterBar?: boolean;
}) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <QueuePageHeader title={title} description={description} count={pagination.total} />

      {showFilterBar ? (
        <QueueFilterBar basePath={basePath} searchParams={searchParams} />
      ) : null}

      <QueueTable
        items={items}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
        showDataQualityColumn={showDataQualityColumn}
      />

      {pagination.totalPages > 1 ? (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            صفحة {pagination.page} من {pagination.totalPages} ({pagination.total} سجل)
          </p>
          <div className="flex gap-2">
            <Link
              href={buildPageHref(basePath, searchParams, Math.max(pagination.page - 1, 1))}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                !pagination.hasPreviousPage && "pointer-events-none opacity-50",
              )}
            >
              السابق
            </Link>
            <Link
              href={buildPageHref(basePath, searchParams, pagination.page + 1)}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                !pagination.hasNextPage && "pointer-events-none opacity-50",
              )}
            >
              التالي
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
