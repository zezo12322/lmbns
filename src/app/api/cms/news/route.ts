import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireRoleApi, RoleGroups } from "@/lib/auth-utils";
import { writeAuditLog } from "@/lib/audit";
import { log } from "@/lib/logger";

const ROUTE = "/api/cms/news";

const createNewsSchema = z.object({
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

export async function POST(req: Request) {
  const authResult = await requireRoleApi(RoleGroups.CONTENT_EDITORS);
  if (authResult.error) return authResult.error;
  const userId = authResult.session.user.id;

  try {
    const body = await req.json();
    const parsed = createNewsSchema.safeParse(body);
    if (!parsed.success) {
      log.warn("news.create.validation_failed", { route: ROUTE, userId });
      return NextResponse.json(
        { error: "بيانات غير صالحة", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Check slug uniqueness
    const existing = await prisma.newsPost.findUnique({
      where: { slug: data.slug },
    });
    if (existing) {
      log.warn("news.create.slug_conflict", { route: ROUTE, userId, slug: data.slug });
      return NextResponse.json(
        { error: "الرابط المخصص (slug) مستخدم بالفعل." },
        { status: 409 }
      );
    }

    const post = await prisma.newsPost.create({
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
      action: "CREATE",
      entityType: "NewsPost",
      entityId: post.id,
      details: { slug: post.slug, isPublished: post.isPublished },
    });

    log.info("news.created", { route: ROUTE, userId, entityId: post.id });
    return NextResponse.json({ success: true, id: post.id }, { status: 201 });
  } catch (error) {
    log.error("news.create.failed", { route: ROUTE, userId, error });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
