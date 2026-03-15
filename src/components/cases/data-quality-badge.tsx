import { Badge } from "@/components/ui/badge";

type DataQualityStatus = "MISSING" | "VALID" | "INVALID" | "UNKNOWN";

const labelMap: Record<DataQualityStatus, string> = {
  MISSING: "بدون رقم قومي",
  VALID: "رقم صالح",
  INVALID: "رقم غير صالح",
  UNKNOWN: "غير محقق",
};

const classMap: Record<DataQualityStatus, string> = {
  MISSING: "bg-amber-500/10 text-amber-700 border-amber-200",
  VALID: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  INVALID: "bg-red-500/10 text-red-700 border-red-200",
  UNKNOWN: "bg-slate-500/10 text-slate-700 border-slate-200",
};

export function DataQualityBadge({ status }: { status: DataQualityStatus }) {
  return (
    <Badge variant="outline" className={classMap[status]}>
      {labelMap[status]}
    </Badge>
  );
}
