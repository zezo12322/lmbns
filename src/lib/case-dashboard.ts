import { CaseStatus, Priority, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { countCasesForQueue } from "@/lib/case-queue-logic";

const statusLabels: Partial<Record<CaseStatus, string>> = {
  NEW: "جديد",
  SCREENING: "فرز مبدئي",
  MISSING_DOCUMENTS: "نواقص أوراق",
  FIELD_RESEARCH: "بحث ميداني",
  UNDER_REVIEW: "قيد المراجعة",
  COMMITTEE_REVIEW: "بانتظار قرار إداري",
  APPROVED: "معتمد",
  REJECTED: "مرفوض",
  IN_EXECUTION: "قيد التنفيذ",
  FOLLOW_UP: "متابعة",
  CLOSED: "مغلق",
  REOPENED: "أعيد فتحه",
};

const priorityLabels: Record<Priority, string> = {
  LOW: "منخفضة",
  MEDIUM: "متوسطة",
  HIGH: "مرتفعة",
  URGENT: "عاجلة",
};

export type CaseQueueSummary = {
  generatedAt: string;
  counts: {
    specialistNew: number;
    allNew: number;
    underReview: number;
    waitingManager: number;
    urgent: number;
    approved: number;
    rejected: number;
    finalRejected: number;
    missingNationalId: number;
    invalidNationalId: number;
  };
  charts: {
    statusDistribution: Array<{ key: string; label: string; value: number }>;
    priorityDistribution: Array<{ key: string; label: string; value: number }>;
  };
};

type SummaryInput = {
  branchId: string;
  sessionUserId?: string;
};

export async function getCaseQueueSummary(input: SummaryInput): Promise<CaseQueueSummary> {
  const queueCounts = await Promise.all([
    countCasesForQueue({ queueKey: "specialist-new", branchId: input.branchId, sessionUserId: input.sessionUserId }),
    countCasesForQueue({ queueKey: "new", branchId: input.branchId }),
    countCasesForQueue({ queueKey: "under-review", branchId: input.branchId }),
    countCasesForQueue({ queueKey: "waiting-manager", branchId: input.branchId }),
    countCasesForQueue({ queueKey: "urgent", branchId: input.branchId }),
    countCasesForQueue({ queueKey: "approved", branchId: input.branchId }),
    countCasesForQueue({ queueKey: "rejected", branchId: input.branchId }),
    countCasesForQueue({ queueKey: "final-rejected", branchId: input.branchId }),
    countCasesForQueue({ queueKey: "missing-national-id", branchId: input.branchId }),
    countCasesForQueue({ queueKey: "invalid-national-id", branchId: input.branchId }),
  ]);

  const [statusDistribution, priorityDistribution] = await Promise.all([
    prisma.case.groupBy({
      by: ["status"],
      where: { branchId: input.branchId },
      _count: { id: true },
    }),
    prisma.case.groupBy({
      by: ["priority"],
      where: { branchId: input.branchId },
      _count: { id: true },
    }),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    counts: {
      specialistNew: queueCounts[0],
      allNew: queueCounts[1],
      underReview: queueCounts[2],
      waitingManager: queueCounts[3],
      urgent: queueCounts[4],
      approved: queueCounts[5],
      rejected: queueCounts[6],
      finalRejected: queueCounts[7],
      missingNationalId: queueCounts[8],
      invalidNationalId: queueCounts[9],
    },
    charts: {
      statusDistribution: statusDistribution.map((item) => ({
        key: item.status,
        label: statusLabels[item.status] ?? item.status,
        value: item._count.id,
      })),
      priorityDistribution: priorityDistribution.map((item) => ({
        key: item.priority,
        label: priorityLabels[item.priority],
        value: item._count.id,
      })),
    },
  };
}
