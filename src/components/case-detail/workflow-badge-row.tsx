import { Badge } from "@/components/ui/badge";
import {
  getCaseTypeLabel,
  getManagerReviewLabel,
  getPriorityLabel,
  getStatusLabel,
} from "@/lib/case-detail/presenters";

export function WorkflowBadgeRow({
  status,
  priority,
  managerReviewState,
  caseType,
}: {
  status: string;
  priority: string;
  managerReviewState: string;
  caseType: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="outline" className="font-semibold">{getStatusLabel(status)}</Badge>
      <Badge variant="secondary">أولوية: {getPriorityLabel(priority)}</Badge>
      <Badge variant="secondary">نوع الحالة: {getCaseTypeLabel(caseType)}</Badge>
      <Badge variant="secondary">المدير: {getManagerReviewLabel(managerReviewState)}</Badge>
    </div>
  );
}
