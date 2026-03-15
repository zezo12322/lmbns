/**
 * Structured server-side logger.
 *
 * Outputs JSON lines in production for easy parsing by future log aggregators.
 * Uses readable format in development.
 *
 * Usage:
 *   import { log } from "@/lib/logger";
 *   log.info("entity.created", { entityType: "NewsPost", entityId: id });
 *   log.error("entity.create_failed", { route: "/api/cms/news", error });
 */

type LogLevel = "info" | "warn" | "error";

interface LogContext {
  route?: string;
  userId?: string | null;
  entityType?: string;
  entityId?: string;
  action?: string;
  ip?: string;
  [key: string]: unknown;
}

function formatError(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

function emit(level: LogLevel, event: string, ctx: LogContext = {}) {
  const entry = {
    ts: new Date().toISOString(),
    level,
    event,
    ...ctx,
    // Normalize error objects into serialisable strings
    ...(ctx.error !== undefined ? { error: formatError(ctx.error) } : {}),
  };

  const line = JSON.stringify(entry);

  switch (level) {
    case "error":
      console.error(line);
      break;
    case "warn":
      console.warn(line);
      break;
    default:
      console.log(line);
  }
}

export const log = {
  info: (event: string, ctx?: LogContext) => emit("info", event, ctx),
  warn: (event: string, ctx?: LogContext) => emit("warn", event, ctx),
  error: (event: string, ctx?: LogContext) => emit("error", event, ctx),
};
