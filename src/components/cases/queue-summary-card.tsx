import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QueueSummaryCard({
  title,
  value,
  href,
  description,
  tone = "default",
}: {
  title: string;
  value: number;
  href: string;
  description?: string;
  tone?: "default" | "warning" | "danger" | "success";
}) {
  const toneClass = {
    default: "from-primary/10 to-primary/5 text-primary",
    warning: "from-amber-500/10 to-amber-500/5 text-amber-700",
    danger: "from-red-500/10 to-red-500/5 text-red-700",
    success: "from-emerald-500/10 to-emerald-500/5 text-emerald-700",
  }[tone];

  return (
    <Link href={href}>
      <Card className="border-border/50 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
        <CardHeader className={`bg-gradient-to-l ${toneClass} rounded-t-xl border-b border-border/40 pb-3`}>
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-3xl font-black">{value}</div>
          {description ? <p className="mt-2 text-xs text-muted-foreground">{description}</p> : null}
        </CardContent>
      </Card>
    </Link>
  );
}
