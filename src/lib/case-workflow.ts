import { CaseStatus } from "@prisma/client";

const CASE_STATUS_TRANSITIONS: Record<CaseStatus, CaseStatus[]> = {
  [CaseStatus.NEW]: [CaseStatus.SCREENING, CaseStatus.MISSING_DOCUMENTS, CaseStatus.REJECTED],
  [CaseStatus.SCREENING]: [
    CaseStatus.MISSING_DOCUMENTS,
    CaseStatus.FIELD_RESEARCH,
    CaseStatus.UNDER_REVIEW,
    CaseStatus.REJECTED,
  ],
  [CaseStatus.MISSING_DOCUMENTS]: [CaseStatus.SCREENING, CaseStatus.REJECTED],
  [CaseStatus.FIELD_RESEARCH]: [CaseStatus.UNDER_REVIEW, CaseStatus.COMMITTEE_REVIEW, CaseStatus.MISSING_DOCUMENTS],
  [CaseStatus.UNDER_REVIEW]: [CaseStatus.COMMITTEE_REVIEW, CaseStatus.MISSING_DOCUMENTS, CaseStatus.REJECTED],
  [CaseStatus.COMMITTEE_REVIEW]: [CaseStatus.APPROVED, CaseStatus.REJECTED, CaseStatus.MISSING_DOCUMENTS],
  [CaseStatus.APPROVED]: [CaseStatus.IN_EXECUTION, CaseStatus.FOLLOW_UP],
  [CaseStatus.IN_EXECUTION]: [CaseStatus.FOLLOW_UP, CaseStatus.CLOSED],
  [CaseStatus.FOLLOW_UP]: [CaseStatus.CLOSED, CaseStatus.REOPENED],
  [CaseStatus.CLOSED]: [CaseStatus.REOPENED],
  [CaseStatus.REOPENED]: [CaseStatus.SCREENING, CaseStatus.FIELD_RESEARCH, CaseStatus.UNDER_REVIEW],
  [CaseStatus.REJECTED]: [CaseStatus.REOPENED],
};

const CASE_STATUS_ACTION_LABELS: Record<CaseStatus, string> = {
  [CaseStatus.NEW]: "فتح جديد",
  [CaseStatus.SCREENING]: "إرسال للفرز",
  [CaseStatus.MISSING_DOCUMENTS]: "وضع نواقص أوراق",
  [CaseStatus.FIELD_RESEARCH]: "إرسال للبحث الميداني",
  [CaseStatus.UNDER_REVIEW]: "إرسال للمراجعة",
  [CaseStatus.COMMITTEE_REVIEW]: "إرسال للجنة",
  [CaseStatus.APPROVED]: "اعتماد الحالة",
  [CaseStatus.IN_EXECUTION]: "تحويل للتنفيذ",
  [CaseStatus.FOLLOW_UP]: "تحويل للمتابعة",
  [CaseStatus.CLOSED]: "إغلاق الحالة",
  [CaseStatus.REOPENED]: "إعادة فتح الحالة",
  [CaseStatus.REJECTED]: "رفض الحالة",
};

export function getAllowedCaseTransitions(currentStatus: CaseStatus): CaseStatus[] {
  return CASE_STATUS_TRANSITIONS[currentStatus] ?? [];
}

export function canTransitionCaseStatus(currentStatus: CaseStatus, nextStatus: CaseStatus): boolean {
  if (currentStatus === nextStatus) return true;
  return getAllowedCaseTransitions(currentStatus).includes(nextStatus);
}

export function getCaseTransitionActionLabel(status: CaseStatus): string {
  return CASE_STATUS_ACTION_LABELS[status] ?? status;
}
