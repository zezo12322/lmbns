import { beforeEach, describe, expect, it, vi } from "vitest";
import { parseResponse, prismaMock, resetPrismaMock } from "../setup";
import { GET } from "@/app/api/cases/search/advanced/route";

function buildGetRequest(url: string) {
  return new Request(url, { method: "GET" });
}

describe("GET /api/cases/search/advanced", () => {
  beforeEach(() => {
    resetPrismaMock();
    vi.clearAllMocks();
  });

  it("returns 400 when filters are invalid", async () => {
    const res = await GET(buildGetRequest("http://localhost:3000/api/cases/search/advanced?priority=INVALID"));
    const { status, json } = await parseResponse(res);

    expect(status).toBe(400);
    expect((json as any).error).toBe("Invalid search filters");
  });

  it("returns paginated filtered case results", async () => {
    (prismaMock as any).case = {
      count: vi.fn().mockResolvedValue(1),
      findMany: vi.fn().mockResolvedValue([
        {
          id: "case-1",
          caseNumber: "BNS-2026-3001",
          title: "بحث متقدم",
          status: "UNDER_REVIEW",
          priority: "HIGH",
          managerReviewState: "PENDING",
          createdAt: new Date("2026-03-01T10:00:00Z"),
          updatedAt: new Date("2026-03-03T10:00:00Z"),
          assignments: [],
          household: {
            name: "أسرة خالد",
            members: [
              {
                isPrimary: true,
                person: {
                  id: "person-1",
                  firstName: "خالد",
                  lastName: "حسن",
                  phone: "01022222222",
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

    const res = await GET(buildGetRequest("http://localhost:3000/api/cases/search/advanced?priority=HIGH&page=1&pageSize=10"));
    const { status, json } = await parseResponse(res);

    expect(status).toBe(200);
    expect((json as any).items).toHaveLength(1);
    expect((json as any).filters.priority).toBe("HIGH");
    expect((json as any).pagination.total).toBe(1);
  });
});