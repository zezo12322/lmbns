/**
 * Shared test setup — auto-mocks for Prisma, auth, audit, logger, rate-limit.
 *
 * Each test file imports the mock helpers it needs. The vi.mock() calls here
 * ensure every route handler sees the mocked modules instead of real ones.
 */
import { vi, type Mock } from "vitest";
import { NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// 1. Prisma mock
// ---------------------------------------------------------------------------

/** Recursive proxy that returns itself for any chained call (e.g. prisma.newsPost.findUnique) */
function createPrismaMock() {
  const handler: ProxyHandler<Record<string, unknown>> = {
    get(_target, prop) {
      if (prop === "then") return undefined; // prevent await-proxy loops
      if (typeof prop === "symbol") return undefined;
      // Return a jest-like mock function that resolves to null by default
      if (!_target[prop as string]) {
        _target[prop as string] = new Proxy(
          Object.assign(() => Promise.resolve(null), {}) as unknown as Record<string, unknown>,
          handler,
        );
      }
      return _target[prop as string];
    },
    apply(target) {
      return (target as unknown as Function)();
    },
  };

  return new Proxy({} as Record<string, unknown>, handler);
}

export const prismaMock = createPrismaMock();

vi.mock("@/lib/db", () => ({
  prisma: prismaMock,
}));

// ---------------------------------------------------------------------------
// 2. Prevent next-auth from resolving next/server at import time
// ---------------------------------------------------------------------------

vi.mock("@/auth", () => ({
  auth: vi.fn().mockResolvedValue(null),
  handlers: {},
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

// ---------------------------------------------------------------------------
// 3. Auth-utils mock — full replacement (avoids chaining into next-auth)
// ---------------------------------------------------------------------------

/** Default "authenticated admin" session returned by requireRoleApi */
export const defaultSession = {
  user: {
    id: "user-test-001",
    name: "Test Admin",
    email: "admin@test.com",
    role: "SUPER_ADMIN",
    branchId: "branch-bns-01",
  },
  expires: new Date(Date.now() + 86_400_000).toISOString(),
};

export let mockRequireRoleApi: Mock;

/** Mirror of src/lib/auth-utils Role (avoids real import chain) */
const Role = {
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

const RoleGroups = {
  ADMINS: [Role.SUPER_ADMIN, Role.BRANCH_ADMIN],
  CASE_TEAM: [
    Role.SUPER_ADMIN, Role.BRANCH_ADMIN, Role.INTAKE_OFFICER,
    Role.CASE_MANAGER, Role.COMMITTEE_REVIEWER, Role.FIELD_RESEARCHER,
  ],
  EXPORT_ALLOWED: [
    Role.SUPER_ADMIN, Role.BRANCH_ADMIN, Role.CASE_MANAGER,
    Role.COMMITTEE_REVIEWER,
  ],
  VOLUNTEER_MANAGERS: [Role.SUPER_ADMIN, Role.BRANCH_ADMIN, Role.VOLUNTEER_COORDINATOR],
  CONTENT_EDITORS: [Role.SUPER_ADMIN, Role.BRANCH_ADMIN, Role.CONTENT_MANAGER],
  PROGRAM_TEAM: [
    Role.SUPER_ADMIN, Role.BRANCH_ADMIN, Role.PROGRAM_MANAGER,
    Role.OPERATIONS_OFFICER,
  ],
} as const;

vi.mock("@/lib/auth-utils", () => {
  mockRequireRoleApi = vi.fn().mockResolvedValue({ session: defaultSession });

  return {
    Role,
    RoleGroups,
    requireAuth: vi.fn().mockResolvedValue(defaultSession),
    requireRole: vi.fn().mockResolvedValue(defaultSession),
    requireAuthApi: vi.fn().mockResolvedValue({ session: defaultSession }),
    requireRoleApi: mockRequireRoleApi,
    parseBranchSettings: vi.fn((raw: unknown) => (typeof raw === "object" && raw ? raw : {})),
  };
});

// ---------------------------------------------------------------------------
// 3. Audit & logger — silent stubs
// ---------------------------------------------------------------------------

vi.mock("@/lib/audit", () => ({
  writeAuditLog: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/logger", () => ({
  log: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// ---------------------------------------------------------------------------
// 4. Rate-limit — always allow
// ---------------------------------------------------------------------------

vi.mock("@/lib/rate-limit", () => ({
  getClientIp: vi.fn().mockReturnValue("127.0.0.1"),
  checkRateLimit: vi
    .fn()
    .mockReturnValue({ allowed: true, remaining: 9, resetAt: Date.now() + 60_000 }),
  buildRateLimitHeaders: vi.fn().mockReturnValue({
    "X-RateLimit-Remaining": "9",
    "X-RateLimit-Reset": "60",
  }),
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a minimal Request object for testing route handlers */
export function buildRequest(
  body: unknown,
  method = "POST",
  url = "http://localhost:3000/test",
): Request {
  return new Request(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

/** Extract the JSON body + status from a NextResponse */
export async function parseResponse(res: Response) {
  const status = res.status;
  const text = await res.text();
  let json: unknown = undefined;
  try {
    json = JSON.parse(text);
  } catch {
    // Not JSON (e.g. CSV export)
  }
  return { status, json, text };
}

/**
 * Configure requireRoleApi to reject with 401 (unauthenticated) or
 * 403 (wrong role).
 */
export function rejectAuth(statusCode: 401 | 403 = 401) {
  const msg =
    statusCode === 401
      ? { error: "Unauthorized" }
      : { error: "Forbidden: Insufficient privileges." };
  mockRequireRoleApi.mockResolvedValueOnce({
    error: NextResponse.json(msg, { status: statusCode }),
  });
}

/**
 * Configure requireRoleApi to return a session with a specific role.
 */
export function setAuthRole(role: string) {
  mockRequireRoleApi.mockResolvedValueOnce({
    session: {
      ...defaultSession,
      user: { ...defaultSession.user, role },
    },
  });
}

/** Reset prisma mock properties to fresh stubs between tests */
export function resetPrismaMock() {
  // Clear all top-level model proxies so tests don't leak state
  for (const key of Object.keys(prismaMock)) {
    delete (prismaMock as Record<string, unknown>)[key];
  }
}
