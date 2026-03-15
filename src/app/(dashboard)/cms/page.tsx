import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAuth } from "@/lib/auth-utils";
import { CalendarIcon, FileTextIcon, HelpCircleIcon, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function CMSPage() {
  await requireAuth();

  const cmsModules = [
    {
      title: "الأخبار والفاعليات",
      description: "إدارة الأخبار ونشر الفعاليّات الحديثة لتظهر في الصفحة الرئيسية للموقع المفتوح.",
      icon: CalendarIcon,
      color: "text-blue-600",
      bg: "bg-blue-600/10",
      path: "/cms/news",
      enabled: true,
    },
    {
      title: "إدارة الصفحات الثابتة",
      description: "تعديل محتوى الصفحات مثل (عن المؤسسة، برامجنا، طرق التبرع).",
      icon: FileTextIcon,
      color: "text-emerald-600",
      bg: "bg-emerald-600/10",
      path: "/cms/pages",
      enabled: false,
    },
    {
      title: "مكتبة الوسائط",
      description: "رفع وتنظيم الصور، الفيديوهات والشعارات لاستخدامها في مختلف أقسام الموقع.",
      icon: ImageIcon,
      color: "text-purple-600",
      bg: "bg-purple-600/10",
      path: "/cms/media",
      enabled: false,
    },
    {
      title: "الأسئلة الشائعة (FAQ)",
      description: "تحديث الأسئلة المتكررة لتسهيل الأمر على المتطوعين والمتبرعين.",
      icon: HelpCircleIcon,
      color: "text-amber-600",
      bg: "bg-amber-600/10",
      path: "/cms/faqs",
      enabled: false,
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-2">إدارة المحتوى (CMS)</h1>
        <p className="text-lg text-muted-foreground">التحكم في المحتوى العام المنشور على الواجهة الأمامية للموقع.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {cmsModules.map((module, i) => (
          <Card key={i} className="group border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className={`p-3 rounded-xl ${module.bg} group-hover:scale-105 transition-transform`}>
                <module.icon className={`w-6 h-6 ${module.color}`} />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-xl">{module.title}</CardTitle>
                <CardDescription className="text-sm font-medium">{module.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-4 flex justify-end">
              {module.enabled ? (
                <Link href={module.path}>
                  <Button variant="outline" className="w-full sm:w-auto font-semibold">إدارة</Button>
                </Link>
              ) : (
                <Button disabled variant="outline" className="w-full sm:w-auto font-semibold">إدارة (قريباً)</Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
