"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/lib/button-variants";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function VolunteerPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      motivation: formData.get("motivation"),
      availability: formData.get("availability"),
    };

    try {
      const res = await fetch("/api/public/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed");
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-4">تطوع معنا</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          انضم إلى فريق المتطوعين بصناع الحياة وكن جزءاً من التغيير الإيجابي في مجتمعك.
        </p>
      </div>

      <Card className="border-border/60 shadow-lg shadow-black/5 overflow-hidden">
        <div className="h-2 w-full bg-gradient-to-r from-primary to-primary/60" />
        <CardContent className="p-6 md:p-10">
          {status === "success" ? (
            <div className="rounded-lg bg-green-50 p-6 text-center text-green-800 border-green-200 border">
              <h3 className="text-xl font-bold mb-2">تم تسجيل طلب التطوع بنجاح!</h3>
              <p>شكراً لاهتمامك بالانضمام إلينا. سيتم التواصل معك قريباً لتحديد موعد للمقابلة الشخصية.</p>
              <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "mt-6")}>
                العودة للرئيسية
              </Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="firstName" className="font-semibold">الاسم الأول</Label>
                  <Input id="firstName" name="firstName" required className="h-12 border-border/60 focus-visible:ring-primary/40 text-base" />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="lastName" className="font-semibold">اسم العائلة</Label>
                  <Input id="lastName" name="lastName" required className="h-12 border-border/60 focus-visible:ring-primary/40 text-base" />
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="phone" className="font-semibold">رقم الهاتف النشط</Label>
                  <Input id="phone" name="phone" required placeholder="01X XXXX XXXX" dir="ltr" className="h-12 text-right border-border/60 focus-visible:ring-primary/40 text-base" />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="email" className="font-semibold">البريد الإلكتروني</Label>
                  <Input id="email" name="email" type="email" placeholder="example@domain.com" dir="ltr" className="h-12 text-right border-border/60 focus-visible:ring-primary/40 text-base" />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="motivation" className="font-semibold">لماذا ترغب في التطوع معنا؟</Label>
                <Textarea 
                  id="motivation" 
                  name="motivation" 
                  required 
                  placeholder="حدثنا عن مهاراتك وشغفك بالعمل التطوعي..." 
                  rows={4}
                  className="resize-none border-border/60 focus-visible:ring-primary/40 text-base p-4"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="availability" className="font-semibold">الأوقات المتاحة للتطوع</Label>
                <Input id="availability" name="availability" placeholder="مثال: أيام الجمعة والسبت، أو يومياً بعد الساعة 5 مساءً" className="h-12 border-border/60 focus-visible:ring-primary/40 text-base" />
              </div>

              {status === "error" && (
                <p className="text-sm border p-3 rounded text-destructive bg-destructive/10">حدث خطأ أثناء إرسال الطلب، يرجى المحاولة لاحقاً.</p>
              )}

              <Button type="submit" size="lg" className="w-full h-14 text-lg font-bold shadow-md hover:shadow-lg transition-all rounded-xl mt-4" disabled={status === "submitting"}>
                {status === "submitting" ? "جاري الإرسال..." : "إرسال طلب التطوع"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
