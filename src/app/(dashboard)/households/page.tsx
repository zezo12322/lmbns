import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/lib/button-variants";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function HouseholdsPage() {
  await requireAuth();

  const households = await prisma.household.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      members: {
        include: { person: true }
      },
      cases: {
        select: { status: true }
      }
    }
  });

  type HouseholdWithRelations = typeof households[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-2">الأُسر والمستفيدين</h1>
          <p className="text-lg text-muted-foreground">
            قاعدة بيانات الأسر المسجلة بفرع بني سويف ومتابعة حالتهم المستمرة.
          </p>
        </div>
        <Button disabled className="shadow-md text-sm font-semibold">
          إضافة أسرة جديدة (قريباً)
        </Button>
      </div>

      <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold text-foreground">اسم الأسرة (المسؤول)</TableHead>
              <TableHead className="font-semibold text-foreground">عدد الأفراد</TableHead>
              <TableHead className="font-semibold text-foreground">العنوان</TableHead>
              <TableHead className="font-semibold text-foreground">التصنيف</TableHead>
              <TableHead className="font-semibold text-foreground">حالات مرتبطة</TableHead>
              <TableHead className="text-left font-semibold text-foreground">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {households.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground bg-muted/20">
                  <div className="py-4">لا توجد أسر مسجلة حالياً بقاعدة البيانات.</div>
                </TableCell>
              </TableRow>
            ) : (
              households.map((h: HouseholdWithRelations, index: number) => {
                const primary = h.members.find((m: any) => m.isPrimary)?.person;
                const name = primary ? `${primary.firstName} ${primary.lastName}` : h.name;
                const activeCases = h.cases.filter((c: any) => c.status !== "CLOSED" && c.status !== "REJECTED").length;

                return (
                  <TableRow key={h.id} className={cn("transition-colors hover:bg-muted/30", index % 2 === 0 ? "bg-background" : "bg-muted/10")}>
                    <TableCell className="font-semibold text-primary/90">{name}</TableCell>
                    <TableCell className="text-muted-foreground">{h.members.length} أفراد</TableCell>
                    <TableCell className="text-muted-foreground max-w-[200px] truncate" title={h.address || ""}>{h.address || "غير محدد"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-muted shadow-sm border-border">
                        عام
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {activeCases > 0 ? (
                        <Badge variant="secondary" className="shadow-sm border-primary/20 text-primary bg-primary/10">
                          {activeCases} حالة نشطة
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">لا يوجد</span>
                      )}
                    </TableCell>
                    <TableCell className="text-left">
                      <Link href={`/households/${h.id}`} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hover:bg-primary/10 hover:text-primary transition-colors")}>
                        الملف الشامل
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
