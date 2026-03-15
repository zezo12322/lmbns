import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth-utils";
import { 
  FileText, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Briefcase,
  Award,
  Zap,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants, Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { arEG } from "date-fns/locale";

const statusColors: Record<string, string> = {
  APPLIED: "bg-blue-500/10 text-blue-600 border-blue-200",
  UNDER_REVIEW: "bg-amber-500/10 text-amber-600 border-amber-200",
  ACCEPTED: "bg-teal-500/10 text-teal-600 border-teal-200",
  TRAINING_PENDING: "bg-indigo-500/10 text-indigo-600 border-indigo-200",
  ACTIVE: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  INACTIVE: "bg-slate-500/10 text-slate-600 border-slate-200",
  REJECTED: "bg-red-500/10 text-red-600 border-red-200",
};

const statusLabels: Record<string, string> = {
  APPLIED: "متقدم جديد",
  UNDER_REVIEW: "قيد المراجعة",
  ACCEPTED: "مقبول مبدئياً",
  TRAINING_PENDING: "في انتظار التدريب",
  ACTIVE: "نشط",
  INACTIVE: "غير نشط",
  REJECTED: "مرفوض",
};

export default async function VolunteerProfilePage({ params }: { params: { id: string } }) {
  await requireAuth();

  const volunteer = await prisma.volunteerProfile.findUnique({
    where: { id: params.id },
    include: {
      center: true,
      teams: true,
      hours: {
        orderBy: { date: 'desc' }
      },
      attendances: {
        include: { session: true },
        orderBy: { createdAt: 'desc' }
      },
      applications: true
    }
  });

  if (!volunteer) notFound();

  const totalHours = volunteer.hours.reduce((acc: number, h: any) => acc + h.hours, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 bg-card p-6 md:p-8 rounded-2xl border border-border/50 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="space-y-4 relative z-10 w-full flex-grow">
           <div className="flex flex-wrap items-center justify-between gap-4">
               <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-extrabold tracking-tight">{volunteer.firstName} {volunteer.lastName}</h1>
                    <Badge variant="outline" className={cn("font-bold text-sm shadow-sm", statusColors[volunteer.status])}>
                      {statusLabels[volunteer.status]}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground font-medium text-sm">
                    {volunteer.nationalId && (
                      <span className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-md mb-2 sm:mb-0">
                        الرقم القومي: <span className="font-mono">{volunteer.nationalId}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" /> 
                      انضم في {format(new Date(volunteer.createdAt), 'dd MMMM yyyy', { locale: arEG })}
                    </span>
                    {volunteer.center && (
                       <span className="flex items-center gap-1.5">
                         <MapPin className="w-4 h-4 text-primary" />
                         {volunteer.center.name}
                       </span>
                    )}
                  </div>
               </div>
               
               <div className="flex gap-2">
                  <Button variant="outline" className="shadow-sm font-semibold">تعليق الحساب</Button>
                  <Button className="shadow-sm font-semibold gap-2">تعديل الملف</Button>
               </div>
           </div>

           {volunteer.skills.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-sm font-medium text-muted-foreground ml-2">المهارات:</span>
                {volunteer.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-primary/5 text-primary hover:bg-primary/10 transition-colors">
                    {skill}
                  </Badge>
                ))}
              </div>
           )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
         {/* Left Column - Key Info */}
         <div className="lg:col-span-1 space-y-6">
            
            <Card className="border-border/50 shadow-sm overflow-hidden text-center sm:text-right">
               <CardHeader className="bg-muted/10 border-b border-border/40 pb-4">
                 <CardTitle className="text-lg flex justify-center sm:justify-start items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" /> ملخص النشاط
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-center py-4 bg-gradient-to-br from-primary/5 to-transparent rounded-xl border border-primary/10">
                     <Award className="w-10 h-10 text-primary mb-2" />
                     <h3 className="text-4xl font-black text-primary mb-1">{totalHours}</h3>
                     <p className="text-sm text-foreground/80 font-semibold mb-1">إجمالي ساعات التطوع</p>
                     <p className="text-xs text-muted-foreground">ساهم في {volunteer.hours.length} نشاطات</p>
                  </div>

                  <div className="space-y-4 mt-6 text-sm text-right">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                       <span className="text-muted-foreground flex items-center gap-2"><Phone className="w-4 h-4" /> الهاتف</span>
                       <span className="font-semibold" dir="ltr">{volunteer.phone}</span>
                    </div>
                    {volunteer.email && (
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                         <span className="text-muted-foreground flex items-center gap-2"><Mail className="w-4 h-4" /> البريد</span>
                         <span className="font-semibold" dir="ltr">{volunteer.email}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                       <span className="text-muted-foreground flex items-center gap-2"><Briefcase className="w-4 h-4" /> اللجان التابع لها</span>
                       <span className="font-semibold">{volunteer.teams.length > 0 ? volunteer.teams.length : 'غير مسجل'}</span>
                    </div>
                  </div>
               </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
               <CardHeader className="pb-3 border-b border-border/40">
                 <CardTitle className="text-base font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> حضور التدريبات
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-0 text-sm">
                  {volunteer.attendances.length === 0 ? (
                     <div className="p-6 text-center text-muted-foreground">
                        لم يتم تسجيل حضور أي تدريبات.
                     </div>
                  ) : (
                     <div className="divide-y divide-border/40">
                        {volunteer.attendances.map(att => (
                           <div key={att.id} className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors">
                              <div>
                                 <p className="font-semibold leading-none mb-1">{att.session.title}</p>
                                 <p className="text-xs text-muted-foreground">{format(new Date(att.session.date), 'dd/MM/yyyy')}</p>
                              </div>
                              <Badge variant={att.attended ? "default" : "secondary"}>
                                 {att.attended ? "حاضر" : "غائب"}
                              </Badge>
                           </div>
                        ))}
                     </div>
                  )}
               </CardContent>
            </Card>

         </div>

         {/* Right Column - Logs & Hours */}
         <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/50 shadow-sm h-full flex flex-col">
               <div className="px-6 py-5 border-b border-border/50 flex flex-wrap gap-4 justify-between items-center bg-muted/10">
                 <CardTitle className="text-xl flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" /> سجل الأنشطة وساعات التطوع
                 </CardTitle>
                 <Button size="sm" className="font-semibold">تسجيل ساعات نشاط</Button>
               </div>
               
               <CardContent className="p-0 flex-grow">
                  {volunteer.hours.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground h-full min-h-[300px]">
                        <Activity className="w-12 h-12 text-muted-foreground/30 mb-4" />
                        <h4 className="text-lg font-bold mb-2">لا يوجد ساعات مسجلة</h4>
                        <p className="max-w-sm">لم يتم تسجيل أي ساعات تطوع منجزة للمتطوع حتى الآن في الميدان أو في اللجان التنظيمية.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border/40">
                      <div className="bg-muted/40 grid grid-cols-4 p-4 text-sm font-semibold text-muted-foreground">
                         <div className="col-span-2">اسم النشاط / المشروع</div>
                         <div className="text-center">التاريخ</div>
                         <div className="text-left pl-4">عدد الساعات</div>
                      </div>
                      <div className="max-h-[500px] overflow-y-auto">
                        {volunteer.hours.map((log: any) => (
                           <div key={log.id} className="grid grid-cols-4 p-4 items-center hover:bg-muted/10 transition-colors text-sm">
                              <div className="col-span-2 font-medium">{log.activity}</div>
                              <div className="text-center text-muted-foreground">{format(new Date(log.date), 'yyyy/MM/dd')}</div>
                              <div className="text-left pl-4 font-bold text-primary">{log.hours} س</div>
                           </div>
                        ))}
                      </div>
                    </div>
                  )}
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
}
