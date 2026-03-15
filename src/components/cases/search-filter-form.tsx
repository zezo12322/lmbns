import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/lib/button-variants";
import { CASE_QUEUE_DEFINITIONS, STANDARD_CASE_QUEUE_KEYS } from "@/lib/case-queue-definitions";
import { cn } from "@/lib/utils";

type FilterValues = {
  caseNumber?: string;
  nationalId?: string;
  name?: string;
  phone?: string;
  status?: string;
  priority?: string;
  centerId?: string;
  villageId?: string;
  queue?: string;
  hasNationalId?: string;
  from?: string;
  to?: string;
};

export function SearchFilterForm({
  actionPath,
  values,
}: {
  actionPath: string;
  values: FilterValues;
}) {
  return (
    <form method="get" action={actionPath} className="grid gap-4 rounded-xl border border-border/50 bg-card p-4 shadow-sm md:grid-cols-2 xl:grid-cols-4">
      <Input name="caseNumber" defaultValue={values.caseNumber} placeholder="رقم الحالة" />
      <Input name="nationalId" defaultValue={values.nationalId} placeholder="الرقم القومي" dir="ltr" className="text-right" />
      <Input name="name" defaultValue={values.name} placeholder="اسم المستفيد" />
      <Input name="phone" defaultValue={values.phone} placeholder="رقم الهاتف" dir="ltr" className="text-right" />

      <select name="status" defaultValue={values.status ?? ""} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
        <option value="">كل الحالات</option>
        <option value="NEW">جديد</option>
        <option value="SCREENING">فرز مبدئي</option>
        <option value="MISSING_DOCUMENTS">نواقص أوراق</option>
        <option value="FIELD_RESEARCH">بحث ميداني</option>
        <option value="UNDER_REVIEW">قيد المراجعة</option>
        <option value="COMMITTEE_REVIEW">بانتظار القرار النهائي</option>
        <option value="APPROVED">معتمد</option>
        <option value="REJECTED">مرفوض</option>
      </select>

      <select name="priority" defaultValue={values.priority ?? ""} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
        <option value="">كل الأولويات</option>
        <option value="LOW">منخفضة</option>
        <option value="MEDIUM">متوسطة</option>
        <option value="HIGH">مرتفعة</option>
        <option value="URGENT">عاجلة</option>
      </select>

      <Input name="centerId" defaultValue={values.centerId} placeholder="معرّف المركز" dir="ltr" className="text-right" />
      <Input name="villageId" defaultValue={values.villageId} placeholder="معرّف القرية" dir="ltr" className="text-right" />

      <select name="queue" defaultValue={values.queue ?? ""} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
        <option value="">كل الطوابير</option>
        {STANDARD_CASE_QUEUE_KEYS.map((key) => (
          <option key={key} value={key}>
            {CASE_QUEUE_DEFINITIONS[key].labelAr}
          </option>
        ))}
      </select>

      <select name="hasNationalId" defaultValue={values.hasNationalId ?? ""} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
        <option value="">حالة الرقم القومي</option>
        <option value="true">يوجد رقم قومي</option>
        <option value="false">بدون رقم قومي</option>
      </select>

      <Input name="from" type="date" defaultValue={values.from} dir="ltr" className="text-right" />
      <Input name="to" type="date" defaultValue={values.to} dir="ltr" className="text-right" />

      <div className="flex gap-2 xl:col-span-4">
        <Button type="submit">تطبيق البحث</Button>
        <a href={actionPath} className={cn(buttonVariants({ variant: "outline" }))}>إعادة الضبط</a>
      </div>
    </form>
  );
}