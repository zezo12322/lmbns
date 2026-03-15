import { Badge } from "@/components/ui/badge";
import type { DossierHouseholdMember } from "@/lib/case-detail/types";

export function HouseholdMemberTable({ members }: { members: DossierHouseholdMember[] }) {
  if (members.length === 0) {
    return (
      <div className="rounded-lg border border-border/50 bg-card p-6 text-center text-sm text-muted-foreground">
        لا توجد بيانات أفراد أسرة مسجلة لهذه الحالة.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border/50 bg-card shadow-sm">
      <table className="w-full text-right text-sm">
        <thead className="border-b border-border/50 bg-muted/40 text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-semibold">الاسم</th>
            <th className="px-4 py-3 font-semibold">القرابة</th>
            <th className="px-4 py-3 font-semibold">الرقم القومي</th>
            <th className="px-4 py-3 font-semibold">الهاتف</th>
            <th className="px-4 py-3 font-semibold">النوع</th>
            <th className="px-4 py-3 font-semibold">تاريخ الميلاد</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {members.map((member) => (
            <tr key={member.id} className="hover:bg-muted/10">
              <td className="px-4 py-3 font-medium">
                <div className="flex items-center gap-2">
                  {member.isPrimary ? <Badge variant="secondary" className="text-[10px]">أساسي</Badge> : null}
                  <span>{member.person.firstName} {member.person.lastName}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{member.relationship || "—"}</td>
              <td className="px-4 py-3 font-mono" dir="ltr">{member.person.nationalId || "—"}</td>
              <td className="px-4 py-3" dir="ltr">{member.person.phone || "—"}</td>
              <td className="px-4 py-3 text-muted-foreground">{member.person.gender || "—"}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {member.person.dateOfBirth
                  ? new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" }).format(new Date(member.person.dateOfBirth))
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
