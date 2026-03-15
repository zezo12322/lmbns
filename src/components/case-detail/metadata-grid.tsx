import { type ReactNode } from "react";

type MetadataItem = {
  key: string;
  label: string;
  value: ReactNode;
};

export function CaseDetailMetadataGrid({
  items,
  columns = 2,
}: {
  items: MetadataItem[];
  columns?: 2 | 3 | 4;
}) {
  const colsClass = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <div className={`grid gap-4 ${colsClass}`}>
      {items.map((item) => (
        <div key={item.key} className="rounded-lg border border-border/40 bg-muted/20 p-3">
          <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
          <div className="mt-1 text-sm font-semibold text-foreground">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
