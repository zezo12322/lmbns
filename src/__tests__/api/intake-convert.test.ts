/**
 * Tests for POST /api/intake/[id]/convert
 *
 * Covers:
 *  - successful conversion creates case + person + household + audit log
 *  - rejects non-PENDING intake
 *  - rejects non-existent intake
 *  - access control (unauthenticated, wrong role)
 *  - converts intake status to CONVERTED
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  buildRequest,
  parseResponse,
  prismaMock,
  resetPrismaMock,
  rejectAuth,
  setAuthRole,
  mockRequireRoleApi,
} from "../setup";

import { POST } from "@/app/api/intake/[id]/convert/route";

/** Helper to call the route with a specific intake id */
function callConvert(id: string) {
  const req = buildRequest(undefined);
  return POST(req, { params: Promise.resolve({ id }) });
}

const pendingIntake = {
  id: "intake-100",
  requestorName: "محمد أحمد سعيد",
  phone: "01012345678",
  nationalId: "29001011234567",
  description: "طلب مساعدة",
  status: "PENDING",
};

describe("POST /api/intake/[id]/convert", () => {
  beforeEach(() => {
    resetPrismaMock();
    vi.clearAllMocks();
  });

  // ── Access control ─────────────────────────────────────────────────────────

  it("returns 401 when unauthenticated", async () => {
    rejectAuth(401);
    const res = await callConvert("intake-100");
    const { status, json } = await parseResponse(res);
    expect(status).toBe(401);
    expect((json as any).error).toBe("Unauthorized");
  });

  it("returns 403 when user has wrong role", async () => {
    rejectAuth(403);
    const res = await callConvert("intake-100");
    const { status, json } = await parseResponse(res);
    expect(status).toBe(403);
    expect((json as any).error).toContain("Forbidden");
  });

  // ── Invalid intake ─────────────────────────────────────────────────────────

  it("returns 400 when intake does not exist", async () => {
    (prismaMock as any).intakeRequest = {
      findUnique: vi.fn().mockResolvedValue(null),
    };

    const res = await callConvert("non-existent-id");
    const { status } = await parseResponse(res);
    expect(status).toBe(400);
  });

  it("returns 400 when intake is already CONVERTED", async () => {
    (prismaMock as any).intakeRequest = {
      findUnique: vi
        .fn()
        .mockResolvedValue({ ...pendingIntake, status: "CONVERTED" }),
    };

    const res = await callConvert("intake-100");
    const { status } = await parseResponse(res);
    expect(status).toBe(400);
  });

  // ── Successful conversion ─────────────────────────────────────────────────

  it("converts intake to case, creating person + household + case", async () => {
    // Setup intakeRequest.findUnique
    (prismaMock as any).intakeRequest = {
      findUnique: vi.fn().mockResolvedValue(pendingIntake),
    };

    const fakeTx = {
      person: {
        findFirst: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({
          id: "person-001",
          firstName: "محمد",
          lastName: "أحمد سعيد",
        }),
      },
      household: {
        create: vi.fn().mockResolvedValue({ id: "hh-001" }),
      },
      householdMember: {
        create: vi.fn().mockResolvedValue({ id: "hm-001" }),
      },
      case: {
        create: vi.fn().mockResolvedValue({ id: "case-001", caseNumber: "BNS-2026-1234" }),
      },
      intakeRequest: {
        update: vi.fn().mockResolvedValue({}),
      },
      auditLog: {
        create: vi.fn().mockResolvedValue({}),
      },
    };

    (prismaMock as any).$transaction = vi.fn(async (cb: Function) => cb(fakeTx));

    const res = await callConvert("intake-100");
    const { status, json } = await parseResponse(res);

    expect(status).toBe(200);
    expect(json).toEqual(
      expect.objectContaining({ success: true, caseId: "case-001" }),
    );

    // Verify side-effects
    expect(fakeTx.person.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ firstName: "محمد" }),
      }),
    );
    expect(fakeTx.household.create).toHaveBeenCalled();
    expect(fakeTx.householdMember.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ relationship: "HEAD", isPrimary: true }),
      }),
    );
    expect(fakeTx.case.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "SCREENING", caseType: "OTHER" }),
      }),
    );
    expect(fakeTx.intakeRequest.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "CONVERTED" }),
      }),
    );
    expect(fakeTx.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: "CREATE",
          entityType: "CASE",
        }),
      }),
    );
  });

  it("reuses existing person when phone matches", async () => {
    (prismaMock as any).intakeRequest = {
      findUnique: vi.fn().mockResolvedValue(pendingIntake),
    };

    const existingPerson = {
      id: "person-existing",
      firstName: "محمد",
      lastName: "أحمد سعيد",
    };

    const fakeTx = {
      person: {
        findFirst: vi.fn().mockResolvedValue(existingPerson),
        create: vi.fn(),
      },
      household: {
        create: vi.fn().mockResolvedValue({ id: "hh-002" }),
      },
      householdMember: {
        create: vi.fn().mockResolvedValue({ id: "hm-002" }),
      },
      case: {
        create: vi.fn().mockResolvedValue({ id: "case-002" }),
      },
      intakeRequest: {
        update: vi.fn().mockResolvedValue({}),
      },
      auditLog: {
        create: vi.fn().mockResolvedValue({}),
      },
    };

    (prismaMock as any).$transaction = vi.fn(async (cb: Function) => cb(fakeTx));

    const res = await callConvert("intake-100");
    const { status } = await parseResponse(res);

    expect(status).toBe(200);
    expect(fakeTx.person.create).not.toHaveBeenCalled();
    expect(fakeTx.householdMember.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ personId: "person-existing" }),
      }),
    );
  });
});
