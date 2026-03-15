import { requireAuth } from "@/lib/auth-utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GraduationCap, Clock } from "lucide-react";

export default async function TrainingsPage() {
  await requireAuth();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-2">
          التدريب والفعاليات
        </h1>
        <p className="text-lg text-muted-foreground">
          إدارة جلسات التدريب والفعاليات التطوعية.
        </p>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <GraduationCap className="w-12 h-12 text-primary/60" />
            </div>
          </div>
          <CardTitle className="text-2xl">قريباً</CardTitle>
          <CardDescription className="text-base mt-2 max-w-md mx-auto">
            يتم حالياً تطوير نظام إدارة التدريب والفعاليات.
            سيتضمن جدولة الجلسات، تسجيل الحضور، وتتبع ساعات التطوع.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
            <Clock className="w-4 h-4" />
            <span>سيتوفر في التحديث القادم</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
