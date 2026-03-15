import { CaseStatus, ManagerReviewState, NationalIdValidationStatus, Prisma, Priority } from "@prisma/client";
import { prisma } from "@/lib/db";
import { caseListInclude } from "@/lib/case-list-select";
import { mapCaseRowToListItem, type CaseListItem } from "@/lib/case-presenters";
import { getCaseQueueDefinition, isCaseQueueKey, type CaseQueueKey } from "@/lib/case-queue-definitions";
import { buildPaginationMeta, normalizePagination, type PaginationInput, type PaginationMeta } from "@/lib/pagination";

export type CaseQueueFilters = {
  centerId?: string;
  villageId?: string;
  priority?: Priority;
  from?: Date;
  to?: Date;
};

export type CaseQueueQueryInput = {
  queueKey: CaseQueueKey;
  branchId: string;
  sessionUserId?: string;
  filters?: CaseQueueFilters;
};

export type CaseQueueListInput = CaseQueueQueryInput & {
  pagination?: PaginationInput;
};

export type CaseQueueResult = {
  queue: ReturnType<typeof getCaseQueueDefinition>;
  items: CaseListItem[];
  pagination: PaginationMeta;
};

function buildDateRangeFilter(filters?: CaseQueueFilters): Prisma.CaseWhereInput {
  if (!filters?.from && !filters?.to) {
    return {};
  }

  return {
    createdAt: {
      ...(filters.from ? { gte: filters.from } : {}),
      ...(filters.to ? { lte: filters.to } : {}),
    },
  };
}

function buildOptionalFilters(filters?: CaseQueueFilters): Prisma.CaseWhereInput {
  return {
    ...(filters?.centerId ? { centerId: filters.centerId } : {}),
    ...(filters?.villageId ? { villageId: filters.villageId } : {}),
    ...(filters?.priority ? { priority: filters.priority } : {}),
    ...buildDateRangeFilter(filters),
  };
}

function buildMissingNationalIdFilter(): Prisma.CaseWhereInput {
  return {
    OR: [
      {
        household: {
          members: {
            some: {
              isPrimary: true,
              person: {
                OR: [{ nationalId: null }, { nationalId: "" }],
              },
            },
          },
        },
      },
      {
        household: {
          members: {
            none: {
              isPrimary: true,
            },
          },
        },
      },
    ],
  };
}

function buildInvalidNationalIdFilter(): Prisma.CaseWhereInput {
  return {
    household: {
      members: {
        some: {
          isPrimary: true,
          person: {
            nationalIdValidationStatus: NationalIdValidationStatus.INVALID,
          },
        },
      },
    },
  };
}

export function buildCaseQueueWhere(input: CaseQueueQueryInput): Prisma.CaseWhereInput {
  const baseWhere: Prisma.CaseWhereInput = {
    branchId: input.branchId,
    ...buildOptionalFilters(input.filters),
  };

  switch (input.queueKey) {
    case "specialist-new":
      return {
        ...baseWhere,
        status: { in: [CaseStatus.NEW, CaseStatus.SCREENING] },
        assignments: input.sessionUserId
          ? {
              some: {
                userId: input.sessionUserId,
              },
            }
          : undefined,
      };
    case "new":
      return {
        ...baseWhere,
        status: { in: [CaseStatus.NEW, CaseStatus.SCREENING] },
      };
    case "under-review":
      return {
        ...baseWhere,
        status: {
          in: [CaseStatus.MISSING_DOCUMENTS, CaseStatus.FIELD_RESEARCH, CaseStatus.UNDER_REVIEW],
        },
      };
    case "waiting-manager":
      return {
        ...baseWhere,
        OR: [
          { status: CaseStatus.COMMITTEE_REVIEW },
          { managerReviewState: ManagerReviewState.PENDING },
        ],
      };
    case "urgent":
      return {
        ...baseWhere,
        priority: { in: [Priority.HIGH, Priority.URGENT] },
        status: { notIn: [CaseStatus.REJECTED, CaseStatus.CLOSED] },
      };
    case "approved":
      return {
        ...baseWhere,
        status: { in: [CaseStatus.APPROVED, CaseStatus.IN_EXECUTION, CaseStatus.FOLLOW_UP] },
        managerReviewState: { not: ManagerReviewState.REJECTED },
      };
    case "rejected":
      return {
        ...baseWhere,
        status: CaseStatus.REJECTED,
        managerReviewState: { not: ManagerReviewState.REJECTED },
      };
    case "final-rejected":
      return {
        ...baseWhere,
        status: CaseStatus.REJECTED,
        managerReviewState: ManagerReviewState.REJECTED,
      };
    case "missing-national-id":
      return {
        ...baseWhere,
        ...buildMissingNationalIdFilter(),
      };
    case "invalid-national-id":
      return {
        ...baseWhere,
        ...buildInvalidNationalIdFilter(),
      };
    default:
      return baseWhere;
  }
}

export function assertValidQueueKey(queueKey: string): CaseQueueKey {
  if (!isCaseQueueKey(queueKey)) {
    throw new Error(`Unknown queue key: ${queueKey}`);
  }

  return queueKey;
}

export async function countCasesForQueue(input: CaseQueueQueryInput) {
  return prisma.case.count({
    where: buildCaseQueueWhere(input),
  });
}

export async function listCasesForQueue(input: CaseQueueListInput): Promise<CaseQueueResult> {
  const pagination = normalizePagination(input.pagination);
  const where = buildCaseQueueWhere(input);
  const queue = getCaseQueueDefinition(input.queueKey);

  const [total, rows] = await Promise.all([
    prisma.case.count({ where }),
    prisma.case.findMany({
      where,
      include: caseListInclude,
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      skip: pagination.skip,
      take: pagination.take,
    }),
  ]);

  return {
    queue,
    items: rows.map(mapCaseRowToListItem),
    pagination: buildPaginationMeta(total, pagination.page, pagination.pageSize),
  };
}

/**
 * Safely extracts queue filter params from URL searchParams.
 * Validates priority against known values; silently drops invalid ones.
 * Dates are parsed with NaN guard.
 */
export function parseQueueFilterParams(
  params: Record<string, string | string[] | undefined>,
): CaseQueueFilters {
  function str(key: string): string | undefined {
    const v = params[key];
    return typeof v === "string" && v.length > 0 ? v : undefined;
  }

  const rawPriority = str("priority");
  const validPriorities = new Set<string>(["LOW", "MEDIUM", "HIGH", "URGENT"]);

  const rawFrom = str("from");
  const rawTo = str("to");
  const fromDate = rawFrom ? new Date(rawFrom) : undefined;
  const toDate = rawTo ? new Date(rawTo) : undefined;

  return {
    priority:
      rawPriority && validPriorities.has(rawPriority)
        ? (rawPriority as Priority)
        : undefined,
    from: fromDate && !isNaN(fromDate.getTime()) ? fromDate : undefined,
    to: toDate && !isNaN(toDate.getTime()) ? toDate : undefined,
  };
}
