import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Calendar, ArrowLeft, ArrowRight, Share2, Heart } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

export default async function PublicNewsDetailPage({ params }: { params: { slug: string } }) {
  // Try to find by slug first, or ID
  const article = await prisma.newsPost.findFirst({
    where: {
      OR: [
        { id: params.slug },
        { slug: params.slug }
      ],
      isPublished: true,
    }
  });

  if (!article) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
       {/* Hero Cover */}
       <section className="relative w-full h-[400px] md:h-[500px] bg-muted overflow-hidden flex items-end">
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
         
         {/* Placeholder for Cover Image */}
         {article.coverImage ? (
           <img src={article.coverImage} alt={article.title} className="absolute inset-0 w-full h-full object-cover" />
         ) : (
           <div className="absolute inset-0 w-full h-full bg-primary/20 flex justify-center items-center">
             <span className="text-white/40 font-bold text-4xl">صورة الغلاف</span>
           </div>
         )}
         
         <div className="relative z-20 max-w-4xl mx-auto w-full px-4 pb-12">
            <div className="flex items-center gap-4 mb-4 text-white/90">
              <span className="text-sm font-bold px-3 py-1 rounded-full bg-primary text-primary-foreground">
                أخبار
              </span>
              <span className="flex items-center text-sm font-medium">
                <Calendar className="w-4 h-4 mr-1.5" />
                {new Intl.DateTimeFormat('ar-EG', { dateStyle: 'long' }).format(new Date(article.createdAt))}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
              {article.title}
            </h1>
         </div>
       </section>

       {/* Content & Sidebar */}
       <section className="py-16 px-4 max-w-6xl mx-auto w-full grid lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <article className="lg:col-span-8 prose prose-lg prose-slate dark:prose-invert max-w-none text-muted-foreground leading-loose">
            <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }} />
            
            <div className="mt-12 pt-8 border-t border-border/40 flex items-center gap-4">
              <h4 className="m-0 font-bold text-foreground">مشاركة الخبر:</h4>
              <button className={cn(buttonVariants({ variant: "outline", size: "icon" }), "rounded-full")}>
                 <Share2 className="w-4 h-4" />
              </button>
              <button className={cn(buttonVariants({ variant: "outline", size: "icon" }), "rounded-full hover:bg-red-50 hover:text-red-500 hover:border-red-200")}>
                 <Heart className="w-4 h-4" />
              </button>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
             <div className="bg-muted/30 p-8 rounded-3xl border border-border/50 text-center space-y-4">
                <h3 className="text-2xl font-bold">دعم جهودنا</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">أنت أيضاً يمكنك أن تكون جزءاً من هذا الأثر الإيجابي من خلال التبرع أو التطوع معنا.</p>
                <div className="flex flex-col gap-3 pt-4">
                   <Link href="/donate" className={cn(buttonVariants(), "w-full rounded-full font-bold shadow-md")}>
                     تبرع الآن
                   </Link>
                   <Link href="/volunteer" className={cn(buttonVariants({ variant: "outline" }), "w-full rounded-full font-bold")}>
                     انضم لفريق التطوع
                   </Link>
                </div>
             </div>

             <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center border-r-4 border-primary pr-3">مواضيع ذات صلة</h3>
                <div className="p-4 bg-muted/20 border border-border/40 rounded-xl hover:border-primary/40 transition-colors">
                  <span className="text-xs text-muted-foreground mb-1 block">قبل 3 أيام</span>
                  <Link href="/news" className="font-bold text-foreground hover:text-primary transition-colors block">
                    استكمال توزيع الشنط المدرسية في قري مركز ببا
                  </Link>
                </div>
                <div className="p-4 bg-muted/20 border border-border/40 rounded-xl hover:border-primary/40 transition-colors">
                  <span className="text-xs text-muted-foreground mb-1 block">الأسبوع الماضي</span>
                  <Link href="/news" className="font-bold text-foreground hover:text-primary transition-colors block">
                    تكريم متطوعي صناع الحياة وتوزيع شهادات التقدير
                  </Link>
                </div>
             </div>
          </aside>
       </section>

       <div className="max-w-6xl mx-auto w-full px-4 pb-20">
         <Link href="/news" className={cn(buttonVariants({ variant: "ghost" }), "text-muted-foreground hover:text-primary")}>
           <ArrowRight className="w-5 h-5 ml-2" />
           العودة إلى جميع الأخبار
         </Link>
       </div>
    </div>
  );
}
