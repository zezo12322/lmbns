/**
 * Tests for PUT /api/settings
 *
 * Covers:
 *  - successful settings update
 *  - only ADMINS can update settings
 *  - validation rejects bad payloads
 *  - 404 when branch doesn't exist
 *  - audit log written after update
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  buildRequest,
  parseResponse,
  prismaMock,
  resetPrismaMock,
  rejectAuth,
} from "../setup";
import { writeAuditLog } from "@/lib/audit";

import { PUT } from "@/app/api/settings/route";

const validSettings = {
  nameArabic: "فرع بني سويف",
  nameEnglish: "Beni Suef Branch",
  address: "شارع الجمهورية، بني سويف",
  phones: ["01012345678", "01298765432"],
  donationChannels: ["فودافون كاش: 01012345678"],
};

describe("PUT /api/settings", () => {
  beforeEach(() => {
    resetPrismaMock();
    vi.clearAllMocks();
  });

  // ── Access control ─────────────────────────────────────────────────────────

  it("returns 401 when unauthenticated", async () => {
    rejectAuth(401);
    const res = await PUT(buildRequest(validSettings, "PUT"));
    expect((await parseResponse(res)).status).toBe(401);
  });

  it("returns 403 when user is not admin", async () => {
    rejectAuth(403);
    const res = await PUT(buildRequest(validSettings, "PUT"));
    expect((await parseResponse(res)).status).toBe(403);
  });

  // ── Validation ─────────────────────────────────────────────────────────────

  it("returns 400 when nameArabic is missing", async () => {
    const { nameArabic, ...bad } = validSettings;
    const res = await PUT(buildRequest(bad, "PUT"));
    const { status, json } = await parseResponse(res);
    expect(status).toBe(400);
    expect((json as any).details).toBeDefined();
  });

  it("returns 400 when nameArabic is too short", async () => {
    const res = await PUT(
      buildRequest({ ...validSettings, nameArabic: "أ" }, "PUT"),
    );
    const { status } = await parseResponse(res);
    expect(status).toBe(400);
  });

  // ── Branch not found ──────────────────────────────────────────────────────

  it("returns 404 when branch does not exist", async () => {
    (prismaMock as any).branch = {
      findUnique: vi.fn().mockResolvedValue(null),
    };

    const res = await PUT(buildRequest(validSettings, "PUT"));
    const { status } = await parseResponse(res);
    expect(status).toBe(404);
  });

  // ── Success ────────────────────────────────────────────────────────────────

  it("updates branch settings and returns success", async () => {
    (prismaMock as any).branch = {
      findUnique: vi.fn().mockResolvedValue({ id: "branch-bns-01" }),
      update: vi.fn().mockResolvedValue({ id: "branch-bns-01" }),
    };

    const res = await PUT(buildRequest(validSettings, "PUT"));
    const { status, json } = await parseResponse(res);

    expect(status).toBe(200);
    expect(json).toEqual(expect.objectContaining({ success: true }));
  });

  it("writes audit log on successful update", async () => {
    (prismaMock as any).branch = {
      findUnique: vi.fn().mockResolvedValue({ id: "branch-bns-01" }),
      update: vi.fn().mockResolvedValue({ id: "branch-bns-01" }),
    };

    await PUT(buildRequest(validSettings, "PUT"));

    expect(writeAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "UPDATE",
        entityType: "Branch",
        entityId: "branch-bns-01",
      }),
    );
  });

  it("merges settings correctly — filters empty phone entries", async () => {
    const updateMock = vi.fn().mockResolvedValue({ id: "branch-bns-01" });
    (prismaMock as any).branch = {
      findUnique: vi.fn().mockResolvedValue({ id: "branch-bns-01" }),
      update: updateMock,
    };

    await PUT(
      buildRequest(
        { ...validSettings, phones: ["01012345678", "", "01098765432"] },
        "PUT",
      ),
    );

    expect(updateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          settings: expect.objectContaining({
            phones: ["01012345678", "01098765432"],
          }),
        }),
      }),
    );
  });
});
