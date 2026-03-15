import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { CaseDossierData } from "@/lib/case-detail/types";

type GetCaseDossierDataInput = {
  caseId: string;
  sessionUserId: string;
  branchId?: string;
};

const caseDossierInclude = {
  household: {
    include: {
      members: {
        include: {
          person: true,
        },
      },
    },
  },
  center: true,
  village: {
    include: {
      center: true,
    },
  },
  assignments: {
    include: {
      user: true,
    },
    orderBy: { createdAt: "desc" },
  },
  statusHistories: {
    include: {
      changedBy: true,
    },
    orderBy: { createdAt: "desc" },
  },
  notes: {
    orderBy: { createdAt: "desc" },
  },
  visits: {
    include: {
      assessments: {
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { date: "desc" },
  },
  decisions: {
    include: {
      reviewer: true,
    },
    orderBy: { createdAt: "desc" },
  },
  interventions: {
    include: {
      deliveries: {
        orderBy: { date: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  },
  followUps: {
    orderBy: { date: "desc" },
  },
  documents: {
    orderBy: { createdAt: "desc" },
  },
  intakeRequest: true,
} satisfies Prisma.CaseInclude;

type CaseDossierRow = Prisma.CaseGetPayload<{
  include: typeof caseDossierInclude;
}>;

function resolvePrimaryMember(caseRow: CaseDossierRow) {
  const primary = caseRow.household.members.find((m) => m.isPrimary);
  return primary ?? caseRow.household.members[0] ?? null;
}

export async function getCaseDossierData(input: GetCaseDossierDataInput): Promise<CaseDossierData | null> {
  const where: Prisma.CaseWhereInput = {
    id: input.caseId,
    ...(input.branchId ? { branchId: input.branchId } : {}),
  };

  const caseRow = await prisma.case.findFirst({
    where,
    include: caseDossierInclude,
  });

  if (!caseRow) return null;

  const primaryMember = resolvePrimaryMember(caseRow);

  return {
    id: caseRow.id,
    caseNumber: caseRow.caseNumber,
    title: caseRow.title,
    description: caseRow.description,
    caseType: caseRow.caseType,
    status: caseRow.status,
    priority: caseRow.priority,
    managerReviewState: caseRow.managerReviewState,
    createdAt: caseRow.createdAt.toISOString(),
    updatedAt: caseRow.updatedAt.toISOString(),
    branchId: caseRow.branchId,
    centerName: caseRow.village?.center?.name ?? caseRow.center?.name ?? null,
    villageName: caseRow.village?.name ?? null,
    household: {
      id: caseRow.household.id,
      name: caseRow.household.name,
      address: caseRow.household.address,
      income: caseRow.household.income,
      members: caseRow.household.members
        .slice()
        .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
        .map((member) => ({
          id: member.id,
          relationship: member.relationship,
          isPrimary: member.isPrimary,
          person: {
            id: member.person.id,
            firstName: member.person.firstName,
            lastName: member.person.lastName,
            nationalId: member.person.nationalId,
            phone: member.person.phone,
            gender: member.person.gender,
            dateOfBirth: member.person.dateOfBirth?.toISOString() ?? null,
            maritalStatus: member.person.maritalStatus,
            nationalIdValidationStatus: member.person.nationalIdValidationStatus,
          },
        })),
    },
    primaryBeneficiary: primaryMember
      ? {
          id: primaryMember.person.id,
          firstName: primaryMember.person.firstName,
          lastName: primaryMember.person.lastName,
          nationalId: primaryMember.person.nationalId,
          phone: primaryMember.person.phone,
          gender: primaryMember.person.gender,
          dateOfBirth: primaryMember.person.dateOfBirth?.toISOString() ?? null,
          maritalStatus: primaryMember.person.maritalStatus,
          nationalIdValidationStatus: primaryMember.person.nationalIdValidationStatus,
        }
      : null,
    assignments: caseRow.assignments.map((assignment) => ({
      id: assignment.id,
      userId: assignment.userId,
      userName: assignment.user?.name ?? "مستخدم غير معروف",
      role: assignment.role,
      createdAt: assignment.createdAt.toISOString(),
    })),
    statusHistory: caseRow.statusHistories.map((history) => ({
      id: history.id,
      status: history.status,
      changedByName: history.changedBy?.name ?? "مستخدم غير معروف",
      notes: history.notes,
      createdAt: history.createdAt.toISOString(),
    })),
    notes: caseRow.notes.map((note) => ({
      id: note.id,
      content: note.content,
      createdAt: note.createdAt.toISOString(),
    })),
    visits: caseRow.visits.map((visit) => ({
      id: visit.id,
      date: visit.date.toISOString(),
      findings: visit.findings,
      assessments: visit.assessments.map((assessment) => ({
        id: assessment.id,
        needType: assessment.needType,
        score: assessment.score,
        details: assessment.details,
        createdAt: assessment.createdAt.toISOString(),
      })),
    })),
    decisions: caseRow.decisions.map((decision) => ({
      id: decision.id,
      decision: decision.decision,
      amount: decision.amount,
      notes: decision.notes,
      reviewerName: decision.reviewer?.name ?? "مستخدم غير معروف",
      createdAt: decision.createdAt.toISOString(),
    })),
    interventions: caseRow.interventions.map((intervention) => ({
      id: intervention.id,
      type: intervention.type,
      description: intervention.description,
      cost: intervention.cost,
      status: intervention.status,
      createdAt: intervention.createdAt.toISOString(),
      deliveries: intervention.deliveries.map((delivery) => ({
        id: delivery.id,
        date: delivery.date.toISOString(),
        amount: delivery.amount,
        items: delivery.items,
        notes: delivery.notes,
      })),
    })),
    followUps: caseRow.followUps.map((followUp) => ({
      id: followUp.id,
      date: followUp.date.toISOString(),
      status: followUp.status,
      notes: followUp.notes,
      createdAt: followUp.createdAt.toISOString(),
    })),
    documents: caseRow.documents.map((document) => ({
      id: document.id,
      title: document.title,
      fileUrl: document.fileUrl,
      fileType: document.fileType,
      category: document.category,
      createdAt: document.createdAt.toISOString(),
    })),
    intakeRequest: caseRow.intakeRequest
      ? {
          id: caseRow.intakeRequest.id,
          requestorName: caseRow.intakeRequest.requestorName,
          phone: caseRow.intakeRequest.phone,
          nationalId: caseRow.intakeRequest.nationalId,
          status: caseRow.intakeRequest.status,
          createdAt: caseRow.intakeRequest.createdAt.toISOString(),
        }
      : null,
  };
}
