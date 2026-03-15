import { Card, CardContent } from "@/components/ui/card";

export function EmptyDossierState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardContent className="py-10 text-center">
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
      </CardContent>
    </Card>
  );
}
