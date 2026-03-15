import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, CreditCard, Landmark, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DonatePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-gradient-to-b from-primary/10 to-transparent py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-foreground">
            ساهم في التغيير - تبرع الآن
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            تبرعك، مهما كان يسيراً، يصنع فارقاً حقيقياً في حياة الأسر الأكثر احتياجاً في قرى ومراكز محافظة بني سويف.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="h-1 w-full bg-blue-500 absolute top-0" />
            <CardHeader className="flex flex-col items-center gap-4 text-center">
              <div className="p-4 rounded-full bg-blue-500/10">
                <Landmark className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl inline-block mt-2">الحساب البنكي</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">البنك الأهلي المصري</p>
              <div className="bg-muted rounded-xl p-4 flex items-center justify-between">
                <span className="font-mono text-lg font-bold">1234 5678 9101 1121</span>
                <Button variant="ghost" size="icon" className="hover:text-primary"><Copy className="w-4 h-4" /></Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">مؤسسة صناع الحياة مصر فرع بني سويف</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="h-1 w-full bg-purple-500 absolute top-0" />
            <CardHeader className="flex flex-col items-center gap-4 text-center">
              <div className="p-4 rounded-full bg-purple-500/10">
                <Smartphone className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl inline-block mt-2">المحافظ الإلكترونية</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">فودافون كاش / أورانج / اتصالات</p>
              <div className="bg-muted rounded-xl p-4 flex items-center justify-between">
                <span className="font-mono text-lg font-bold">0100 123 4567</span>
                <Button variant="ghost" size="icon" className="hover:text-primary"><Copy className="w-4 h-4" /></Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="h-1 w-full bg-amber-500 absolute top-0" />
            <CardHeader className="flex flex-col items-center gap-4 text-center">
              <div className="p-4 rounded-full bg-amber-500/10">
                <CreditCard className="w-8 h-8 text-amber-600" />
              </div>
              <CardTitle className="text-xl inline-block mt-2">الدفع الإلكتروني</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">التبرع عبر بطاقات الائتمان (قريباً)</p>
              <div className="pt-4">
                <Button className="w-full" disabled>تبرع أونلاين الآن</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
