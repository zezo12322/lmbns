import { Prisma } from "@prisma/client";

export const caseListInclude = Prisma.validator<Prisma.CaseInclude>()({
  assignments: {
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  },
  household: {
    include: {
      members: {
        include: {
          person: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
              nationalId: true,
              nationalIdValidationStatus: true,
            },
          },
        },
      },
    },
  },
  village: {
    include: {
      center: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  intakeRequest: {
    select: {
      id: true,
      requestorName: true,
      phone: true,
      nationalId: true,
      status: true,
      createdAt: true,
    },
  },
});

export type CaseListRow = Prisma.CaseGetPayload<{
  include: typeof caseListInclude;
}>;
