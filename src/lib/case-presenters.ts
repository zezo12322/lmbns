import { NationalIdValidationStatus } from "@prisma/client";
import type { CaseListRow } from "@/lib/case-list-select";

export type PrimaryBeneficiarySummary = {
  personId: string | null;
  fullName: string;
  nationalId: string | null;
  phone: string | null;
  validationStatus: NationalIdValidationStatus;
  hasNationalId: boolean;
};

export type CaseListItem = {
  id: string;
  caseNumber: string;
  title: string;
  status: string;
  priority: string;
  managerReviewState: string;
  beneficiaryName: string;
  nationalId: string | null;
  nationalIdValidationStatus: NationalIdValidationStatus;
  phone: string | null;
  centerName: string | null;
  villageName: string | null;
  createdAt: string;
  updatedAt: string;
  assignedUsers: Array<{ id: string; name: string | null; email: string | null; role: string }>;
  queueFlags: {
    missingNationalId: boolean;
    invalidNationalId: boolean;
  };
};

export function resolvePrimaryBeneficiary(caseRow: CaseListRow): PrimaryBeneficiarySummary {
  const primaryMember =
    caseRow.household.members.find((member) => member.isPrimary) ??
    caseRow.household.members[0];
  const person = primaryMember?.person;
  const fullName = person
    ? [person.firstName, person.lastName].filter(Boolean).join(" ")
    : caseRow.household.name;

  return {
    personId: person?.id ?? null,
    fullName: fullName || "غير محدد",
    nationalId: person?.nationalId ?? null,
    phone: person?.phone ?? caseRow.intakeRequest?.phone ?? null,
    validationStatus: person?.nationalIdValidationStatus ?? NationalIdValidationStatus.UNKNOWN,
    hasNationalId: Boolean(person?.nationalId),
  };
}

export function mapCaseRowToListItem(caseRow: CaseListRow): CaseListItem {
  const beneficiary = resolvePrimaryBeneficiary(caseRow);

  return {
    id: caseRow.id,
    caseNumber: caseRow.caseNumber,
    title: caseRow.title,
    status: caseRow.status,
    priority: caseRow.priority,
    managerReviewState: caseRow.managerReviewState,
    beneficiaryName: beneficiary.fullName,
    nationalId: beneficiary.nationalId,
    nationalIdValidationStatus: beneficiary.validationStatus,
    phone: beneficiary.phone,
    centerName: caseRow.village?.center?.name ?? null,
    villageName: caseRow.village?.name ?? null,
    createdAt: caseRow.createdAt.toISOString(),
    updatedAt: caseRow.updatedAt.toISOString(),
    assignedUsers: caseRow.assignments.map((assignment) => ({
      id: assignment.user.id,
      name: assignment.user.name,
      email: assignment.user.email,
      role: assignment.role,
    })),
    queueFlags: {
      missingNationalId: !beneficiary.hasNationalId,
      invalidNationalId: beneficiary.validationStatus === NationalIdValidationStatus.INVALID,
    },
  };
}
