import { PrismaClient, NationalIdValidationStatus } from "@prisma/client";

const prisma = new PrismaClient();

function normalizeNationalId(value: string | null | undefined) {
  return (value ?? "").replace(/\D/g, "").trim();
}

function parseEgyptianNationalId(value: string) {
  if (!/^\d{14}$/.test(value)) {
    return null;
  }

  const centuryDigit = value[0];
  const year = Number(value.slice(1, 3));
  const month = Number(value.slice(3, 5));
  const day = Number(value.slice(5, 7));

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

function getNationalIdValidationStatus(value: string | null | undefined): NationalIdValidationStatus {
  const normalized = normalizeNationalId(value);
  if (!normalized) {
    return NationalIdValidationStatus.UNKNOWN;
  }

  return parseEgyptianNationalId(normalized)
    ? NationalIdValidationStatus.VALID
    : NationalIdValidationStatus.INVALID;
}

async function main() {
  const people = await prisma.person.findMany({
    select: {
      id: true,
      nationalId: true,
      nationalIdValidationStatus: true,
    },
  });

  let updated = 0;

  for (const person of people) {
    const nextStatus = getNationalIdValidationStatus(person.nationalId);
    if (nextStatus === person.nationalIdValidationStatus) {
      continue;
    }

    await prisma.person.update({
      where: { id: person.id },
      data: { nationalIdValidationStatus: nextStatus },
    });
    updated += 1;
  }

  console.log(`Backfilled national ID validation status for ${updated} person record(s).`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
