"use server";

import { AuditAction, CaseStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireRole, RoleGroups } from "@/lib/auth-utils";
import { canTransitionCaseStatus } from "@/lib/case-workflow";
import { prisma } from "@/lib/db";

export type CaseActionState = {
  ok: boolean;
  message: string;
  timestamp: number;
};

export const INITIAL_CASE_ACTION_STATE: CaseActionState = {
  ok: false,
  message: "",
  timestamp: 0,
};

function ok(message: string): CaseActionState {
  return { ok: true, message, timestamp: Date.now() };
}

function fail(message: string): CaseActionState {
  return { ok: false, message, timestamp: Date.now() };
}

async function resolveScopedCase(caseId: string, branchId?: string) {
  return prisma.case.findFirst({
    where: {
      id: caseId,
      ...(branchId ? { branchId } : {}),
    },
    select: {
      id: true,
      status: true,
      branchId: true,
      caseNumber: true,
    },
  });
}

function revalidateCasePath(caseId: string) {
  revalidatePath(`/cases/${caseId}`);
}

export async function addCaseNoteAction(
  _prevState: CaseActionState,
  formData: FormData,
): Promise<CaseActionState> {
  const session = await requireRole(RoleGroups.CASE_TEAM);

  const caseId = String(formData.get("caseId") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!caseId || content.length < 3) return fail("الملاحظة قصيرة جدًا.");

  const existingCase = await resolveScopedCase(caseId, session.user.branchId || undefined);
  if (!existingCase) return fail("الحالة غير موجودة أو خارج نطاق الصلاحية.");

  await prisma.$transaction(async (tx) => {
    await tx.caseNote.create({
      data: {
        caseId,
        content,
      },
    });

    await tx.auditLog.create({
      data: {
        userId: session.user.id,
        action: AuditAction.UPDATE,
        entityType: "CASE_NOTE",
        entityId: caseId,
        details: {
          caseId,
          caseNumber: existingCase.caseNumber,
          operation: "ADD_NOTE",
        },
      },
    });
  });

  revalidateCasePath(caseId);
  return ok("تمت إضافة الملاحظة بنجاح.");
}

export async function updateCaseStatusAction(
  _prevState: CaseActionState,
  formData: FormData,
): Promise<CaseActionState> {
  const session = await requireRole(RoleGroups.CASE_TEAM);

  const caseId = String(formData.get("caseId") ?? "").trim();
  const nextStatus = String(formData.get("nextStatus") ?? "").trim() as CaseStatus;
  const notesRaw = String(formData.get("notes") ?? "").trim();

  if (!caseId) return fail("معرّف الحالة غير صالح.");
  if (!Object.values(CaseStatus).includes(nextStatus)) return fail("الحالة المطلوبة غير صالحة.");

  const existingCase = await resolveScopedCase(caseId, session.user.branchId || undefined);
  if (!existingCase) return fail("الحالة غير موجودة أو خارج نطاق الصلاحية.");

  if (!canTransitionCaseStatus(existingCase.status, nextStatus)) {
    revalidateCasePath(caseId);
    return fail("لا يمكن تنفيذ هذا الانتقال من الحالة الحالية.");
  }

  if (existingCase.status === nextStatus) {
    revalidateCasePath(caseId);
    return fail("الحالة بالفعل في نفس المرحلة.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.case.update({
      where: { id: caseId },
      data: { status: nextStatus },
    });

    await tx.caseStatusHistory.create({
      data: {
        caseId,
        status: nextStatus,
        changedById: session.user.id,
        notes: notesRaw || null,
      },
    });

    await tx.auditLog.create({
      data: {
        userId: session.user.id,
        action: AuditAction.UPDATE,
        entityType: "CASE",
        entityId: caseId,
        details: {
          caseId,
          caseNumber: existingCase.caseNumber,
          fromStatus: existingCase.status,
          toStatus: nextStatus,
          notes: notesRaw || null,
          operation: "STATUS_UPDATE",
        },
      },
    });
  });

  revalidateCasePath(caseId);
  return ok("تم تحديث حالة الملف بنجاح.");
}

export async function assignCaseToMeAction(
  _prevState: CaseActionState,
  formData: FormData,
): Promise<CaseActionState> {
  const session = await requireRole(RoleGroups.CASE_TEAM);

  const caseId = String(formData.get("caseId") ?? "").trim();
  const role = String(formData.get("role") ?? "CASE_MANAGER").trim() || "CASE_MANAGER";

  if (!caseId) return fail("معرّف الحالة غير صالح.");

  const existingCase = await resolveScopedCase(caseId, session.user.branchId || undefined);
  if (!existingCase) return fail("الحالة غير موجودة أو خارج نطاق الصلاحية.");

  await prisma.$transaction(async (tx) => {
    const alreadyAssigned = await tx.caseAssignment.findFirst({
      where: {
        caseId,
        userId: session.user.id,
        role,
      },
      select: { id: true },
    });

    if (!alreadyAssigned) {
      await tx.caseAssignment.create({
        data: {
          caseId,
          userId: session.user.id,
          role,
        },
      });
    }

    await tx.auditLog.create({
      data: {
        userId: session.user.id,
        action: AuditAction.UPDATE,
        entityType: "CASE_ASSIGNMENT",
        entityId: caseId,
        details: {
          caseId,
          caseNumber: existingCase.caseNumber,
          assignedTo: session.user.id,
          role,
          operation: alreadyAssigned ? "ASSIGN_SELF_SKIPPED" : "ASSIGN_SELF",
        },
      },
    });
  });

  revalidateCasePath(caseId);
  return ok("تم تعيين الحالة لك بنجاح.");
}
