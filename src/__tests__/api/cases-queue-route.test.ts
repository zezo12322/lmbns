import { beforeEach, describe, expect, it, vi } from "vitest";
import { parseResponse, prismaMock, resetPrismaMock } from "../setup";
import { GET } from "@/app/api/cases/queues/[queueKey]/route";

function buildGetRequest(url = "http://localhost:3000/api/cases/queues/new?page=1&pageSize=10") {
  return new Request(url, { method: "GET" });
}

const sampleCase = {
  id: "case-1",
  caseNumber: "BNS-2026-1001",
  title: "حالة طارئة",
  status: "NEW",
  priority: "HIGH",
  managerReviewState: "NOT_SENT",
  createdAt: new Date("2026-03-01T10:00:00Z"),
  updatedAt: new Date("2026-03-02T10:00:00Z"),
  assignments: [],
  household: {
    name: "أسرة أحمد",
    members: [
      {
        isPrimary: true,
        person: {
          id: "person-1",
          firstName: "أحمد",
          lastName: "محمد",
          phone: "01000000000",
          nationalId: "29801011234567",
          nationalIdValidationStatus: "VALID",
        },
      },
    ],
  },
  village: { name: "قرية 1", center: { id: "center-1", name: "مركز 1" } },
  intakeRequest: null,
};

describe("GET /api/cases/queues/[queueKey]", () => {
  beforeEach(() => {
    resetPrismaMock();
    vi.clearAllMocks();
  });

  it("returns 400 for unknown queue key", async () => {
    const res = await GET(buildGetRequest(), {
      params: Promise.resolve({ queueKey: "unknown-queue" }),
    });
    const { status, json } = await parseResponse(res);

    expect(status).toBe(400);
    expect((json as any).error).toBe("Unknown queue key");
  });

  it("returns queue payload for valid queues", async () => {
    (prismaMock as any).case = {
      count: vi.fn().mockResolvedValue(1),
      findMany: vi.fn().mockResolvedValue([sampleCase]),
    };

    const res = await GET(buildGetRequest(), {
      params: Promise.resolve({ queueKey: "new" }),
    });
    const { status, json } = await parseResponse(res);

    expect(status).toBe(200);
    expect((json as any).queue.key).toBe("new");
    expect((json as any).items).toHaveLength(1);
    expect((json as any).items[0].beneficiaryName).toBe("أحمد محمد");
  });
});
