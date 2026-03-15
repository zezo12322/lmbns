import { NationalIdValidationStatus, Prisma, Priority, type CaseStatus, type ManagerReviewState } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { caseListInclude } from "@/lib/case-list-select";
import { type CaseListItem, mapCaseRowToListItem } from "@/lib/case-presenters";
import { buildCaseQueueWhere, type CaseQueueFilters } from "@/lib/case-queue-logic";
import { isCaseQueueKey, type CaseQueueKey } from "@/lib/case-queue-definitions";
import { buildPaginationMeta, normalizePagination, type PaginationMeta } from "@/lib/pagination";
import { normalizeNationalId } from "@/lib/national-id";

function coerceString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function coerceBoolean(value: string | undefined) {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

function coerceDate(value: string | undefined) {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

const advancedSearchSchema = z.object({
  caseNumber: z.string().trim().optional(),
  nationalId: z.string().trim().optional(),
  name: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  status: z.string().trim().optional(),
  priority: z.nativeEnum(Priority).optional(),
  centerId: z.string().trim().optional(),
  villageId: z.string().trim().optional(),
  queue: z.string().trim().optional(),
  assignedUserId: z.string().trim().optional(),
  managerReviewState: z.string().trim().optional(),
  hasNationalId: z.boolean().optional(),
  nationalIdValidationStatus: z.nativeEnum(NationalIdValidationStatus).optional(),
  from: z.date().optional(),
  to: z.date().optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
});

export type NormalizedAdvancedCaseSearchParams = {
  caseNumber?: string;
  nationalId?: string;
  name?: string;
  phone?: string;
  status?: CaseStatus;
  priority?: Priority;
  centerId?: string;
  villageId?: string;
  queue?: CaseQueueKey;
  assignedUserId?: string;
  managerReviewState?: ManagerReviewState;
  hasNationalId?: boolean;
  nationalIdValidationStatus?: NationalIdValidationStatus;
  from?: Date;
  to?: Date;
  page: number;
  pageSize: number;
};

export type AdvancedCaseSearchResult = {
  filters: NormalizedAdvancedCaseSearchParams;
  items: CaseListItem[];
  pagination: PaginationMeta;
};

export type NationalIdSearchResult = {
  normalizedNationalId: string;
  found: boolean;
  personMatches: Array<{
    id: string;
    fullName: string;
    nationalId: string;
    validationStatus: NationalIdValidationStatus;
    phone: string | null;
  }>;
  caseMatches: CaseListItem[];
  intakeMatches: Array<{
    id: string;
    requestorName: string;
    createdAt: string;
    status: string;
  }>;
};

export function normalizeAdvancedCaseSearchParams(raw: Record<string, string | string[] | undefined>): NormalizedAdvancedCaseSearchParams {
  const rawStatus = coerceString(raw.status);
  const rawManagerReviewState = coerceString(raw.managerReviewState);
  const parsed = advancedSearchSchema.parse({
    caseNumber: coerceString(raw.caseNumber),
    nationalId: normalizeNationalId(coerceString(raw.nationalId)),
    name: coerceString(raw.name),
    phone: coerceString(raw.phone),
    status: rawStatus,
    priority: coerceString(raw.priority),
    centerId: coerceString(raw.centerId),
    villageId: coerceString(raw.villageId),
    queue: coerceString(raw.queue),
    assignedUserId: coerceString(raw.assignedUserId),
    managerReviewState: rawManagerReviewState,
    hasNationalId: coerceBoolean(coerceString(raw.hasNationalId)),
    nationalIdValidationStatus: coerceString(raw.nationalIdValidationStatus),
    from: coerceDate(coerceString(raw.from)),
    to: coerceDate(coerceString(raw.to)),
    page: coerceString(raw.page),
    pageSize: coerceString(raw.pageSize),
  });

  return {
    caseNumber: parsed.caseNumber || undefined,
    nationalId: parsed.nationalId || undefined,
    name: parsed.name || undefined,
    phone: parsed.phone || undefined,
    status: parsed.status as CaseStatus | undefined,
    priority: parsed.priority,
    centerId: parsed.centerId || undefined,
    villageId: parsed.villageId || undefined,
    queue: parsed.queue && isCaseQueueKey(parsed.queue) ? parsed.queue : undefined,
    assignedUserId: parsed.assignedUserId || undefined,
    managerReviewState: parsed.managerReviewState as ManagerReviewState | undefined,
    hasNationalId: parsed.hasNationalId,
    nationalIdValidationStatus: parsed.nationalIdValidationStatus,
    from: parsed.from,
    to: parsed.to,
    page: parsed.page ?? 1,
    pageSize: parsed.pageSize ?? 20,
  };
}

function buildPrimaryPersonConditions(filters: NormalizedAdvancedCaseSearchParams): Prisma.CaseWhereInput[] {
  const conditions: Prisma.CaseWhereInput[] = [];

  if (filters.nationalId) {
    conditions.push({
      household: {
        members: {
          some: {
            isPrimary: true,
            person: { nationalId: filters.nationalId },
          },
        },
      },
    });
  }

  if (filters.name) {
    conditions.push({
      household: {
        members: {
          some: {
            isPrimary: true,
            person: {
              OR: [
                { firstName: { contains: filters.name, mode: "insensitive" } },
                { lastName: { contains: filters.name, mode: "insensitive" } },
              ],
            },
          },
        },
      },
    });
  }

  if (filters.phone) {
    conditions.push({
      household: {
        members: {
          some: {
            isPrimary: true,
            person: {
              phone: { contains: filters.phone, mode: "insensitive" },
            },
          },
        },
      },
    });
  }

  if (filters.hasNationalId === true) {
    conditions.push({
      household: {
        members: {
          some: {
            isPrimary: true,
            person: {
              nationalId: { not: null },
            },
          },
        },
      },
    });
  }

  if (filters.nationalIdValidationStatus) {
    conditions.push({
      household: {
        members: {
          some: {
            isPrimary: true,
            person: {
              nationalIdValidationStatus: filters.nationalIdValidationStatus,
            },
          },
        },
      },
    });
  }

  return conditions;
}

export function buildAdvancedCaseSearchWhere(
  branchId: string,
  filters: NormalizedAdvancedCaseSearchParams,
): Prisma.CaseWhereInput {
  const where: Prisma.CaseWhereInput = {
    branchId,
    ...(filters.caseNumber
      ? { caseNumber: { contains: filters.caseNumber, mode: "insensitive" } }
      : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.priority ? { priority: filters.priority } : {}),
    ...(filters.centerId ? { centerId: filters.centerId } : {}),
    ...(filters.villageId ? { villageId: filters.villageId } : {}),
    ...(filters.assignedUserId
      ? {
          assignments: {
            some: {
              userId: filters.assignedUserId,
            },
          },
        }
      : {}),
    ...(filters.managerReviewState
      ? { managerReviewState: filters.managerReviewState }
      : {}),
    ...(filters.from || filters.to
      ? {
          createdAt: {
            ...(filters.from ? { gte: filters.from } : {}),
            ...(filters.to ? { lte: filters.to } : {}),
          },
        }
      : {}),
  };

  const andConditions: Prisma.CaseWhereInput[] = [];

  if (filters.hasNationalId === false) {
    andConditions.push({
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
    });
  }

  if (filters.queue) {
    andConditions.push(
      buildCaseQueueWhere({
        queueKey: filters.queue,
        branchId,
        filters: {
          centerId: filters.centerId,
          villageId: filters.villageId,
          priority: filters.priority,
          from: filters.from,
          to: filters.to,
        } satisfies CaseQueueFilters,
      }),
    );
  }

  andConditions.push(...buildPrimaryPersonConditions({
    ...filters,
    hasNationalId: filters.hasNationalId === false ? undefined : filters.hasNationalId,
  }));

  return andConditions.length > 0
    ? {
        AND: [where, ...andConditions],
      }
    : where;
}

export async function searchCasesByNationalId(branchId: string, nationalId: string): Promise<NationalIdSearchResult> {
  const normalizedNationalId = normalizeNationalId(nationalId);

  const [people, cases, intakeRequests] = await Promise.all([
    prisma.person.findMany({
      where: { nationalId: normalizedNationalId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        nationalId: true,
        nationalIdValidationStatus: true,
        phone: true,
      },
    }),
    prisma.case.findMany({
      where: {
        branchId,
        household: {
          members: {
            some: {
              person: {
                nationalId: normalizedNationalId,
              },
            },
          },
        },
      },
      include: caseListInclude,
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    }),
    prisma.intakeRequest.findMany({
      where: { nationalId: normalizedNationalId },
      select: {
        id: true,
        requestorName: true,
        createdAt: true,
        status: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    normalizedNationalId,
    found: people.length > 0 || cases.length > 0 || intakeRequests.length > 0,
    personMatches: people.map((person) => ({
      id: person.id,
      fullName: [person.firstName, person.lastName].filter(Boolean).join(" "),
      nationalId: person.nationalId ?? normalizedNationalId,
      validationStatus: person.nationalIdValidationStatus,
      phone: person.phone ?? null,
    })),
    caseMatches: cases.map(mapCaseRowToListItem),
    intakeMatches: intakeRequests.map((intake) => ({
      id: intake.id,
      requestorName: intake.requestorName,
      createdAt: intake.createdAt.toISOString(),
      status: intake.status,
    })),
  };
}

export async function searchCasesAdvanced(
  branchId: string,
  rawParams: Record<string, string | string[] | undefined>,
): Promise<AdvancedCaseSearchResult> {
  const filters = normalizeAdvancedCaseSearchParams(rawParams);
  const pagination = normalizePagination({ page: filters.page, pageSize: filters.pageSize });
  const where = buildAdvancedCaseSearchWhere(branchId, filters);

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
    filters,
    items: rows.map(mapCaseRowToListItem),
    pagination: buildPaginationMeta(total, pagination.page, pagination.pageSize),
  };
}
