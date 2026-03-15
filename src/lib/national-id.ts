import { NationalIdValidationStatus } from "@prisma/client";

export type NationalIdValidationResult = {
  normalized: string;
  isPresent: boolean;
  isExactLength: boolean;
  isValid: boolean;
  birthDate: Date | null;
};

export function normalizeNationalId(value: string | null | undefined) {
  return (value ?? "").replace(/\D/g, "").trim();
}

export function parseEgyptianNationalIdBirthDate(nationalId: string) {
  if (!/^\d{14}$/.test(nationalId)) {
    return null;
  }

  const centuryDigit = nationalId[0];
  const year = Number(nationalId.slice(1, 3));
  const month = Number(nationalId.slice(3, 5));
  const day = Number(nationalId.slice(5, 7));
  const century = centuryDigit === "2" ? 1900 : centuryDigit === "3" ? 2000 : null;

  if (!century) {
    return null;
  }

  const fullYear = century + year;
  const date = new Date(Date.UTC(fullYear, month - 1, day));
  if (
    Number.isNaN(date.getTime()) ||
    date.getUTCFullYear() !== fullYear ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

export function validateNationalId(value: string | null | undefined): NationalIdValidationResult {
  const normalized = normalizeNationalId(value);
  const isExactLength = /^\d{14}$/.test(normalized);
  const birthDate = isExactLength ? parseEgyptianNationalIdBirthDate(normalized) : null;

  return {
    normalized,
    isPresent: normalized.length > 0,
    isExactLength,
    isValid: Boolean(birthDate),
    birthDate,
  };
}

export function getNationalIdValidationStatus(value: string | null | undefined): NationalIdValidationStatus {
  const result = validateNationalId(value);

  if (!result.isPresent) {
    return NationalIdValidationStatus.UNKNOWN;
  }

  return result.isValid
    ? NationalIdValidationStatus.VALID
    : NationalIdValidationStatus.INVALID;
}
