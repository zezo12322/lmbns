"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  addCaseNoteAction,
  assignCaseToMeAction,
  INITIAL_CASE_ACTION_STATE,
  updateCaseStatusAction,
} from "@/app/(dashboard)/cases/[id]/actions";

const sensitiveTransitionMessages: Record<string, string> = {
  REJECTED: "هل أنت متأكد من رفض الحالة؟ يمكن إعادة فتحها لاحقًا إذا لزم الأمر.",
  CLOSED: "هل أنت متأكد من إغلاق الحالة؟ يُفترض أن تكون جميع الإجراءات قد اكتملت.",
};

type StatusOption = {
  value: string;
  label: string;
};

function SubmitButton({
  children,
  variant,
  className,
  name,
  value,
  confirmMessage,
}: {
  children: React.ReactNode;
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
  className?: string;
  name?: string;
  value?: string;
  confirmMessage?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant={variant}
      className={className}
      disabled={pending}
      name={name}
      value={value}
      onClick={(event) => {
        if (pending || !confirmMessage) return;
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      {pending ? "جاري التنفيذ..." : children}
    </Button>
  );
}

function ActionFeedback({ ok, message }: { ok: boolean; message: string }) {
  if (!message) return null;
  return (
    <div
      className={`rounded-md border p-2 text-xs ${
        ok
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-red-800"
      }`}
    >
      {message}
    </div>
  );
}

export function CaseQuickActions({
  caseId,
  allowedTransitions,
}: {
  caseId: string;
  allowedTransitions: StatusOption[];
}) {
  const [assignState, assignFormAction] = useActionState(assignCaseToMeAction, INITIAL_CASE_ACTION_STATE);
  const [statusState, statusFormAction] = useActionState(updateCaseStatusAction, INITIAL_CASE_ACTION_STATE);
  const [noteState, noteFormAction] = useActionState(addCaseNoteAction, INITIAL_CASE_ACTION_STATE);

  return (
    <Card id="actions" className="border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">إجراءات سريعة</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={assignFormAction} className="space-y-2">
          <input type="hidden" name="caseId" value={caseId} />
          <input type="hidden" name="role" value="CASE_MANAGER" />
          <SubmitButton variant="outline" className="w-full">
            تعيين الحالة لي
          </SubmitButton>
          <ActionFeedback ok={assignState.ok} message={assignState.message} />
        </form>

        <form action={statusFormAction} className="space-y-2">
          <input type="hidden" name="caseId" value={caseId} />
          <p className="text-xs font-medium text-muted-foreground">تحديث سريع للحالة</p>
          <div className="grid grid-cols-1 gap-2">
            {allowedTransitions.map((status) => (
              <SubmitButton
                key={status.value}
                name="nextStatus"
                value={status.value}
                variant="secondary"
                className="justify-start"
                confirmMessage={sensitiveTransitionMessages[status.value]}
              >
                {status.label}
              </SubmitButton>
            ))}
            {allowedTransitions.length === 0 ? (
              <p className="rounded-md border border-border/40 p-2 text-xs text-muted-foreground">
                لا توجد انتقالات متاحة من الحالة الحالية.
              </p>
            ) : null}
          </div>
          <ActionFeedback ok={statusState.ok} message={statusState.message} />
        </form>

        <form action={noteFormAction} className="space-y-2">
          <input type="hidden" name="caseId" value={caseId} />
          <label htmlFor="quick-note" className="text-xs font-medium text-muted-foreground">
            إضافة ملاحظة تشغيلية
          </label>
          <textarea
            id="quick-note"
            name="content"
            minLength={3}
            required
            rows={4}
            className="w-full rounded-md border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="اكتب الملاحظة..."
          />
          <SubmitButton className="w-full">حفظ الملاحظة</SubmitButton>
          <ActionFeedback ok={noteState.ok} message={noteState.message} />
        </form>
      </CardContent>
    </Card>
  );
}
