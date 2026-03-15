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
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default async function IntakeRequestsPage() {
  await requireAuth();

  const requests = await prisma.intakeRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-2">طلبات المساعدة</h1>
          <p className="text-lg text-muted-foreground">
            الطلبات الواردة من الموقع المفتوح والتي تنتظر المراجعة المبدئية.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold text-foreground">الاسم</TableHead>
              <TableHead className="font-semibold text-foreground">الهاتف</TableHead>
              <TableHead className="font-semibold text-foreground">تاريخ الطلب</TableHead>
              <TableHead className="font-semibold text-foreground">الحالة</TableHead>
              <TableHead className="text-left font-semibold text-foreground">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  لا توجد طلبات مساعدة جديدة
                </TableCell>
              </TableRow>
            ) : (
              requests.map((req: any, index: number) => (
                <TableRow key={req.id} className={cn("transition-colors hover:bg-muted/30", index % 2 === 0 ? "bg-background" : "bg-muted/10")}>
                  <TableCell className="font-medium">{req.requestorName}</TableCell>
                  <TableCell dir="ltr" className="text-right text-muted-foreground font-mono text-sm">{req.phone}</TableCell>
                  <TableCell className="text-muted-foreground">{format(new Date(req.createdAt), 'yyyy/MM/dd')}</TableCell>
                  <TableCell>
                    <Badge className="shadow-sm" variant={req.status === "PENDING" ? "secondary" : req.status === "CONVERTED" ? "default" : "destructive"}>
                      {req.status === "PENDING" ? "قيد الانتظار" : req.status === "CONVERTED" ? "تم التحويل لحالة" : "مرفوض"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left">
                    <Link href={`/intake/${req.id}`} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hover:bg-primary/10 hover:text-primary transition-colors")}>
                      عـرض الطلـب
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
