import { beforeEach, describe, expect, it, vi } from "vitest";
import { parseResponse, prismaMock, resetPrismaMock } from "../setup";
import { GET } from "@/app/api/cases/search/national-id/route";

function buildGetRequest(url: string) {
  return new Request(url, { method: "GET" });
}

describe("GET /api/cases/search/national-id", () => {
  beforeEach(() => {
    resetPrismaMock();
    vi.clearAllMocks();
  });

  it("returns 400 for malformed IDs", async () => {
    const res = await GET(buildGetRequest("http://localhost:3000/api/cases/search/national-id?nationalId=123"));
    const { status, json } = await parseResponse(res);

    expect(status).toBe(400);
    expect((json as any).error).toContain("14 digits");
  });

  it("returns grouped person/case/intake matches", async () => {
    (prismaMock as any).person = {
      findMany: vi.fn().mockResolvedValue([
        {
          id: "person-1",
          firstName: "منى",
          lastName: "أحمد",
          nationalId: "29801011234567",
          nationalIdValidationStatus: "VALID",
          phone: "01011111111",
        },
      ]),
    };

    (prismaMock as any).case = {
      findMany: vi.fn().mockResolvedValue([
        {
          id: "case-1",
          caseNumber: "BNS-2026-2001",
          title: "مراجعة حالة",
          status: "UNDER_REVIEW",
          priority: "MEDIUM",
          managerReviewState: "NOT_SENT",
          createdAt: new Date("2026-03-01T10:00:00Z"),
          updatedAt: new Date("2026-03-02T10:00:00Z"),
          assignments: [],
          household: {
            name: "أسرة منى",
            members: [
              {
                isPrimary: true,
                person: {
                  id: "person-1",
                  firstName: "منى",
                  lastName: "أحمد",
                  phone: "01011111111",
                  nationalId: "29801011234567",
                  nationalIdValidationStatus: "VALID",
                },
              },
            ],
          },
          village: null,
          intakeRequest: null,
        },
      ]),
    };

    (prismaMock as any).intakeRequest = {
      findMany: vi.fn().mockResolvedValue([
        {
          id: "intake-1",
          requestorName: "منى أحمد",
          createdAt: new Date("2026-02-20T10:00:00Z"),
          status: "PENDING",
        },
      ]),
    };

    const res = await GET(buildGetRequest("http://localhost:3000/api/cases/search/national-id?nationalId=29801011234567"));
    const { status, json } = await parseResponse(res);

    expect(status).toBe(200);
    expect((json as any).found).toBe(true);
    expect((json as any).personMatches).toHaveLength(1);
    expect((json as any).caseMatches).toHaveLength(1);
    expect((json as any).intakeMatches).toHaveLength(1);
  });
});
