export function QueuePageHeader({
  title,
  description,
  count,
}: {
  title: string;
  description: string;
  count?: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{title}</h1>
        {typeof count === "number" ? (
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
            {count} سجل
          </span>
        ) : null}
      </div>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
