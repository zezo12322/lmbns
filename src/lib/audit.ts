/**
 * Reusable audit-log writer.
 *
 * Persists an AuditLog row in the database and emits a structured log line.
 * Fire-and-forget by default — a failed audit write should never break the
 * primary mutation, so errors are caught and logged.
 *
 * Usage:
 *   await writeAuditLog({
 *     userId: session.user.id,
 *     action: "CREATE",
 *     entityType: "NewsPost",
 *     entityId: post.id,
 *     details: { slug: post.slug },
 *   });
 */

import { prisma } from "@/lib/db";
import { log } from "@/lib/logger";
import type { AuditAction, Prisma } from "@prisma/client";

export interface AuditLogEntry {
  userId?: string | null;
  action: AuditAction;
  entityType: string;
  entityId: string;
  details?: Prisma.InputJsonValue;
}

export async function writeAuditLog(entry: AuditLogEntry): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: entry.userId ?? null,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId,
        details: entry.details ?? undefined,
      },
    });

    log.info("audit.recorded", {
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId,
      userId: entry.userId,
    });
  } catch (err) {
    // Never let an audit failure break the caller
    log.error("audit.write_failed", {
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId,
      error: err,
    });
  }
}
