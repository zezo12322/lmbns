export const STANDARD_CASE_QUEUE_KEYS = [
  "specialist-new",
  "new",
  "under-review",
  "waiting-manager",
  "urgent",
  "approved",
  "rejected",
  "final-rejected",
] as const;

export const ERROR_CASE_QUEUE_KEYS = [
  "missing-national-id",
  "invalid-national-id",
] as const;

export const ALL_CASE_QUEUE_KEYS = [
  ...STANDARD_CASE_QUEUE_KEYS,
  ...ERROR_CASE_QUEUE_KEYS,
] as const;

export type StandardCaseQueueKey = (typeof STANDARD_CASE_QUEUE_KEYS)[number];
export type ErrorCaseQueueKey = (typeof ERROR_CASE_QUEUE_KEYS)[number];
export type CaseQueueKey = (typeof ALL_CASE_QUEUE_KEYS)[number];

export type CaseQueueDefinition = {
  key: CaseQueueKey;
  labelAr: string;
  descriptionAr: string;
  kind: "queue" | "error";
  routePath: string;
};

export const CASE_QUEUE_DEFINITIONS: Record<CaseQueueKey, CaseQueueDefinition> = {
  "specialist-new": {
    key: "specialist-new",
    labelAr: "الحالات الجديدة للمختص",
    descriptionAr: "الحالات الجديدة المسندة للمستخدم الحالي ولم تبدأ معالجتها بعد.",
    kind: "queue",
    routePath: "/cases/queues/specialist-new",
  },
  new: {
    key: "new",
    labelAr: "كل الحالات الجديدة",
    descriptionAr: "جميع الحالات في بداية دورة التشغيل قبل التوسع في المعالجة.",
    kind: "queue",
    routePath: "/cases/queues/new",
  },
  "under-review": {
    key: "under-review",
    labelAr: "الحالات تحت المراجعة",
    descriptionAr: "الحالات الجاري استكمال بياناتها أو بحثها أو مراجعتها.",
    kind: "queue",
    routePath: "/cases/queues/under-review",
  },
  "waiting-manager": {
    key: "waiting-manager",
    labelAr: "بانتظار رأي المدير النهائي",
    descriptionAr: "الحالات التي وصلت لمرحلة انتظار القرار النهائي من الإدارة.",
    kind: "queue",
    routePath: "/cases/queues/waiting-manager",
  },
  urgent: {
    key: "urgent",
    labelAr: "الحالات العاجلة والمرتفعة",
    descriptionAr: "الحالات ذات الأولوية المرتفعة أو العاجلة والتي ما زالت نشطة.",
    kind: "queue",
    routePath: "/cases/queues/urgent",
  },
  approved: {
    key: "approved",
    labelAr: "الحالات المعتمدة",
    descriptionAr: "الحالات المقبولة أو الجاري تنفيذها أو متابعتها بعد الاعتماد.",
    kind: "queue",
    routePath: "/cases/queues/approved",
  },
  rejected: {
    key: "rejected",
    labelAr: "الحالات المرفوضة",
    descriptionAr: "الحالات المرفوضة قبل توثيق الرفض النهائي من المدير.",
    kind: "queue",
    routePath: "/cases/queues/rejected",
  },
  "final-rejected": {
    key: "final-rejected",
    labelAr: "الرفض النهائي",
    descriptionAr: "الحالات المرفوضة نهائياً بقرار إداري نهائي.",
    kind: "queue",
    routePath: "/cases/queues/final-rejected",
  },
  "missing-national-id": {
    key: "missing-national-id",
    labelAr: "بدون رقم قومي",
    descriptionAr: "الحالات التي لا تحتوي على رقم قومي صالح للمستفيد الأساسي.",
    kind: "error",
    routePath: "/cases/errors/missing-national-id",
  },
  "invalid-national-id": {
    key: "invalid-national-id",
    labelAr: "رقم قومي غير صالح",
    descriptionAr: "الحالات التي تحتوي على رقم قومي لا يجتاز قواعد التحقق الأساسية.",
    kind: "error",
    routePath: "/cases/errors/invalid-national-id",
  },
};

export function getCaseQueueDefinition(queueKey: CaseQueueKey) {
  return CASE_QUEUE_DEFINITIONS[queueKey];
}

export function isCaseQueueKey(value: string): value is CaseQueueKey {
  return (ALL_CASE_QUEUE_KEYS as readonly string[]).includes(value);
}
