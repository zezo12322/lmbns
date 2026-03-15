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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Users, Clock, UserCheck, ShieldAlert, Award, FileText, Search, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { buttonVariants, Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const statusLabels: Record<string, string> = {
  APPLIED: "متقدم جديد",
  UNDER_REVIEW: "قيد المراجعة",
  ACCEPTED: "مقبول مبدئياً",
  TRAINING_PENDING: "في انتظار التدريب",
  ACTIVE: "نشط",
  INACTIVE: "غير نشط",
  REJECTED: "مرفوض",
};

const statusColors: Record<string, string> = {
  APPLIED: "bg-blue-500/10 text-blue-600 border-blue-200",
  UNDER_REVIEW: "bg-amber-500/10 text-amber-600 border-amber-200",
  ACCEPTED: "bg-teal-500/10 text-teal-600 border-teal-200",
  TRAINING_PENDING: "bg-indigo-500/10 text-indigo-600 border-indigo-200",
  ACTIVE: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  INACTIVE: "bg-slate-500/10 text-slate-600 border-slate-200",
  REJECTED: "bg-red-500/10 text-red-600 border-red-200",
};

export default async function VolunteersPage() {
  await requireAuth();

  const [volunteers, applications] = await Promise.all([
    prisma.volunteerProfile.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        applications: true,
        hours: true,
      }
    }),
    prisma.volunteerApplication.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        volunteer: true
      }
    })
  ]);

  const activeCount = volunteers.filter((v: any) => v.status === "ACTIVE").length;
  const newApplicants = volunteers.filter((v: any) => v.status === "APPLIED").length;
  const totalHours = volunteers.reduce((acc: number, v: any) => acc + v.hours.reduce((hAcc: number, h: any) => hAcc + h.hours, 0), 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-2">إدارة المتطوعين</h1>
          <p className="text-lg text-muted-foreground">
            تابع ملفات المتطوعين، رحلة تدريبهم، وتوزيعهم على اللجان والفرق التنفيذية.
          </p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="shadow-sm font-semibold">تصدير للقائمة (CSV)</Button>
           <Button className="shadow-sm font-semibold gap-2">إضافة متطوع يدوياً</Button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
           <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                 <Users className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-sm font-medium text-muted-foreground">إجمالي المسجلين</p>
                 <h3 className="text-3xl font-extrabold">{volunteers.length}</h3>
              </div>
           </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
           <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600">
                 <UserCheck className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-sm font-medium text-muted-foreground">النشطين حالياً</p>
                 <h3 className="text-3xl font-extrabold">{activeCount}</h3>
              </div>
           </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
           <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-600">
                 <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-sm font-medium text-muted-foreground">طلبات جديدة</p>
                 <h3 className="text-3xl font-extrabold">{newApplicants}</h3>
              </div>
           </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-bl from-primary/5 to-transparent border-primary/20">
           <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                 <Award className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-sm font-medium text-primary">ساعات التطوع (الإجمالي)</p>
                 <h3 className="text-3xl font-extrabold text-primary">{totalHours} <span className="text-lg font-medium">ساعة</span></h3>
              </div>
           </CardContent>
        </Card>
      </div>

      {/* Main Tabs Layout */}
      <Tabs defaultValue="volunteers" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <TabsList className="bg-muted/50 p-1 border border-border/30 h-12 inline-flex rounded-xl">
            <TabsTrigger value="volunteers" className="text-base rounded-lg h-9 px-6 data-[state=active]:shadow-sm">دليل المتطوعين</TabsTrigger>
            <TabsTrigger value="applications" className="text-base rounded-lg h-9 px-6 data-[state=active]:shadow-sm">
                الطلبات الواردة
                {newApplicants > 0 && <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2">{newApplicants}</span>}
            </TabsTrigger>
            <TabsTrigger value="teams" className="text-base rounded-lg h-9 px-6 data-[state=active]:shadow-sm">الفرق واللجان</TabsTrigger>
            </TabsList>

            <div className="relative max-w-sm w-full">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                placeholder="ابحث بالاسم أو رقم الهاتف..." 
                className="pl-4 pr-10 bg-background border-border/60 focus-visible:ring-primary/40 rounded-full h-10"
                />
            </div>
        </div>

        <TabsContent value="volunteers" className="animate-in fade-in-50 duration-500">
            <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
                <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow className="hover:bg-transparent text-muted-foreground">
                    <TableHead className="font-semibold px-6 py-4">اسم المتطوع</TableHead>
                    <TableHead className="font-semibold px-6 py-4">تاريخ الانضمام</TableHead>
                    <TableHead className="font-semibold px-6 py-4 text-center">الوضع الحالي</TableHead>
                    <TableHead className="font-semibold px-6 py-4 text-center">المهارات والاهتمامات</TableHead>
                    <TableHead className="font-semibold px-6 py-4 text-center">إجمالي الساعات</TableHead>
                    <TableHead className="px-6 py-4 text-left">إجراءات</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border/30">
                    {volunteers.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground bg-muted/10">
                            <div className="flex flex-col items-center justify-center gap-3">
                                <Users className="w-8 h-8 text-muted-foreground/40" />
                                <p>لم يتم تسجيل أي متطوعين حتى الآن.</p>
                            </div>
                        </TableCell>
                    </TableRow>
                    ) : (
                    volunteers.map((v: any) => {
                        const vHours = v.hours.reduce((acc: number, h: any) => acc + h.hours, 0);
                        return (
                        <TableRow key={v.id} className="hover:bg-muted/10 transition-colors group">
                            <TableCell className="px-6 py-4">
                                <p className="font-bold text-base text-foreground/90">{`${v.firstName} ${v.lastName}`}</p>
                                <p className="text-sm text-muted-foreground font-mono mt-0.5" dir="ltr">{v.phone}</p>
                            </TableCell>
                            <TableCell className="px-6 py-4 text-muted-foreground">
                                {format(new Date(v.createdAt), 'yyyy/MM/dd')}
                            </TableCell>
                            <TableCell className="px-6 py-4 text-center">
                                <Badge variant="outline" className={cn("shadow-sm font-semibold text-xs", statusColors[v.status])}>
                                {statusLabels[v.status]}
                                </Badge>
                            </TableCell>
                            <TableCell className="px-6 py-4 text-center">
                                {v.skills.length > 0 ? (
                                    <div className="flex flex-wrap justify-center gap-1">
                                        {v.skills.slice(0, 2).map((skill: string, i: number) => (
                                            <Badge key={i} variant="secondary" className="text-[10px]">{skill}</Badge>
                                        ))}
                                        {v.skills.length > 2 && <Badge variant="secondary" className="text-[10px]">+{v.skills.length - 2}</Badge>}
                                    </div>
                                ) : (
                                    <span className="text-muted-foreground text-sm">-</span>
                                )}
                            </TableCell>
                            <TableCell className="px-6 py-4 text-center">
                                <span className={cn("font-bold", vHours > 0 ? "text-primary" : "text-muted-foreground")}>
                                    {vHours > 0 ? `${vHours} ساعة` : '-'}
                                </span>
                            </TableCell>
                            <TableCell className="px-6 py-4 text-left">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                        );
                    })
                    )}
                </TableBody>
                </Table>
            </div>
        </TabsContent>

        <TabsContent value="applications" className="animate-in fade-in-50 duration-500">
           {applications.length === 0 ? (
                 <div className="py-16 text-center text-muted-foreground bg-muted/20 rounded-2xl border border-border/50 border-dashed">
                    <FileText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-lg">صندوق الطلبات الواردة فارغ حالياً.</p>
                 </div>
           ) : (
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {applications.map((app: any) => (
                   <Card key={app.id} className="border-border/50 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                       <div className="bg-muted/30 px-5 py-4 border-b border-border/40 flex justify-between items-center">
                           <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                               <Clock className="w-4 h-4" />
                               {format(new Date(app.createdAt), 'yyyy/MM/dd')}
                           </div>
                           <Badge variant="secondary" className="bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 shadow-sm border-none">
                              جديد
                           </Badge>
                       </div>
                       <CardContent className="p-5 flex-grow space-y-4">
                           <div>
                              <h3 className="font-bold text-xl mb-1">{app.volunteer.firstName} {app.volunteer.lastName}</h3>
                              <p className="font-mono text-muted-foreground text-sm" dir="ltr">{app.volunteer.phone}</p>
                           </div>
                           <div className="bg-background rounded-lg p-3 border border-border/40 text-sm h-24 overflow-y-auto w-full max-w-full">
                              <span className="font-bold text-muted-foreground block mb-1">سبب الرغبة في التطوع:</span>
                              <p className="text-foreground/80 leading-relaxed max-h-full">
                                {app.motivation}
                              </p>
                           </div>
                           {app.availability && (
                               <p className="text-sm font-medium"><span className="text-muted-foreground">الوقت المتاح:</span> {app.availability}</p>
                           )}
                       </CardContent>
                       <div className="p-4 bg-muted/10 border-t border-border/40 flex gap-2">
                           <Button className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-sm font-bold">قبول وتحديد موعد</Button>
                           <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10 border-destructive/20 font-bold shadow-sm">رفض</Button>
                       </div>
                   </Card>
                ))}
             </div>
           )}
        </TabsContent>

        <TabsContent value="teams">
           <Card className="border-border/50 p-12 text-center text-muted-foreground">
              <Users className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-bold mb-2 text-foreground">الفرق واللجان التطوعية</h3>
              <p>شاشة لإدارة الفرق (مثل لجنة المشروعات، الأبحاث الميدانية) وتعيين الأعضاء فيها، جاري العمل عليها.</p>
           </Card>
        </TabsContent>
      </Tabs>

    </div>
  );
}
