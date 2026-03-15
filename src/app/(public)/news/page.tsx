import { Calendar, ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewsPage() {
  const newsItems = [
    {
      id: "1",
      title: "انطلاق أضخم قافلة طبية بقرية ميدوم",
      date: "15 مارس 2026",
      excerpt: "بحضور محافظ بني سويف ومشاركة 50 طبيباً متطوعاً، انطلقت اليوم القافلة الطبية الشاملة لخدمة 2,000 مستفيد بقرية ميدوم.",
      category: "صحة",
      color: "bg-red-500/10 text-red-600 border-red-200"
    },
    {
      id: "2",
      title: "تسليم 50 مشروع (رزق حلال) للأسر المنتجة",
      date: "02 مارس 2026",
      excerpt: "ضمن جهود التمكين الاقتصادي، قامت المؤسسة بتسليم مشروعات صغيرة ومتناهية الصغر وتسليم عدد من التروسيكلات للأسر الأكثر احتياجاً.",
      category: "تمكين اقتصادي",
      color: "bg-green-500/10 text-green-600 border-green-200"
    },
    {
      id: "3",
      title: "ختام البرنامج التدريبي للمتطوعين الجدد",
      date: "20 فبراير 2026",
      excerpt: "بمشاركة 300 متطوعاً جديداً، اختتمت المؤسسة أعمال الدورة التدريبية المكثفة حول أسس العمل الخيري والتطوعي ومهارات التواصل الفعال.",
      category: "تطوع",
      color: "bg-blue-500/10 text-blue-600 border-blue-200"
    },
    {
      id: "4",
      title: "إطلاق المرحلة الثانية من حملة 'دفي' لتوزيع البطاطين",
      date: "05 يناير 2026",
      excerpt: "نستهدف هذا العام توزيع 10,000 بطانية وتسقيف 100 منزل بمختلف قرى ومراكز المحافظة لمنع تسرب مياه الأمطار وحماية الأسر من برد الشتاء.",
      category: "إغاثة الطوارئ",
      color: "bg-amber-500/10 text-amber-600 border-amber-200"
    },
    {
      id: "5",
      title: "افتتاح 3 فصول جديدة لمحو الأمية بمركز الفشن",
      date: "10 ديسمبر 2025",
      excerpt: "بالتعاون مع الهيئة العامة لتعليم الكبار، افتتحت صناع الحياة 3 فصول جديدة لتستوعب أكثر من 90 دراساً من أهالي مركز الفشن.",
      category: "تعليم",
      color: "bg-cyan-500/10 text-cyan-600 border-cyan-200"
    },
    {
      id: "6",
      title: "تنظيم مائدة إفطار كبرى للعمالة غير المنتظمة",
      date: "15 رمضان 2025",
      excerpt: "ضمن سلسلة (إفطار صائم) التي تنفذها المؤسسة بجمع أكثر من 150 متطوع لإنتاج وتوزيع 2000 وجبة يومياً.",
      category: "موسمي",
      color: "bg-purple-500/10 text-purple-600 border-purple-200"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-primary/5 py-20 px-4 text-center relative overflow-hidden text-foreground">
        {/* Abstract Background Vectors */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px] -z-10" />

        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">أحدث الأخبار <span className="text-primary">والفعاليات</span></h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            ابقَ على اطلاع بأحدث إنجازاتنا، التغطيات الميدانية، ومبادراتنا المستمرة لنصنع مستقبلاً أفضل سوياً.
          </p>
        </div>
      </section>

      <section className="py-24 px-4 max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item) => (
            <Card key={item.id} className="group overflow-hidden border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full relative relative">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="aspect-video bg-muted relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 font-bold text-4xl bg-primary/5 group-hover:bg-primary/10 transition-colors">
                  صورة الخبر
                </div>
              </div>

              <CardHeader className="flex-none pt-6 pb-2 relative z-20">
                <div className="flex items-center justify-between mb-2">
                  <span className={cn("text-xs font-bold px-3 py-1 rounded-full border", item.color)}>
                    {item.category}
                  </span>
                  <div className="flex items-center text-xs text-muted-foreground font-medium">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {item.date}
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-grow pt-2 relative z-20">
                <p className="text-muted-foreground leading-relaxed line-clamp-3">
                  {item.excerpt}
                </p>
              </CardContent>

              <CardFooter className="pt-4 pb-6 mt-auto border-t border-border/20 bg-muted/5 relative z-20">
                <Link href={`/news/${item.id}`} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "w-full justify-between group-hover:text-primary font-bold hover:bg-primary/10")}>
                  قراءة التفاصيل
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
           <button className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full font-bold w-full sm:w-auto shadow-sm")}>
             تحميل المزيد من الأخبار
             <ArrowLeft className="w-4 h-4 mr-2" />
           </button>
        </div>
      </section>

      {/* Subscription Callout */}
      <section className="py-20 px-4 bg-muted/40 border-t border-border/40 text-center">
         <div className="max-w-2xl mx-auto space-y-6 bg-background p-10 rounded-3xl border border-border/50 shadow-sm relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
             <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
             
             <h3 className="text-3xl font-extrabold tracking-tight relative z-10">النشرة الإخبارية</h3>
             <p className="text-muted-foreground text-lg relative z-10">اشترك ليصلك عبر البريد حصاد الأسبوع التنموي وتطورات أعمال الصناع الميدانية.</p>
             <form className="flex flex-col sm:flex-row gap-3 pt-4 relative z-10 justify-center">
               <input type="email" placeholder="أدخل بريدك الإلكتروني" className="flex-1 h-12 rounded-full border border-border/60 bg-muted px-4 text-center sm:text-right focus:outline-none focus:ring-2 focus:ring-primary/50" />
               <button type="submit" className={cn(buttonVariants(), "h-12 px-8 rounded-full font-bold shadow-md")}>اشترك الآن</button>
             </form>
         </div>
      </section>
    </div>
  );
}
