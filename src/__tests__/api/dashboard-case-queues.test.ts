import { beforeEach, describe, expect, it, vi } from "vitest";
import { parseResponse, prismaMock, resetPrismaMock } from "../setup";
import { GET } from "@/app/api/dashboard/case-queues/route";

function buildGetRequest(url = "http://localhost:3000/api/dashboard/case-queues") {
  return new Request(url, { method: "GET" });
}

describe("GET /api/dashboard/case-queues", () => {
  beforeEach(() => {
    resetPrismaMock();
    vi.clearAllMocks();
  });

  it("returns queue counts and chart arrays", async () => {
    (prismaMock as any).case = {
      count: vi
        .fn()
        .mockResolvedValueOnce(2)
        .mockResolvedValueOnce(5)
        .mockResolvedValueOnce(7)
        .mockResolvedValueOnce(3)
        .mockResolvedValueOnce(4)
        .mockResolvedValueOnce(6)
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(8)
        .mockResolvedValueOnce(2),
      groupBy: vi
        .fn()
        .mockResolvedValueOnce([
          { status: "NEW", _count: { id: 5 } },
          { status: "UNDER_REVIEW", _count: { id: 3 } },
        ])
        .mockResolvedValueOnce([
          { priority: "HIGH", _count: { id: 4 } },
          { priority: "URGENT", _count: { id: 2 } },
        ]),
    };

    const res = await GET();
    const { status, json } = await parseResponse(res);

    expect(status).toBe(200);
    expect((json as any).counts.specialistNew).toBe(2);
    expect((json as any).counts.allNew).toBe(5);
    expect((json as any).counts.missingNationalId).toBe(8);
    expect((json as any).charts.statusDistribution).toHaveLength(2);
    expect((json as any).charts.priorityDistribution).toHaveLength(2);
  });
});
