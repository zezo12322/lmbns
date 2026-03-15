"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight, Save, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const newsSchema = z.object({
  title: z.string().min(5, "العنوان يجب أن يكون 5 حروف على الأقل"),
  slug: z.string().min(3, "الرابط يجب أن يكون 3 حروف على الأقل").regex(/^[a-z0-9-]+$/, "الرابط يجب أن يحتوي على حروف إنجليزية، أرقام وشرطات فقط"),
  content: z.string().min(20, "محتوى الخبر يجب أن يكون 20 حرفاً على الأقل"),
  coverImage: z.string().optional(),
  isPublished: z.boolean()
});

type NewsFormValues = z.infer<typeof newsSchema>;

export default function NewNewsPostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      isPublished: true
    }
  });

  const isPublished = watch("isPublished");

  const onSubmit = async (data: NewsFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/cms/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error || "حدث خطأ أثناء حفظ الخبر.");
        return;
      }
      router.push("/cms/news");
      router.refresh();
    } catch {
      alert("حدث خطأ في الاتصال بالخادم.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <Link href="/cms/news" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full")}>
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">إضافة خبر جديد</h1>
          <p className="text-muted-foreground">قم بصياغة الخبر ونشره على الموقع العام.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/50 shadow-sm">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base">عنوان الخبر <span className="text-destructive">*</span></Label>
                  <Input 
                    id="title" 
                    placeholder="أدخل عنواناً جذاباً للخبر..." 
                    className="text-lg py-6"
                    {...register("title")}
                  />
                  {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content" className="text-base">محتوى الخبر <span className="text-destructive">*</span></Label>
                  <Textarea 
                    id="content" 
                    placeholder="اكتب تفاصيل الخبر هنا..." 
                    className="min-h-[300px] resize-y text-base"
                    {...register("content")}
                  />
                  {errors.content && <p className="text-sm text-destructive">{errors.content.message}</p>}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border/50 shadow-sm">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="slug">الرابط المخصص (Slug) <span className="text-destructive">*</span></Label>
                  <Input 
                    id="slug" 
                    placeholder="english-title-here" 
                    dir="ltr"
                    className="text-left font-mono text-sm"
                    {...register("slug")}
                  />
                  <p className="text-xs text-muted-foreground">يستخدم في رابط الصفحة: /news/slug</p>
                  {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>صورة الغلاف</Label>
                  <div className="border-2 border-dashed border-border/60 rounded-xl p-8 flex flex-col items-center justify-center text-center gap-3 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <ImageIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-primary">اضغط للرفع</span> أو اسحب الصورة هنا
                    </div>
                    <p className="text-xs text-muted-foreground">PNG, JPG حتى 5MB</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-border/40">
                   <div className="flex items-center justify-between">
                     <Label className="text-base cursor-pointer" htmlFor="publish-toggle">حالة النشر</Label>
                     <div 
                        id="publish-toggle"
                        onClick={() => setValue("isPublished", !isPublished)}
                        className={cn("w-12 h-6 rounded-full transition-colors cursor-pointer relative", isPublished ? "bg-green-500" : "bg-muted-foreground/30")}
                     >
                        <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all", isPublished ? "left-1" : "right-1")} />
                     </div>
                   </div>
                   <p className="text-xs text-muted-foreground">
                     {isPublished ? "سيظهر الخبر في الموقع العام فور حفظه." : "سيتم حفظ الخبر كمسودة ولن يظهر للجمهور."}
                   </p>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full font-bold shadow-md h-12" disabled={isSubmitting}>
              {isSubmitting ? "جاري الحفظ..." : (
                <>
                  <Save className="w-5 h-5 ml-2" />
                  حفظ {isPublished ? "ونشر" : "كمسودة"}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
