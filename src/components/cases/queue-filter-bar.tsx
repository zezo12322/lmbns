import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

const priorityOptions = [
  { value: "", label: "كل الأولويات" },
  { value: "LOW", label: "منخفضة" },
  { value: "MEDIUM", label: "متوسطة" },
  { value: "HIGH", label: "مرتفعة" },
  { value: "URGENT", label: "عاجلة" },
];

/**
 * A lightweight URL-driven filter bar for queue pages.
 * Submits as a GET form → preserves all filters in the URL without JS.
 * Shows an active-filter indicator badge when any filter is active.
 */
export function QueueFilterBar({
  basePath,
  searchParams,
}: {
  basePath: string;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const priority = typeof searchParams.priority === "string" ? searchParams.priority : "";
  const from = typeof searchParams.from === "string" ? searchParams.from : "";
  const to = typeof searchParams.to === "string" ? searchParams.to : "";

  const hasActiveFilters = !!(priority || from || to);

  return (
    <form
      method="get"
      action={basePath}
      className="flex flex-wrap items-end gap-3 rounded-xl border border-border/50 bg-card px-4 py-3 shadow-sm"
    >
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">الأولوية</label>
        <select
          name="priority"
          defaultValue={priority}
          className="h-9 min-w-[130px] rounded-md border border-input bg-background px-3 text-sm"
        >
          {priorityOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">من تاريخ</label>
        <Input
          type="date"
          name="from"
          defaultValue={from}
          className="h-9 w-[155px] text-sm"
          dir="ltr"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">إلى تاريخ</label>
        <Input
          type="date"
          name="to"
          defaultValue={to}
          className="h-9 w-[155px] text-sm"
          dir="ltr"
        />
      </div>

      <div className="flex items-end gap-2">
        <Button type="submit" size="sm">
          تطبيق
        </Button>
        {hasActiveFilters ? (
          <a
            href={basePath}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "text-muted-foreground",
            )}
          >
            مسح الفلاتر
          </a>
        ) : null}
      </div>

      {hasActiveFilters ? (
        <span className="flex w-full items-center gap-1.5 text-xs font-medium text-amber-700">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
          الفلاتر نشطة — النتائج مصفاة حسب المعايير المحددة
        </span>
      ) : null}
    </form>
  );
}
