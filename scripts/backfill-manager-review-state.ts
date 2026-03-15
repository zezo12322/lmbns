import { PrismaClient, CaseStatus, ManagerReviewState } from "@prisma/client";

const prisma = new PrismaClient();

function inferManagerReviewState(status: CaseStatus): ManagerReviewState {
  if (status === CaseStatus.COMMITTEE_REVIEW) {
    return ManagerReviewState.PENDING;
  }

  return ManagerReviewState.NOT_SENT;
}

async function main() {
  const cases = await prisma.case.findMany({
    select: {
      id: true,
      status: true,
      managerReviewState: true,
    },
  });

  let updated = 0;

  for (const caseItem of cases) {
    const nextState = inferManagerReviewState(caseItem.status);
    if (nextState === caseItem.managerReviewState) {
      continue;
    }

    await prisma.case.update({
      where: { id: caseItem.id },
      data: { managerReviewState: nextState },
    });
    updated += 1;
  }

  console.log(`Backfilled manager review state for ${updated} case record(s).`);
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
