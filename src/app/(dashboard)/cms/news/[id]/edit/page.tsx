import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-utils";
import { notFound } from "next/navigation";
import { EditNewsForm } from "./edit-form";

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;

  const post = await prisma.newsPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <EditNewsForm
      post={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        content: post.content,
        coverImage: post.coverImage ?? "",
        isPublished: post.isPublished,
      }}
    />
  );
}
