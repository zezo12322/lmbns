import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DossierAssignmentItem } from "@/lib/case-detail/types";

export function AssignmentPanel({ assignments }: { assignments: DossierAssignmentItem[] }) {
  if (assignments.length === 0) {
    return (
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">التكليفات الحالية</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">لا توجد تكليفات مسجلة لهذه الحالة حتى الآن.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">التكليفات الحالية</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="flex items-center justify-between rounded-lg border border-border/40 p-3">
            <div>
              <p className="font-semibold text-foreground">{assignment.userName}</p>
              <p className="text-xs text-muted-foreground">{new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" }).format(new Date(assignment.createdAt))}</p>
            </div>
            <Badge variant="outline">{assignment.role}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
