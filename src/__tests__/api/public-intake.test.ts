/**
 * Tests for POST /api/public/intake
 *
 * Covers:
 *  - successful submission with valid data
 *  - validation rejects missing required fields
 *  - validation rejects too-short fields
 *  - successful response shape (201, { success, id })
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  buildRequest,
  parseResponse,
  prismaMock,
  resetPrismaMock,
} from "../setup";

// The route handler under test
import { POST } from "@/app/api/public/intake/route";

const validPayload = {
  requestorName: "أحمد محمد علي",
  phone: "01012345678",
  nationalId: "29001011234567",
  description: "أحتاج مساعدة في سداد إيجار المنزل لهذا الشهر بسبب فقدان العمل",
};

describe("POST /api/public/intake", () => {
  beforeEach(() => {
    resetPrismaMock();
    vi.clearAllMocks();
  });

  // ── Success ────────────────────────────────────────────────────────────────

  it("creates an intake request with valid data and returns 201", async () => {
    const fakeRecord = { id: "intake-001", ...validPayload, status: "PENDING" };
    (prismaMock as any).intakeRequest = {
      create: vi.fn().mockResolvedValue(fakeRecord),
    };

    const res = await POST(buildRequest(validPayload));
    const { status, json } = await parseResponse(res);

    expect(status).toBe(201);
    expect(json).toEqual(
      expect.objectContaining({ success: true, id: "intake-001" }),
    );
  });

  it("stores nationalId as null when omitted", async () => {
    const { nationalId, ...payloadNoId } = validPayload;
    const createMock = vi.fn().mockResolvedValue({ id: "intake-002" });
    (prismaMock as any).intakeRequest = { create: createMock };

    await POST(buildRequest(payloadNoId));

    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ nationalId: null }),
      }),
    );
  });

  // ── Validation failures ────────────────────────────────────────────────────

  it("rejects when requestorName is missing", async () => {
    const { requestorName, ...bad } = validPayload;
    const res = await POST(buildRequest(bad));
    const { status, json } = await parseResponse(res);

    expect(status).toBe(400);
    expect((json as any).error).toBeDefined();
  });

  it("rejects when description is too short", async () => {
    const res = await POST(
      buildRequest({ ...validPayload, description: "قصير" }),
    );
    const { status } = await parseResponse(res);
    expect(status).toBe(400);
  });

  it("rejects when phone is too short", async () => {
    const res = await POST(buildRequest({ ...validPayload, phone: "123" }));
    const { status } = await parseResponse(res);
    expect(status).toBe(400);
  });

  it("returns validation details on failure", async () => {
    const res = await POST(buildRequest({}));
    const { status, json } = await parseResponse(res);

    expect(status).toBe(400);
    expect((json as any).details).toBeDefined();
  });
});
