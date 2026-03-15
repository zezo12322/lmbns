/**
 * Tests for CMS News API
 *
 *  POST /api/cms/news          — create
 *  PUT  /api/cms/news/[id]     — update
 *  DELETE /api/cms/news/[id]   — delete
 *
 * Covers:
 *  - successful CRUD with correct response shapes
 *  - slug uniqueness enforcement
 *  - validation rejection with details
 *  - 404 on missing post
 *  - role-based access control
 *  - audit log written after mutations
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

import { POST } from "@/app/api/cms/news/route";
import { PUT, DELETE } from "@/app/api/cms/news/[id]/route";

const validNews = {
  title: "عنوان خبر تجريبي للاختبار",
  slug: "test-news-slug",
  content: "هذا هو محتوى الخبر التجريبي الذي يتجاوز الحد الأدنى المطلوب من عشرين حرفاً",
  coverImage: "",
  isPublished: true,
};

const existingPost = {
  id: "news-001",
  ...validNews,
  slug: "existing-slug",
  coverImage: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("CMS News API", () => {
  beforeEach(() => {
    resetPrismaMock();
    vi.clearAllMocks();
  });

  // =========================================================================
  // POST /api/cms/news
  // =========================================================================
  describe("POST /api/cms/news (create)", () => {
    it("returns 401 when unauthenticated", async () => {
      rejectAuth(401);
      const res = await POST(buildRequest(validNews));
      expect((await parseResponse(res)).status).toBe(401);
    });

    it("returns 403 when role is not a content editor", async () => {
      rejectAuth(403);
      const res = await POST(buildRequest(validNews));
      expect((await parseResponse(res)).status).toBe(403);
    });

    it("creates a news post and returns 201", async () => {
      (prismaMock as any).newsPost = {
        findUnique: vi.fn().mockResolvedValue(null), // no slug conflict
        create: vi.fn().mockResolvedValue({ id: "news-new", slug: "test-news-slug", isPublished: true }),
      };

      const res = await POST(buildRequest(validNews));
      const { status, json } = await parseResponse(res);

      expect(status).toBe(201);
      expect(json).toEqual(
        expect.objectContaining({ success: true, id: "news-new" }),
      );
      expect(writeAuditLog).toHaveBeenCalledWith(
        expect.objectContaining({ action: "CREATE", entityType: "NewsPost" }),
      );
    });

    it("returns 409 when slug already exists", async () => {
      (prismaMock as any).newsPost = {
        findUnique: vi.fn().mockResolvedValue(existingPost),
      };

      const res = await POST(buildRequest(validNews));
      const { status } = await parseResponse(res);
      expect(status).toBe(409);
    });

    it("returns 400 when title is too short", async () => {
      const res = await POST(buildRequest({ ...validNews, title: "abc" }));
      const { status, json } = await parseResponse(res);
      expect(status).toBe(400);
      expect((json as any).details).toBeDefined();
    });

    it("returns 400 when slug has invalid characters", async () => {
      const res = await POST(
        buildRequest({ ...validNews, slug: "Invalid Slug!" }),
      );
      const { status } = await parseResponse(res);
      expect(status).toBe(400);
    });

    it("returns 400 when content is missing", async () => {
      const { content, ...noContent } = validNews;
      const res = await POST(buildRequest(noContent));
      const { status } = await parseResponse(res);
      expect(status).toBe(400);
    });
  });

  // =========================================================================
  // PUT /api/cms/news/[id]
  // =========================================================================
  describe("PUT /api/cms/news/[id] (update)", () => {
    const callPut = (id: string, body: unknown) =>
      PUT(buildRequest(body, "PUT"), { params: Promise.resolve({ id }) });

    it("returns 401 when unauthenticated", async () => {
      rejectAuth(401);
      const res = await callPut("news-001", validNews);
      expect((await parseResponse(res)).status).toBe(401);
    });

    it("returns 404 when post does not exist", async () => {
      (prismaMock as any).newsPost = {
        findUnique: vi.fn().mockResolvedValue(null),
      };

      const res = await callPut("non-existent", validNews);
      const { status } = await parseResponse(res);
      expect(status).toBe(404);
    });

    it("updates post and returns success", async () => {
      const findUniqueMock = vi
        .fn()
        .mockResolvedValueOnce(existingPost)  // post lookup
        .mockResolvedValueOnce(null);         // slug uniqueness (no conflict)

      (prismaMock as any).newsPost = {
        findUnique: findUniqueMock,
        update: vi.fn().mockResolvedValue({
          id: "news-001",
          slug: "test-news-slug",
          isPublished: true,
        }),
      };

      const res = await callPut("news-001", validNews);
      const { status, json } = await parseResponse(res);

      expect(status).toBe(200);
      expect(json).toEqual(
        expect.objectContaining({ success: true, id: "news-001" }),
      );
      expect(writeAuditLog).toHaveBeenCalledWith(
        expect.objectContaining({ action: "UPDATE", entityType: "NewsPost" }),
      );
    });

    it("returns 409 when new slug conflicts with another post", async () => {
      // findUnique called twice: first for existing post, second for slug check
      const findUniqueMock = vi
        .fn()
        .mockResolvedValueOnce(existingPost) // First call: existing post lookup
        .mockResolvedValueOnce({ id: "news-other", slug: "taken-slug" }); // Second call: slug conflict

      (prismaMock as any).newsPost = {
        findUnique: findUniqueMock,
      };

      const res = await callPut("news-001", {
        ...validNews,
        slug: "taken-slug",
      });
      const { status } = await parseResponse(res);
      expect(status).toBe(409);
    });

    it("skips slug uniqueness check when slug unchanged", async () => {
      const findUniqueMock = vi
        .fn()
        .mockResolvedValueOnce(existingPost); // Only one call needed

      const updateMock = vi.fn().mockResolvedValue({
        id: "news-001",
        slug: existingPost.slug,
        isPublished: true,
      });

      (prismaMock as any).newsPost = {
        findUnique: findUniqueMock,
        update: updateMock,
      };

      // Use same slug as existing
      await callPut("news-001", {
        ...validNews,
        slug: existingPost.slug,
      });

      // findUnique should only be called once (for post lookup, not slug check)
      expect(findUniqueMock).toHaveBeenCalledTimes(1);
    });

    it("returns 400 with validation details for invalid data", async () => {
      (prismaMock as any).newsPost = {
        findUnique: vi.fn().mockResolvedValue(existingPost),
      };

      const res = await callPut("news-001", { ...validNews, title: "ab" });
      const { status, json } = await parseResponse(res);
      expect(status).toBe(400);
      expect((json as any).details).toBeDefined();
    });
  });

  // =========================================================================
  // DELETE /api/cms/news/[id]
  // =========================================================================
  describe("DELETE /api/cms/news/[id]", () => {
    const callDelete = (id: string) =>
      DELETE(buildRequest(undefined, "DELETE"), {
        params: Promise.resolve({ id }),
      });

    it("returns 401 when unauthenticated", async () => {
      rejectAuth(401);
      const res = await callDelete("news-001");
      expect((await parseResponse(res)).status).toBe(401);
    });

    it("returns 404 when post does not exist", async () => {
      (prismaMock as any).newsPost = {
        findUnique: vi.fn().mockResolvedValue(null),
      };

      const res = await callDelete("non-existent");
      const { status } = await parseResponse(res);
      expect(status).toBe(404);
    });

    it("deletes post and returns success", async () => {
      (prismaMock as any).newsPost = {
        findUnique: vi.fn().mockResolvedValue(existingPost),
        delete: vi.fn().mockResolvedValue(existingPost),
      };

      const res = await callDelete("news-001");
      const { status, json } = await parseResponse(res);

      expect(status).toBe(200);
      expect(json).toEqual(expect.objectContaining({ success: true }));
      expect(writeAuditLog).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "DELETE",
          entityType: "NewsPost",
          entityId: "news-001",
        }),
      );
    });
  });
});
