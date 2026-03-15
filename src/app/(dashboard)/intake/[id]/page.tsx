import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-utils";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import ConvertToCaseButton from "./convert-button";

export default async function IntakeRequestDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireAuth();

  const resolvedParams = await params;
  const requestId = resolvedParams.id;

  const reqData = await prisma.intakeRequest.findUnique({
    where: { id: requestId },
  });

  if (!reqData) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">تفاصيل طلب المساعدة</h1>
          <p className="text-muted-foreground">معلومات الطلب الوارد من البوابة العامة.</p>
        </div>
        {reqData.status === "PENDING" && (
          <ConvertToCaseButton requestId={reqData.id} payload={reqData} />
        )}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>البيانات الأساسية</CardTitle>
          <Badge variant={reqData.status === "PENDING" ? "secondary" : "default"}>
            {reqData.status === "PENDING" ? "قيد الانتظار" : reqData.status}
          </Badge>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">الاسم رباعي</div>
              <div className="font-semibold">{reqData.requestorName}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">تاريخ الطلب</div>
              <div className="font-semibold">{format(new Date(reqData.createdAt), 'yyyy/MM/dd')}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">الهاتف</div>
              <div className="font-semibold" dir="ltr">{reqData.phone}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">الرقم القومي</div>
              <div className="font-semibold">{reqData.nationalId || "غير متوفر"}</div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="text-sm font-medium text-muted-foreground mb-2">الوصف / الاحتياج</div>
            <div className="bg-muted p-4 rounded-md whitespace-pre-wrap leading-relaxed">
              {reqData.description}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {reqData.status === "CONVERTED" && (
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-6">
            <p className="font-medium text-green-800 text-center">تم تحويل هذا الطلب إلى حالة وهو الآن قيد الدراسة في النظام المركزي.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
