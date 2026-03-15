import { Badge } from "@/components/ui/badge";

const statusLabels: Record<string, string> = {
  NEW: "جديد",
  SCREENING: "فرز مبدئي",
  MISSING_DOCUMENTS: "نواقص أوراق",
  FIELD_RESEARCH: "بحث ميداني",
  UNDER_REVIEW: "قيد المراجعة",
  COMMITTEE_REVIEW: "لجنة/قرار إداري",
  APPROVED: "معتمد",
  REJECTED: "مرفوض",
  IN_EXECUTION: "قيد التنفيذ",
  FOLLOW_UP: "متابعة",
  CLOSED: "مغلق",
  REOPENED: "أعيد فتحه",
};

const statusClasses: Record<string, string> = {
  NEW: "bg-blue-500/10 text-blue-700 border-blue-200",
  SCREENING: "bg-indigo-500/10 text-indigo-700 border-indigo-200",
  MISSING_DOCUMENTS: "bg-red-500/10 text-red-700 border-red-200",
  FIELD_RESEARCH: "bg-amber-500/10 text-amber-700 border-amber-200",
  UNDER_REVIEW: "bg-purple-500/10 text-purple-700 border-purple-200",
  COMMITTEE_REVIEW: "bg-orange-500/10 text-orange-700 border-orange-200",
  APPROVED: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  REJECTED: "bg-rose-500/10 text-rose-700 border-rose-200",
  IN_EXECUTION: "bg-cyan-500/10 text-cyan-700 border-cyan-200",
  FOLLOW_UP: "bg-teal-500/10 text-teal-700 border-teal-200",
  CLOSED: "bg-zinc-500/10 text-zinc-700 border-zinc-200",
  REOPENED: "bg-fuchsia-500/10 text-fuchsia-700 border-fuchsia-200",
};

const managerLabels: Record<string, string> = {
  NOT_SENT: "لم يُرسل",
  PENDING: "بانتظار المدير",
  APPROVED: "موافقة نهائية",
  REJECTED: "رفض نهائي",
};

export function QueueStatusBadge({
  status,
  managerReviewState,
}: {
  status: string;
  managerReviewState?: string;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      <Badge variant="outline" className={statusClasses[status] ?? statusClasses.NEW}>
        {statusLabels[status] ?? status}
      </Badge>
      {managerReviewState && managerReviewState !== "NOT_SENT" ? (
        <Badge variant="secondary">{managerLabels[managerReviewState] ?? managerReviewState}</Badge>
      ) : null}
    </div>
  );
}
