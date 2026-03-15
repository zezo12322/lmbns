import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { ArrowLeft, BookOpen, Briefcase, HeartPulse, Home as HomeIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-24 px-4 md:py-36 flex flex-col items-center justify-center text-center">
        {/* Decorative ambient background blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-foreground mb-6 leading-tight max-w-[1200px]">
          معاً <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">نصنع الحياة</span> في بني سويف
        </h1>
        <p className="text-xl md:text-3xl text-muted-foreground/90 max-w-[1000px] mb-12 leading-relaxed">
          نعمل على تنمية المجتمع ودعم الفئات الأكثر احتياجاً من خلال العمل التطوعي والبرامج التنموية المستدامة.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
          <Link href="/donate" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto text-lg h-14 px-10 rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r from-primary to-primary/80")}>
            ساهم في التغيير - تبرع الآن
          </Link>
          <Link href="/request-assistance" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "w-full sm:w-auto text-lg h-14 px-10 rounded-full border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300")}>
            طلب مساعدة / كفالة
          </Link>
        </div>
      </section>

      {/* Stats / Impact Section */}
      <section className="py-24 px-4 bg-muted/30 border-t border-border/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 inline-block mb-4">أثرنا في المجتمع</h2>
            <div className="h-1.5 w-24 bg-primary rounded-full mx-auto" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 text-center">
            {[
              { label: 'مستفيد سنوياً', value: '15,000+' },
              { label: 'متطوع نشط', value: '3,500+' },
              { label: 'قرية ومركز مخدوم', value: '12' },
              { label: 'برنامج ومشروع تنموي', value: '25+' }
            ].map((stat, i) => (
              <div key={i} className="group p-8 rounded-2xl bg-background border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:border-primary/20 transition-all duration-300">
                <div className="text-4xl md:text-5xl font-extrabold text-primary mb-3 group-hover:scale-110 transition-transform duration-300 inline-block">{stat.value}</div>
                <div className="text-sm md:text-base font-semibold text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section Snippet */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold tracking-tight">من نحن</h2>
            <div className="h-1.5 w-20 bg-primary rounded-full" />
            <p className="text-xl text-muted-foreground leading-relaxed">
              نحن جزء من لجان مؤسسة صناع الحياة مصر بمحافظة بني سويف. نهدف إلى النهوض بالمجتمع، عبر تقديم حزمة من المبادرات والمشروعات التنموية الشاملة. نؤمن بقوة الشباب المتطوع والعمل المؤسسي لتحقيق أثر مستدام يغير حياة الآلاف نحو الأفضل.
            </p>
            <ul className="space-y-4 pt-4">
              {[
                "مساعدة الأسر الأكثر احتياجاً",
                "تمكين الشباب المتطوعين",
                "المساهمة في القوافل الطبية التعليمية",
                "مشاريع التمكين الاقتصادي"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-lg font-medium text-foreground/80">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="pt-6">
              <Link href="/about" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "group font-semibold rounded-full")}>
                اقرأ المزيد عنا
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-muted/50 border border-border pb-10 shadow-2xl relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
              <div className="space-y-4 text-center z-10 p-6">
                <div className="text-primary font-bold text-6xl">رؤيتنا</div>
                <p className="text-xl font-medium text-foreground/80 max-w-sm mx-auto">
                  تنمية المجتمع المصري عن طريق بناء إنسان منتج ومجتمع متعاون ومترابط.
                </p>
              </div>
            </div>
            {/* Decorative block */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-3xl -z-10" />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-500/10 rounded-full -z-10 blur-xl" />
          </div>
        </div>
      </section>

      {/* Programs Snippet */}
      <section className="py-24 px-4 bg-muted/20 border-t border-border/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-bold tracking-tight mb-4">أبرز برامجنا</h2>
              <div className="h-1.5 w-24 bg-primary rounded-full" />
            </div>
            <Link href="/our-programs" className={cn(buttonVariants({ variant: "ghost" }), "text-primary font-semibold hover:bg-primary/10")}>
              عرض كل البرامج
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "رزق حلال", desc: "تمكين الشباب والأسر اقتصادياً من خلال مشاريع صغيرة.", icon: Briefcase, color: "text-green-600", bg: "bg-green-600/10" },
              { title: "دفي", desc: "توفير بطاطين وأسقف للأسر لحمايتهم من برد الشتاء.", icon: HomeIcon, color: "text-blue-600", bg: "bg-blue-600/10" },
              { title: "الرعاية الصحية", desc: "قوافل طبية وعمليات جراحية مجانية لغير القادرين.", icon: HeartPulse, color: "text-red-600", bg: "bg-red-600/10" }
            ].map((prog, i) => (
              <div key={i} className="group bg-background p-8 rounded-3xl border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", prog.bg)}>
                  <prog.icon className={cn("w-7 h-7", prog.color)} />
                </div>
                <h3 className="text-2xl font-bold mb-3">{prog.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{prog.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action (Volunteer) */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-20" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10" />
        
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">هل ترغب في ترك بصمة إيجابية؟</h2>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            انضم الآن إلى فريق المتطوعين بصناع الحياة بني سويف، وكن سبباً في تغيير حياة شخص ما للأفضل. نحن نؤمن بأن وقتك ومجهودك يمكن أن يصنعا المعجزات.
          </p>
          <div className="pt-4">
            <Link href="/volunteer" className={cn(buttonVariants({ size: "lg" }), "h-14 px-12 rounded-full text-lg shadow-lg hover:-translate-y-1 transition-transform")}>
              ابدأ رحلة التطوع
            </Link>
          </div>
        </div>
      </section>

      {/* Partners / Sponsors */}
      <section className="py-16 px-4 bg-muted/40 border-t border-border/40 text-center">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-lg font-semibold text-muted-foreground mb-10">شركاء النجاح</h3>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholders for partner logos */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-2 font-bold text-2xl text-foreground">
                <div className="w-8 h-8 rounded-full bg-primary/40" />
                شريك {i}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
