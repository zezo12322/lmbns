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
import { cn } from "@/lib/utils";
import { PlusCircle, Search, Edit2, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DeleteNewsButton } from "./delete-button";

export default async function CMSNewsPage() {
  await requireAuth();

  const news = await prisma.newsPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-2">إدارة الأخبار والفعاليات</h1>
          <p className="text-lg text-muted-foreground">
            إضافة، تعديل، وحذف الأخبار والمنشورات التي تظهر على الموقع العام.
          </p>
        </div>
        <Link href="/cms/news/new" className={cn(buttonVariants(), "shadow-md hover:shadow-lg transition-all text-sm font-semibold")}>
          <PlusCircle className="w-4 h-4 ml-2" />
          إضافة خبر جديد
        </Link>
      </div>

      <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-xl border border-border/50">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="ابحث في عناوين الأخبار..." 
            className="pl-4 pr-10 bg-background border-border/50 focus-visible:ring-primary/40"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold text-foreground">العنوان</TableHead>
              <TableHead className="font-semibold text-foreground">الحالة</TableHead>
              <TableHead className="font-semibold text-foreground">تاريخ الإنشاء</TableHead>
              <TableHead className="font-semibold text-foreground">الرابط</TableHead>
              <TableHead className="text-left font-semibold text-foreground">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {news.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground bg-muted/10">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="p-4 rounded-full bg-primary/10">
                      <Calendar className="w-8 h-8 text-primary/60" />
                    </div>
                    <p>لا توجد أخبار منشورة حالياً.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              news.map((item: any, index: number) => (
                <TableRow key={item.id} className={cn("transition-colors hover:bg-muted/30", index % 2 === 0 ? "bg-background" : "bg-muted/10")}>
                  <TableCell className="font-semibold text-primary/90 max-w-xs pr-4">
                    <div className="truncate" title={item.title}>{item.title}</div>
                  </TableCell>
                  <TableCell>
                    {item.isPublished ? (
                      <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-200 shadow-sm">منشور</Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground bg-muted shadow-sm">مسودة</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Intl.DateTimeFormat('ar-EG', { dateStyle: 'medium' }).format(new Date(item.createdAt))}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm font-mono" dir="ltr">
                    /{item.slug}
                  </TableCell>
                  <TableCell className="text-left rtl:space-x-reverse space-x-2">
                    <Link href={`/cms/news/${item.id}/edit`} className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "text-blue-500 hover:text-blue-600 hover:bg-blue-50 h-8 w-8")}>
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <DeleteNewsButton id={item.id} />
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
