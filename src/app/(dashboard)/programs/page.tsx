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
import { arEG } from "date-fns/locale";
import { 
  Building2, 
  MapPin, 
  Users, 
  Target, 
  Activity, 
  Plus, 
  MoreHorizontal,
  FolderKanban,
  Coins,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  COMPLETED: "bg-blue-500/10 text-blue-600 border-blue-200",
  PLANNED: "bg-amber-500/10 text-amber-600 border-amber-200",
  SUSPENDED: "bg-red-500/10 text-red-600 border-red-200",
};

const statusLabels: Record<string, string> = {
  ACTIVE: "جاري التنفيذ",
  COMPLETED: "مكتمل",
  PLANNED: "مُخطط",
  SUSPENDED: "معلق",
};

export default async function ProgramsPage() {
  await requireAuth();

  // Fetching Programs along with nested Projects, Cohorts, and Enrollments
  const programs = await prisma.program.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      projects: {
        include: {
          cohorts: {
            include: {
              enrollments: true
            }
          },
          milestones: true,
          funders: true
        }
      }
    }
  });

  const allProjects = programs.flatMap(p => p.projects.map(proj => ({...proj, programName: p.name})));
  
  const totalProjects = allProjects.length;
  const activeProjects = allProjects.filter(p => !p.name.includes('مكتمل')).length; // Mock logic for demo as project doesn't have native status in schema, derived by milestones or cohorts typically. We assume all are active for MVP.
  
  let totalBeneficiaries = 0;
  let totalBudget = 0;

  allProjects.forEach(proj => {
    totalBudget += proj.budget || 0;
    proj.cohorts.forEach(cohort => {
      totalBeneficiaries += cohort.enrollments.length;
    });
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-2">البرامج التنموية</h1>
          <p className="text-lg text-muted-foreground">
            لوحة تحكم شاملة لإدارة خطوط البرامج، المشاريع الفرعية، ومتابعة مخرجات التنفيذ.
          </p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="shadow-sm font-semibold">إضافة برنامج رئيسي</Button>
           <Button className="shadow-sm font-semibold gap-2">
             <Plus className="w-5 h-5" /> بناء مشروع جديد
           </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
           <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                 <FolderKanban className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-sm font-medium text-muted-foreground">إجمالي المشاريع</p>
                 <h3 className="text-3xl font-extrabold">{totalProjects}</h3>
              </div>
           </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
           <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600">
                 <Activity className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-sm font-medium text-muted-foreground">مشاريع نَشطة</p>
                 <h3 className="text-3xl font-extrabold">{activeProjects}</h3>
              </div>
           </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
           <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600">
                 <Users className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-sm font-medium text-muted-foreground">المستفيدين الموصولين</p>
                 <h3 className="text-3xl font-extrabold">{totalBeneficiaries}</h3>
              </div>
           </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-bl from-primary/5 to-transparent border-primary/20">
           <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                 <Coins className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-sm font-medium text-primary">الميزانيات المعتمدة</p>
                 <h3 className="text-3xl font-extrabold text-primary">
                   {new Intl.NumberFormat('ar-EG', { notation: "compact", compactDisplay: "short" }).format(totalBudget)} <span className="text-base font-medium">ج.م</span>
                 </h3>
              </div>
           </CardContent>
        </Card>
      </div>

      {/* Main Tabs Layout */}
      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 border border-border/30 h-12 inline-flex rounded-xl">
           <TabsTrigger value="projects" className="text-base rounded-lg h-9 px-6 data-[state=active]:shadow-sm">سجل المشاريع</TabsTrigger>
           <TabsTrigger value="programs" className="text-base rounded-lg h-9 px-6 data-[state=active]:shadow-sm">الخطوط البرامجية</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="animate-in fade-in-50 duration-500">
            <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
                <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow className="hover:bg-transparent text-muted-foreground">
                    <TableHead className="font-semibold px-6 py-4">اسم المشروع</TableHead>
                    <TableHead className="font-semibold px-6 py-4">البرنامج الرئيسي</TableHead>
                    <TableHead className="font-semibold px-6 py-4 text-center">المستفيدين</TableHead>
                    <TableHead className="font-semibold px-6 py-4 text-center">الميزانية التقديرية</TableHead>
                    <TableHead className="font-semibold px-6 py-4 text-center">الإنجاز (Milestones)</TableHead>
                    <TableHead className="px-6 py-4 text-left">إجراءات</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border/30">
                    {allProjects.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center py-16 text-muted-foreground bg-muted/10">
                            <div className="flex flex-col items-center justify-center gap-3">
                                <Target className="w-10 h-10 text-muted-foreground/40" />
                                <p className="text-lg">لم يتم إنشاء أي مشاريع فرعية حتى الآن.</p>
                                <Button variant="outline" className="mt-2 text-primary border-primary/20 bg-primary/5">
                                    إنشاء أول مشروع
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                    ) : (
                    allProjects.map((proj: any) => {
                        const beneficiariesCount = proj.cohorts.reduce((acc: number, c: any) => acc + c.enrollments.length, 0);
                        const completedMilestones = proj.milestones.filter((m: any) => m.status === 'COMPLETED').length;
                        const progress = proj.milestones.length > 0 ? Math.round((completedMilestones / proj.milestones.length) * 100) : 0;
                        
                        return (
                        <TableRow key={proj.id} className="hover:bg-muted/10 transition-colors group">
                            <TableCell className="px-6 py-4">
                                <p className="font-bold text-base text-foreground/90">{proj.name}</p>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-1 max-w-[250px]">{proj.description}</p>
                            </TableCell>
                            <TableCell className="px-6 py-4 text-muted-foreground">
                                <Badge variant="secondary" className="bg-muted">{proj.programName}</Badge>
                            </TableCell>
                            <TableCell className="px-6 py-4 text-center font-semibold">
                                {beneficiariesCount} حالة
                            </TableCell>
                            <TableCell className="px-6 py-4 text-center">
                                <span className={cn("font-bold font-mono", proj.budget ? "text-primary" : "text-muted-foreground")}>
                                    {proj.budget ? `${new Intl.NumberFormat('ar-EG').format(proj.budget)} ج.م` : '-'}
                                </span>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                                <div className="flex flex-col items-center gap-1.5">
                                   <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                                      <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${progress}%` }} />
                                   </div>
                                   <span className="text-[11px] font-medium text-muted-foreground">{completedMilestones} من {proj.milestones.length} مراحل</span>
                                </div>
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

        <TabsContent value="programs" className="animate-in fade-in-50 duration-500">
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.length === 0 ? (
                 <div className="col-span-full py-16 text-center text-muted-foreground bg-muted/20 border border-border/50 border-dashed rounded-xl">
                    <Building2 className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-lg">لا يوجد خطوط رئيسية (برامج) مسجلة.</p>
                 </div>
              ) : (
                programs.map((program: any) => (
                   <Card key={program.id} className="border-border/50 shadow-sm hover:shadow-md transition-all overflow-hidden">
                       <CardHeader className="bg-muted/30 border-b border-border/40 pb-4">
                          <div className="flex justify-between items-start gap-4">
                             <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-background rounded-lg shadow-sm border border-border/50 text-primary">
                                   <Target className="w-5 h-5" />
                                </div>
                                <CardTitle className="text-xl">{program.name}</CardTitle>
                             </div>
                             <Badge variant="outline" className={cn("font-semibold shadow-sm", statusColors[program.status] || statusColors.ACTIVE)}>
                                {statusLabels[program.status] || program.status}
                             </Badge>
                          </div>
                          {program.description && (
                            <p className="text-sm text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
                               {program.description}
                            </p>
                          )}
                       </CardHeader>
                       <CardContent className="p-0">
                          <div className="p-4 bg-background">
                             <div className="flex justify-between text-sm text-foreground/80 font-medium mb-3 pb-3 border-b border-border/40">
                                <span>تاريخ الإطلاق</span>
                                <span>{program.startDate ? format(new Date(program.startDate), 'dd MMMM yyyy', { locale: arEG }) : 'غير محدد'}</span>
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="bg-muted/40 p-3 rounded-lg text-center">
                                   <p className="text-xs text-muted-foreground mb-1">المشاريع</p>
                                   <p className="font-bold text-lg text-primary">{program.projects.length}</p>
                                </div>
                                <div className="bg-muted/40 p-3 rounded-lg text-center">
                                   <p className="text-xs text-muted-foreground mb-1">الرعاة/الممولين</p>
                                   <p className="font-bold text-lg text-primary">
                                     {program.projects.reduce((acc: number, p: any) => acc + p.funders.length, 0)}
                                   </p>
                                </div>
                             </div>
                          </div>
                          <div className="p-4 bg-muted/10 border-t border-border/40">
                             <Button variant="outline" className="w-full bg-background font-semibold">استعراض مشاريع البرنامج</Button>
                          </div>
                       </CardContent>
                   </Card>
                ))
              )}
           </div>
        </TabsContent>
        
      </Tabs>
    </div>
  );
}
