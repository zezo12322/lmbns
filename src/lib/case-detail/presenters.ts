const statusLabels: Record<string, string> = {
  NEW: "جديد",
  SCREENING: "فرز مبدئي",
  MISSING_DOCUMENTS: "نواقص أوراق",
  FIELD_RESEARCH: "بحث ميداني",
  UNDER_REVIEW: "قيد المراجعة",
  COMMITTEE_REVIEW: "بانتظار قرار اللجنة",
  APPROVED: "معتمد",
  REJECTED: "مرفوض",
  IN_EXECUTION: "قيد التنفيذ",
  FOLLOW_UP: "متابعة",
  CLOSED: "مغلق",
  REOPENED: "أعيد فتحه",
};

const priorityLabels: Record<string, string> = {
  LOW: "منخفضة",
  MEDIUM: "متوسطة",
  HIGH: "مرتفعة",
  URGENT: "عاجلة",
};

const managerReviewLabels: Record<string, string> = {
  NOT_SENT: "لم يُرسل للمدير",
  PENDING: "بانتظار المدير",
  APPROVED: "موافقة المدير",
  REJECTED: "رفض المدير",
};

const caseTypeLabels: Record<string, string> = {
  EMERGENCY: "إغاثة عاجلة",
  MEDICAL: "مساعدة طبية",
  DEBT_RELIEF: "فك كرب / سداد دين",
  SAFE_HOUSING: "سكن كريم",
  WATER_CONNECTION: "توصيل مياه",
  EDUCATION: "تعليم",
  SMALL_PROJECT: "مشروع صغير",
  SEASONAL: "موسمي",
  OTHER: "أخرى",
};

export function getStatusLabel(status: string) {
  return statusLabels[status] ?? status;
}

export function getPriorityLabel(priority: string) {
  return priorityLabels[priority] ?? priority;
}

export function getManagerReviewLabel(state: string) {
  return managerReviewLabels[state] ?? state;
}

export function getCaseTypeLabel(caseType: string) {
  return caseTypeLabels[caseType] ?? caseType;
}

export function formatArabicDate(iso: string) {
  return new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" }).format(new Date(iso));
}

export function formatArabicDateTime(iso: string) {
  return new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
}
