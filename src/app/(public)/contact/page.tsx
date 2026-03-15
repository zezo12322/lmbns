import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-muted/30 py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">تواصل معنا</h1>
          <p className="text-xl text-muted-foreground">
            تسعدنا تلبية استفساراتكم والرد على تساؤلاتكم. يمكنكم التواصل معنا عبر الطرق التالية أو زيارة مقرنا.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <MapPin className="text-primary w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">المقر الرئيسي</h3>
                <p className="text-muted-foreground">بني سويف، شارع عبد السلام عارف، بجوار البنك الأهلي، الدور الأول.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Phone className="text-primary w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">الهاتف</h3>
                <p className="text-muted-foreground" dir="ltr">+20 100 123 4567</p>
                <p className="text-muted-foreground" dir="ltr">+20 82 233 4455</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Mail className="text-primary w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">البريد الإلكتروني</h3>
                <p className="text-muted-foreground">info@benisuef.lifemakers.org</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Clock className="text-primary w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">مواعيد العمل</h3>
                <p className="text-muted-foreground">يومياً من السبت إلى الخميس: 10 صباحاً وحتى 6 مساءً.</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="border-border/50 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6">أرسل لنا رسالة</h3>
              <form className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-semibold">الاسم</label>
                  <Input id="name" placeholder="الاسم الكريم" className="h-12 bg-muted/50" />
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-semibold">البريد الإلكتروني</label>
                    <Input id="email" type="email" placeholder="البريد الإلكتروني" className="h-12 bg-muted/50" dir="ltr" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-semibold">رقم الهاتف</label>
                    <Input id="phone" placeholder="رقم الهاتف" className="h-12 bg-muted/50 text-right" dir="ltr" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-semibold">الرسالة</label>
                  <Textarea id="message" placeholder="كيف يمكننا مساعدتك؟" rows={5} className="resize-none bg-muted/50" />
                </div>
                <Button className="w-full text-lg h-14 rounded-xl" type="button">
                  إرسال الرسالة
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
