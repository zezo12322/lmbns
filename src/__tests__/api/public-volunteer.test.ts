/**
 * Tests for POST /api/public/volunteer
 *
 * Covers:
 *  - successful new volunteer + application creation
 *  - reuses existing profile when phone matches
 *  - validation rejects invalid payloads
 *  - response shape verification
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  buildRequest,
  parseResponse,
  prismaMock,
  resetPrismaMock,
} from "../setup";

import { POST } from "@/app/api/public/volunteer/route";

const validPayload = {
  firstName: "سارة",
  lastName: "أحمد",
  phone: "01098765432",
  email: "sara@example.com",
  motivation: "أريد أن أساهم في خدمة المجتمع ومساعدة الأسر المحتاجة في بني سويف",
  availability: "عطلة نهاية الأسبوع",
};

describe("POST /api/public/volunteer", () => {
  beforeEach(() => {
    resetPrismaMock();
    vi.clearAllMocks();
  });

  // ── Success ────────────────────────────────────────────────────────────────

  it("creates a new volunteer profile + application and returns 201", async () => {
    // $transaction receives a callback — we invoke it with a fake tx
    const fakeTx = {
      volunteerProfile: {
        findFirst: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({
          id: "vol-001",
          firstName: "سارة",
          lastName: "أحمد",
          phone: "01098765432",
        }),
      },
      volunteerApplication: {
        create: vi.fn().mockResolvedValue({ id: "app-001" }),
      },
    };

    (prismaMock as any).$transaction = vi.fn(async (cb: Function) => cb(fakeTx));

    const res = await POST(buildRequest(validPayload));
    const { status, json } = await parseResponse(res);

    expect(status).toBe(201);
    expect(json).toEqual(
      expect.objectContaining({ success: true, id: "app-001" }),
    );
    expect(fakeTx.volunteerProfile.create).toHaveBeenCalled();
    expect(fakeTx.volunteerApplication.create).toHaveBeenCalled();
  });

  it("reuses existing profile when phone matches", async () => {
    const existingProfile = {
      id: "vol-existing",
      firstName: "سارة",
      lastName: "أحمد",
      phone: "01098765432",
    };

    const fakeTx = {
      volunteerProfile: {
        findFirst: vi.fn().mockResolvedValue(existingProfile),
        create: vi.fn(),
      },
      volunteerApplication: {
        create: vi.fn().mockResolvedValue({ id: "app-002" }),
      },
    };

    (prismaMock as any).$transaction = vi.fn(async (cb: Function) => cb(fakeTx));

    const res = await POST(buildRequest(validPayload));
    const { status, json } = await parseResponse(res);

    expect(status).toBe(201);
    // Profile create should NOT have been called
    expect(fakeTx.volunteerProfile.create).not.toHaveBeenCalled();
    // Application should reference existing profile
    expect(fakeTx.volunteerApplication.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ volunteerId: "vol-existing" }),
      }),
    );
  });

  // ── Validation failures ────────────────────────────────────────────────────

  it("rejects when firstName is missing", async () => {
    const { firstName, ...bad } = validPayload;
    const res = await POST(buildRequest(bad));
    const { status } = await parseResponse(res);
    expect(status).toBe(400);
  });

  it("rejects when motivation is too short", async () => {
    const res = await POST(
      buildRequest({ ...validPayload, motivation: "قصير" }),
    );
    const { status } = await parseResponse(res);
    expect(status).toBe(400);
  });

  it("rejects when email is invalid", async () => {
    const res = await POST(
      buildRequest({ ...validPayload, email: "not-an-email" }),
    );
    const { status } = await parseResponse(res);
    expect(status).toBe(400);
  });

  it("accepts empty string email (optional field)", async () => {
    const fakeTx = {
      volunteerProfile: {
        findFirst: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({ id: "vol-003" }),
      },
      volunteerApplication: {
        create: vi.fn().mockResolvedValue({ id: "app-003" }),
      },
    };
    (prismaMock as any).$transaction = vi.fn(async (cb: Function) => cb(fakeTx));

    const res = await POST(buildRequest({ ...validPayload, email: "" }));
    const { status } = await parseResponse(res);
    expect(status).toBe(201);
  });
});
