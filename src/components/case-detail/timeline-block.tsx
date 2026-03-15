import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type TimelineItem = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  date?: string;
};

export function TimelineBlock({
  title,
  items,
  emptyTitle,
}: {
  title: string;
  items: TimelineItem[];
  emptyTitle: string;
}) {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyTitle}</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="rounded-lg border border-border/40 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <div className="flex items-center gap-2">
                    {item.badge ? <Badge variant="outline">{item.badge}</Badge> : null}
                    {item.date ? (
                      <span className="text-xs text-muted-foreground">
                        {new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.date))}
                      </span>
                    ) : null}
                  </div>
                </div>
                {item.subtitle ? <p className="mt-1 text-xs text-muted-foreground">{item.subtitle}</p> : null}
                {item.description ? <p className="mt-2 text-sm text-muted-foreground">{item.description}</p> : null}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
