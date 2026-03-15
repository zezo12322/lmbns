import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import type { Session } from "next-auth";

// ---------------------------------------------------------------------------
// Role enum values (mirroring prisma/schema.prisma)
// ---------------------------------------------------------------------------
export const Role = {
  SUPER_ADMIN: "SUPER_ADMIN",
  BRANCH_ADMIN: "BRANCH_ADMIN",
  INTAKE_OFFICER: "INTAKE_OFFICER",
  FIELD_RESEARCHER: "FIELD_RESEARCHER",
  CASE_MANAGER: "CASE_MANAGER",
  COMMITTEE_REVIEWER: "COMMITTEE_REVIEWER",
  OPERATIONS_OFFICER: "OPERATIONS_OFFICER",
  FINANCE_OFFICER: "FINANCE_OFFICER",
  VOLUNTEER_COORDINATOR: "VOLUNTEER_COORDINATOR",
  CONTENT_MANAGER: "CONTENT_MANAGER",
  PROGRAM_MANAGER: "PROGRAM_MANAGER",
  VIEWER: "VIEWER",
} as const;

export type RoleKey = keyof typeof Role;
export type RoleValue = (typeof Role)[RoleKey];

// ---------------------------------------------------------------------------
// Convenient role groups for policy checks
// ---------------------------------------------------------------------------
export const RoleGroups = {
  /** Full admin access */
  ADMINS: [Role.SUPER_ADMIN, Role.BRANCH_ADMIN] as RoleValue[],

  /** Roles that manage case lifecycle */
  CASE_TEAM: [
    Role.SUPER_ADMIN,
    Role.BRANCH_ADMIN,
    Role.INTAKE_OFFICER,
    Role.CASE_MANAGER,
    Role.COMMITTEE_REVIEWER,
    Role.FIELD_RESEARCHER,
  ] as RoleValue[],

  /** Roles allowed to export data */
  EXPORT_ALLOWED: [
    Role.SUPER_ADMIN,
    Role.BRANCH_ADMIN,
    Role.CASE_MANAGER,
    Role.COMMITTEE_REVIEWER,
  ] as RoleValue[],

  /** Roles that manage volunteer workflows */
  VOLUNTEER_MANAGERS: [
    Role.SUPER_ADMIN,
    Role.BRANCH_ADMIN,
    Role.VOLUNTEER_COORDINATOR,
  ] as RoleValue[],

  /** Roles allowed to manage CMS content */
  CONTENT_EDITORS: [
    Role.SUPER_ADMIN,
    Role.BRANCH_ADMIN,
    Role.CONTENT_MANAGER,
  ] as RoleValue[],

  /** Roles allowed to manage programs */
  PROGRAM_TEAM: [
    Role.SUPER_ADMIN,
    Role.BRANCH_ADMIN,
    Role.PROGRAM_MANAGER,
    Role.OPERATIONS_OFFICER,
  ] as RoleValue[],
} as const;

// ---------------------------------------------------------------------------
// Auth helpers for Server Components (pages)
// ---------------------------------------------------------------------------

/**
 * Returns the current session or redirects to login.
 * Use in dashboard Server Components.
 */
export async function requireAuth(): Promise<Session> {
  const session = await auth();
  if (!session) redirect("/login");
  return session;
}

/**
 * Returns the session if the user has one of the allowed roles,
 * otherwise redirects to login (unauthenticated) or returns a
 * redirect to dashboard (insufficient role).
 */
export async function requireRole(allowedRoles: RoleValue[]): Promise<Session> {
  const session = await requireAuth();
  if (!allowedRoles.includes(session.user.role as RoleValue)) {
    redirect("/dashboard");
  }
  return session;
}

// ---------------------------------------------------------------------------
// Auth helpers for API Routes
// ---------------------------------------------------------------------------

/**
 * Returns the session or a 401 JSON response.
 * Use in Route Handlers.
 */
export async function requireAuthApi(): Promise<
  | { session: Session; error?: never }
  | { session?: never; error: NextResponse }
> {
  const session = await auth();
  if (!session) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session };
}

/**
 * Returns the session if the user has one of the allowed roles,
 * otherwise returns 401 or 403.
 */
export async function requireRoleApi(allowedRoles: RoleValue[]): Promise<
  | { session: Session; error?: never }
  | { session?: never; error: NextResponse }
> {
  const result = await requireAuthApi();
  if (result.error) return result;
  if (!allowedRoles.includes(result.session.user.role as RoleValue)) {
    return {
      error: NextResponse.json(
        { error: "Forbidden: Insufficient privileges." },
        { status: 403 }
      ),
    };
  }
  return { session: result.session };
}

// ---------------------------------------------------------------------------
// Branch.settings safe parser
// ---------------------------------------------------------------------------

export interface BranchSettings {
  address?: string;
  phones?: string[];
  donationChannels?: string[];
  [key: string]: unknown;
}

/**
 * Safely reads `branch.settings` (a Prisma Json field) into a typed object.
 *
 * Handles three historical storage shapes:
 *  - Already an object (correct path after seed fix)
 *  - A JSON-encoded string (legacy seed format)
 *  - null / undefined
 */
export function parseBranchSettings(raw: unknown): BranchSettings {
  if (raw === null || raw === undefined) return {};
  if (typeof raw === "object" && !Array.isArray(raw)) return raw as BranchSettings;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === "object" && !Array.isArray(parsed)) return parsed as BranchSettings;
    } catch {
      // corrupted value — return empty
    }
  }
  return {};
}
