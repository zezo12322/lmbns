import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireRoleApi, RoleGroups } from "@/lib/auth-utils";
import { writeAuditLog } from "@/lib/audit";
import { log } from "@/lib/logger";

const ROUTE = "/api/cms/news/[id]";

const updateNewsSchema = z.object({
  title: z.string().trim().min(5).max(300),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9-]+$/),
  content: z.string().trim().min(20).max(50_000),
  coverImage: z.string().trim().max(500).optional().or(z.literal("")),
  isPublished: z.boolean(),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireRoleApi(RoleGroups.CONTENT_EDITORS);
  if (authResult.error) return authResult.error;
  const userId = authResult.session.user.id;

  const { id } = await params;

  try {
    const existing = await prisma.newsPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "الخبر غير موجود" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = updateNewsSchema.safeParse(body);
    if (!parsed.success) {
      log.warn("news.update.validation_failed", { route: ROUTE, userId, entityId: id });
      return NextResponse.json(
        { error: "بيانات غير صالحة", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Check slug uniqueness (excluding current post)
    if (data.slug !== existing.slug) {
      const slugTaken = await prisma.newsPost.findUnique({
        where: { slug: data.slug },
      });
      if (slugTaken) {
        log.warn("news.update.slug_conflict", { route: ROUTE, userId, slug: data.slug });
        return NextResponse.json(
          { error: "الرابط المخصص (slug) مستخدم بالفعل." },
          { status: 409 }
        );
      }
    }

    const updated = await prisma.newsPost.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        coverImage: data.coverImage || null,
        isPublished: data.isPublished,
      },
    });

    await writeAuditLog({
      userId,
      action: "UPDATE",
      entityType: "NewsPost",
      entityId: id,
      details: { slug: updated.slug, isPublished: updated.isPublished },
    });

    log.info("news.updated", { route: ROUTE, userId, entityId: id });
    return NextResponse.json({ success: true, id: updated.id });
  } catch (error) {
    log.error("news.update.failed", { route: ROUTE, userId, entityId: id, error });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireRoleApi(RoleGroups.CONTENT_EDITORS);
  if (authResult.error) return authResult.error;
  const userId = authResult.session.user.id;

  const { id } = await params;

  try {
    const existing = await prisma.newsPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "الخبر غير موجود" }, { status: 404 });
    }

    await prisma.newsPost.delete({ where: { id } });

    await writeAuditLog({
      userId,
      action: "DELETE",
      entityType: "NewsPost",
      entityId: id,
      details: { title: existing.title, slug: existing.slug },
    });

    log.info("news.deleted", { route: ROUTE, userId, entityId: id });
    return NextResponse.json({ success: true });
  } catch (error) {
    log.error("news.delete.failed", { route: ROUTE, userId, entityId: id, error });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
