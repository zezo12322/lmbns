import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { QueueStatusBadge } from "@/components/cases/queue-status-badge";
import { DataQualityBadge } from "@/components/cases/data-quality-badge";
import { EmptyStatePanel } from "@/components/cases/empty-state-panel";
import { type CaseListItem } from "@/lib/case-presenters";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

const priorityLabels: Record<string, string> = {
  LOW: "منخفضة",
  MEDIUM: "متوسطة",
  HIGH: "مرتفعة",
  URGENT: "عاجلة",
};

function toQualityStatus(item: CaseListItem): "MISSING" | "VALID" | "INVALID" | "UNKNOWN" {
  if (item.queueFlags.missingNationalId) return "MISSING";
  if (item.queueFlags.invalidNationalId) return "INVALID";
  if (item.nationalIdValidationStatus === "VALID") return "VALID";
  return "UNKNOWN";
}

export function QueueTable({
  items,
  emptyTitle,
  emptyDescription,
  showDataQualityColumn = true,
}: {
  items: CaseListItem[];
  emptyTitle: string;
  emptyDescription?: string;
  showDataQualityColumn?: boolean;
}) {
  if (items.length === 0) {
    return <EmptyStatePanel title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead>رقم الحالة</TableHead>
            <TableHead>المستفيد الأساسي</TableHead>
            <TableHead>الوضع</TableHead>
            <TableHead>الأولوية</TableHead>
            {showDataQualityColumn ? <TableHead>جودة الرقم القومي</TableHead> : null}
            <TableHead>المركز / القرية</TableHead>
            <TableHead>آخر تحديث</TableHead>
            <TableHead className="text-left">الإجراء</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-semibold text-primary">{item.caseNumber}</TableCell>
              <TableCell>
                <div className="font-medium">{item.beneficiaryName}</div>
                <div className="text-xs text-muted-foreground" dir="ltr">{item.phone ?? item.nationalId ?? "—"}</div>
              </TableCell>
              <TableCell>
                <QueueStatusBadge status={item.status} managerReviewState={item.managerReviewState} />
              </TableCell>
              <TableCell>{priorityLabels[item.priority] ?? item.priority}</TableCell>
              {showDataQualityColumn ? (
                <TableCell>
                  <DataQualityBadge status={toQualityStatus(item)} />
                </TableCell>
              ) : null}
              <TableCell>{item.centerName ? `${item.centerName}${item.villageName ? ` / ${item.villageName}` : ""}` : "غير محدد"}</TableCell>
              <TableCell>{new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" }).format(new Date(item.updatedAt))}</TableCell>
              <TableCell className="text-left">
                <Link href={`/cases/${item.id}`} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hover:bg-primary/10 hover:text-primary")}>
                  فتح الملف
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
