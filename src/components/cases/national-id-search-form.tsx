import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NationalIdSearchForm({
  actionPath,
  initialValue,
}: {
  actionPath: string;
  initialValue?: string;
}) {
  return (
    <form method="get" action={actionPath} className="flex flex-col gap-3 rounded-xl border border-border/50 bg-card p-4 shadow-sm md:flex-row">
      <Input
        name="nationalId"
        defaultValue={initialValue}
        placeholder="أدخل الرقم القومي 14 رقم"
        dir="ltr"
        className="text-right"
      />
      <Button type="submit">بحث</Button>
    </form>
  );
}
