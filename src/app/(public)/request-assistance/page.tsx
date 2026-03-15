"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function RequestAssistancePage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);
    const data = {
      requestorName: formData.get("requestorName"),
      phone: formData.get("phone"),
      nationalId: formData.get("nationalId"),
      description: formData.get("description"),
    };

    try {
      const res = await fetch("/api/public/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-4">طلب مساعدة / كفالة</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          يسعدنا استقبال طلباتكم ودراستها من قبل لجنة البحث الميداني. يرجى توفير معلومات دقيقة.
        </p>
      </div>

      <Card className="border-border/60 shadow-lg shadow-black/5 overflow-hidden">
        <div className="h-2 w-full bg-gradient-to-r from-primary to-primary/60" />
        <CardContent className="p-6 md:p-10">
          {status === "success" ? (
            <div className="rounded-lg bg-green-50 p-6 text-center text-green-800 border-green-200 border">
              <h3 className="text-xl font-bold mb-2">تم تسجيل طلبك بنجاح</h3>
              <p>رقم طلبك محفوظ لدينا وسيتم التواصل معك قريباً بعد دراسة الحالة من قبل الباحثين.</p>
              <Button className="mt-6" variant="outline" onClick={() => setStatus("idle")}>
                إرسال طلب آخر
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="requestorName" className="font-semibold">الاسم الرباعي</Label>
                <Input id="requestorName" name="requestorName" required placeholder="مثال: أحمد محمد علي حسن" className="h-12 border-border/60 focus-visible:ring-primary/40 text-base" />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="phone" className="font-semibold">رقم الهاتف النشط</Label>
                  <Input id="phone" name="phone" required placeholder="01X XXXX XXXX" dir="ltr" className="h-12 text-right border-border/60 focus-visible:ring-primary/40 text-base" />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="nationalId" className="font-semibold">الرقم القومي (اختياري)</Label>
                  <Input id="nationalId" name="nationalId" placeholder="14 رقم" dir="ltr" className="h-12 text-right border-border/60 focus-visible:ring-primary/40 text-base" />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="description" className="font-semibold">وصف موجز للحالة أو نوع المساعدة المطلوبة</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  required 
                  placeholder="رجاء كتابة تفاصيل الوضع والأولويات المطلوبة (علاج، تسقيف، سداد دين...)" 
                  rows={5}
                  className="resize-none border-border/60 focus-visible:ring-primary/40 text-base p-4"
                />
              </div>

              {status === "error" && (
                <p className="text-sm border p-3 rounded text-destructive bg-destructive/10">حدث خطأ أثناء إرسال الطلب، يرجى المحاولة لاحقاً.</p>
              )}

              <Button type="submit" size="lg" className="w-full h-14 text-lg font-bold shadow-md hover:shadow-lg transition-all rounded-xl mt-4" disabled={status === "submitting"}>
                {status === "submitting" ? "جاري الإرسال..." : "إرسال الطلب للاعتماد"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
