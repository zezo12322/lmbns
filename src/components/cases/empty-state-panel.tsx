import Link from "next/link";
import { Inbox } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

export function EmptyStatePanel({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardContent className="py-12 text-center">
        <Inbox className="mx-auto mb-4 h-10 w-10 text-muted-foreground/40" />
        <h3 className="mb-2 text-lg font-bold">{title}</h3>
        {description ? <p className="mx-auto max-w-xl text-sm text-muted-foreground">{description}</p> : null}
        {actionHref && actionLabel ? (
          <Link href={actionHref} className={cn(buttonVariants({ variant: "outline" }), "mt-6")}>{actionLabel}</Link>
        ) : null}
      </CardContent>
    </Card>
  );
}
