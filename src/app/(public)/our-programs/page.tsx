import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Briefcase, BookOpen, HeartPulse, Home, ArrowLeft, Users, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

export default function ProgramsPage() {
  const programs = [
    {
      title: "برنامج دفي",
      description: "مشروع موسمي ينطلق كل شتاء لحماية الأسر المتعففة من قسوة البرد القارس. نقوم بترميم وتسقيف المنازل المتهالكة بالقرى، وتوزيع الأغطية (البطاطين) والملابس الشتوية.",
      icon: Home,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      stats: "أكثر من 5,000 بطانية و 200 سقف سنوياً",
      features: ["تسقيف المنازل بالخشب والصاج", "توزيع بطاطين ولحافات", "كسوة الشتاء للأطفال"]
    },
    {
      title: "مشروع رزق حلال",
      description: "برنامج التمكين الاقتصادي الأضخم في المؤسسة. نهدف إلى تحويل الأسر من مستهلكة وتعتمد على المساعدات إلى أسر منتجة ذات دخل ثابت ومستقل.",
      icon: Briefcase,
      color: "text-green-500",
      bg: "bg-green-500/10",
      stats: "تسليم أكثر من 800 مشروع صغير",
      features: ["توزيع تروسيكلات", "تجهيز أكشاك ومحلات", "توزيع رؤوس ماشية (أغنام وماعز)"]
    },
    {
      title: "برنامج العلم قوة",
      description: "لأن الجهل هو العدو الأول للتنمية، نركز على دعم الطلاب غير القادرين لاستكمال تعليمهم، ومحاربة التسرب من التعليم، وفتح فصول محو الأمية للكبار.",
      icon: BookOpen,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      stats: "تطوير 5 مدارس وكفالة 1,000 طالب آموزشی",
      features: ["دفع المصروفات المدرسية", "توزيع شنط مدرسية متكاملة", "قوافل توعوية للحد من التسرب"]
    },
    {
      title: "برنامج الرعاية الصحية",
      description: "التدخل الطبي العاجل والمنظم لإنقاذ حياة المرضى غير القادرين وتخفيف آلامهم عبر التعاون مع أفضل مستشفيات وعيادات محافظة بني سويف.",
      icon: HeartPulse,
      color: "text-red-500",
      bg: "bg-red-500/10",
      stats: "أكثر من 30 قافلة طبية و 500 عملية جراحية",
      features: ["قوافل طبية للقرى المحرومة", "التكفل بالعمليات الجراحية الكبرى", "توفير أدوية الأمراض المزمنة"]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-primary/5 py-20 px-4 text-center relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] -z-10" />
        
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
            برامجنا <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">التنموية</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            مجموعة متكاملة من البرامج والمبادرات المصممة بعناية لمعالجة جذور الفقر، ودعم صحة وتعليم وتمكين أهالينا في القرى الأكثر احتياجاً.
          </p>
        </div>
      </section>

      <section className="py-24 px-4 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-10">
          {programs.map((prog, idx) => (
            <Card key={idx} className="group overflow-hidden border-border/50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent -rotate-45 translate-x-16 -translate-y-16 pointer-events-none" />
              
              <CardHeader className="flex flex-row items-start gap-4 pb-4">
                <div className={cn(`p-4 rounded-2xl flex-shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3`, prog.bg)}>
                  <prog.icon className={cn(`w-10 h-10`, prog.color)} />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-3xl font-bold">{prog.title}</CardTitle>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold bg-muted px-3 py-1 rounded-full text-foreground/80 mt-2">
                    <Users className="w-4 h-4 text-primary" />
                    {prog.stats}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow space-y-6 relative z-10">
                <p className="text-muted-foreground text-lg leading-relaxed">{prog.description}</p>
                <div className="space-y-3 pt-4 border-t border-border/40">
                  <h4 className="font-bold text-foreground/90">أبرز تدخلات البرنامج:</h4>
                  <ul className="space-y-2">
                    {prog.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3 text-muted-foreground font-medium">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="pt-6 pb-8 bg-muted/5 border-t border-border/30">
                <Link href="/donate" className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto font-semibold group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all")}>
                  المساهمة في هذا البرنامج
                  <ArrowLeft className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to action section */}
      <section className="py-24 px-4 bg-primary text-primary-foreground text-center relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 mix-blend-overlay" />
         <div className="max-w-3xl mx-auto space-y-8 relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">هل لديك فكرة مشروع تنموي؟</h2>
            <p className="text-xl md:text-2xl text-primary-foreground/90 leading-relaxed">
              نحن في صناع الحياة نرحب دائماً بالأفكار والمبادرات الإبداعية التي تخدم المجتمع. انضم إلينا أو شاركنا فكرتك وسنعمل معاً على تحقيقها.
            </p>
            <div className="pt-6 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/contact" className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "h-14 px-10 rounded-full font-bold text-lg hover:scale-105 transition-transform")}>
                تواصل معنا لطرح فكرتك
              </Link>
              <Link href="/volunteer" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-14 px-10 rounded-full font-bold text-lg border-primary-foreground/30 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-all")}>
                انضم لفرق التخطيط
              </Link>
            </div>
         </div>
      </section>
    </div>
  );
}
