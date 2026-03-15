# Implementation-Ready Backlog

**Generated:** 2026-03-12 · **Source:** Product Completeness Audit  
**Stack:** Next.js 16 / React 19 / Prisma 5 / PostgreSQL / Auth.js v5

---

## 1) Cleaned Backlog Summary

**52 audit findings** consolidated into **38 unique engineering tasks** after removing duplicates and merging overlaps.

| Category | Tasks | Criticality |
|---|---|---|
| Broken routes / dead UI | 4 | 🔴 Blocks usage |
| Case management lifecycle | 9 | 🔴 Core business |
| Identity & access control | 2 | 🔴 Ops blocker |
| Volunteer workflow | 6 | 🟡 High-value |
| Programs & projects | 4 | 🟡 High-value |
| CMS & public website | 5 | 🟡 Mixed |
| Organization structure | 2 | 🟡 Enables geo data |
| Infrastructure / DX | 6 | 🟡 Scalability |

**Removed duplicates:**
- "Case PDF export" and "Volunteer CSV export" merged into single export task
- "Public news hardcoded" and "Public programs hardcoded" merged into "Wire public pages to DB"
- "Homepage stats hardcoded" and "Dashboard +12% hardcoded" merged into "Replace hardcoded stats"
- Multiple "dead button" items collapsed into their parent API task (e.g., "wire accept/reject buttons" is part of "volunteer status API")
- "Volunteer manual add" merged into "Volunteer edit/create form"
- "Page CMS", "FAQ module", "Media library" merged into "CMS expansion pack"
- "Newsletter" + "Partner CRUD" merged into "Public site polish"

---

## 2) Dependency Map

```
┌─────────────────────────────────────────────────────────────────────┐
│                        LAYER 0 — FIX BROKEN                        │
│  T01 Fix /trainings 404                                            │
│  T02 Fix /households/[id] 404                                      │
│  T03 Wire public /news to DB                                       │
└───────────────┬─────────────────────────────────────────────────────┘
                │
┌───────────────▼─────────────────────────────────────────────────────┐
│                    LAYER 1 — UNBLOCK OPERATIONS                     │
│                                                                     │
│  T04 User CRUD ──────────────┐                                      │
│  T05 Case transition API ────┤                                      │
│  T06 Volunteer status API ───┘── all 3 unblock daily workflows      │
│  T07 Center/Village CRUD ─── enables geo assignment in T11, T18     │
│  T08 Contact form API                                               │
└───────────────┬─────────────────────────────────────────────────────┘
                │
┌───────────────▼─────────────────────────────────────────────────────┐
│                LAYER 2 — CASE LIFECYCLE COMPLETION                   │
│                                                                     │
│  T09  Case notes CRUD                                               │
│  T10  Case edit form + API                                          │
│  T11  Case assignment API ←── depends on T04 (needs user list)      │
│  T12  Visit + NeedAssessment ←── depends on T07 (village context)   │
│  T13  Committee decision CRUD                                       │
│  T14  Intervention CRUD                                             │
│  T15  Case history tab (data already queried)                       │
│  T16  Follow-up log                                                 │
│  T17  Disbursement tracking ←── depends on T14                      │
└───────────────┬─────────────────────────────────────────────────────┘
                │
┌───────────────▼─────────────────────────────────────────────────────┐
│              LAYER 3 — VOLUNTEER & PROGRAM FEATURES                 │
│                                                                     │
│  T18  Volunteer edit/create ←── benefits from T07 (center picker)   │
│  T19  Volunteer hour logging                                        │
│  T20  Volunteer search/filter                                       │
│  T21  Volunteer teams CRUD                                          │
│  T22  Training sessions + attendance ←── depends on T21             │
│  T23  Program CRUD                                                  │
│  T24  Project CRUD ←── depends on T23                               │
│  T25  Wire public /our-programs to DB ←── depends on T23            │
└───────────────┬─────────────────────────────────────────────────────┘
                │
┌───────────────▼─────────────────────────────────────────────────────┐
│                 LAYER 4 — INFRASTRUCTURE & POLISH                   │
│                                                                     │
│  T26  Pagination on all lists                                       │
│  T27  Branch scoping on queries                                     │
│  T28  Error + not-found pages                                       │
│  T29  Mobile sidebar toggle                                         │
│  T30  Audit log viewer ←── depends on T04 (user context)            │
│  T31  File upload infrastructure                                    │
│  T32  Document management ←── depends on T31                        │
└───────────────┬─────────────────────────────────────────────────────┘
                │
┌───────────────▼─────────────────────────────────────────────────────┐
│                    LAYER 5 — POLISH & EXPANSION                     │
│                                                                     │
│  T33  Household standalone create + edit                            │
│  T34  Person edit within household detail                           │
│  T35  CMS expansion (Pages, Partners, FAQ, Media)                   │
│  T36  Export expansion (PDF cases, CSV volunteers)                   │
│  T37  Replace all hardcoded stats with DB queries                   │
│  T38  Cohort / Enrollment / Milestone / Output / Funder CRUD        │
└─────────────────────────────────────────────────────────────────────┘
```

**Key dependency chains:**
- T04 → T11 → T30 (User CRUD → Case assignment → Audit viewer)
- T07 → T12, T18 (Geography CRUD → Visit context, Volunteer center)
- T14 → T17 (Intervention CRUD → Disbursement tracking)
- T23 → T24 → T25 (Program CRUD → Project CRUD → Public programs)
- T31 → T32 (Upload infra → Document management)
- T21 → T22 (Volunteer teams → Training sessions)

---

## 3) Sprint Plan

### Sprint 1 — "Stop the Bleeding" (fix broken + unblock operations)

**Goal:** Zero 404s, zero dead critical buttons, admin can manage users  
**Estimated effort:** ~5 days  
**Unblocks:** All daily workflows

| ID | Task | Type | Files | Effort |
|---|---|---|---|---|
| T01 | **Fix /trainings 404** — create placeholder page with link to future content | FE | `src/app/(dashboard)/trainings/page.tsx` | 0.5h |
| T02 | **Fix /households/[id] 404** — create household detail page with members table, linked cases, address | FE+BE | `src/app/(dashboard)/households/[id]/page.tsx` | 3h |
| T03 | **Wire public /news to DB** — replace hardcoded array with `prisma.newsPost.findMany({ where: { isPublished: true } })` | FE | `src/app/(public)/news/page.tsx` (modify) | 1h |
| T04 | **User management CRUD** | FE+BE | See sub-tasks | 8h |
| T04a | ↳ `GET/POST /api/users` — list users, create user with hashed password | BE | `src/app/api/users/route.ts` | 2h |
| T04b | ↳ `PUT/DELETE /api/users/[id]` — edit role/name/branch, deactivate | BE | `src/app/api/users/[id]/route.ts` | 2h |
| T04c | ↳ `/settings/users` page — table with role badges, create dialog, edit dialog | FE | `src/app/(dashboard)/settings/users/page.tsx` + components | 4h |
| T05 | **Case status transition API** | BE+FE | See sub-tasks | 6h |
| T05a | ↳ `POST /api/cases/[id]/transition` — accept `{ status, notes }`, validate allowed transitions, write CaseStatusHistory, update case status, audit log | BE | `src/app/api/cases/[id]/transition/route.ts` | 3h |
| T05b | ↳ Wire case detail workflow buttons — make "توجيه لباحث", "جاهز للجنة", "اعتماد نهائي", "رفض" call the transition API | FE | Extract client component in `cases/[id]/` | 3h |
| T06 | **Volunteer application review API + wire buttons** | BE+FE | See sub-tasks | 4h |
| T06a | ↳ `PUT /api/volunteers/[id]/status` — accept `{ status }`, validate transition, audit log | BE | `src/app/api/volunteers/[id]/status/route.ts` | 2h |
| T06b | ↳ Wire accept/reject buttons in volunteer applications tab | FE | Client component in `volunteers/` | 2h |
| T08 | **Contact form API** — `POST /api/public/contact` with Zod + rate limit, wire form on `/contact` | BE+FE | `src/app/api/public/contact/route.ts` + modify contact page | 2h |

**Sprint 1 total: ~24h**

---

### Sprint 2 — "Case Lifecycle" (make case management operational)

**Goal:** Full case lifecycle from intake to follow-up  
**Estimated effort:** ~6 days  
**Depends on:** Sprint 1 (T05 transition API)

| ID | Task | Type | Files | Effort |
|---|---|---|---|---|
| T09 | **Case notes CRUD** | BE+FE | | 3h |
| T09a | ↳ `POST /api/cases/[id]/notes` — Zod-validated, RBAC CASE_TEAM | BE | `src/app/api/cases/[id]/notes/route.ts` | 1h |
| T09b | ↳ Notes list + add form as case detail tab content (replace placeholder) | FE | Client component inside `cases/[id]/` | 2h |
| T10 | **Case edit** | BE+FE | | 5h |
| T10a | ↳ `PUT /api/cases/[id]` — edit title, description, caseType, priority, villageId | BE | `src/app/api/cases/[id]/route.ts` | 2h |
| T10b | ↳ Edit form/dialog — wire "تعديل الحالة" button to open edit form | FE | Client component | 3h |
| T11 | **Case assignment** | BE+FE | | 4h |
| T11a | ↳ `POST/DELETE /api/cases/[id]/assignments` — assign user with role to case | BE | `src/app/api/cases/[id]/assignments/route.ts` | 2h |
| T11b | ↳ Assignment UI in case detail — show assigned users, add/remove | FE | Client component | 2h |
| T12 | **Visit + Need Assessment forms** | BE+FE | | 6h |
| T12a | ↳ `POST /api/cases/[id]/visits` — create visit with nested assessments | BE | `src/app/api/cases/[id]/visits/route.ts` | 2h |
| T12b | ↳ Field-research tab content — visit list, create visit form, assessment sub-form | FE | Replace placeholder in case detail | 4h |
| T13 | **Committee decision CRUD** | BE+FE | | 4h |
| T13a | ↳ `POST /api/cases/[id]/decisions` — decision, amount, notes, reviewer | BE | `src/app/api/cases/[id]/decisions/route.ts` | 1.5h |
| T13b | ↳ Committee tab content — decision list, create form | FE | Replace placeholder in case detail | 2.5h |
| T14 | **Intervention CRUD** | BE+FE | | 4h |
| T14a | ↳ `POST /api/cases/[id]/interventions` — type, description, cost, status | BE | `src/app/api/cases/[id]/interventions/route.ts` | 1.5h |
| T14b | ↳ Add-intervention form in case detail overview section | FE | Client component | 2.5h |
| T15 | **Case history tab** — render full statusHistories (data already queried in page.tsx, just tab content is placeholder) | FE | Modify `cases/[id]/page.tsx` | 1.5h |
| T16 | **Follow-up log** | BE+FE | | 3h |
| T16a | ↳ `POST /api/cases/[id]/followups` — date, notes, status | BE | `src/app/api/cases/[id]/followups/route.ts` | 1h |
| T16b | ↳ Follow-up section in case detail (could be part of history or separate tab) | FE | Component in case detail | 2h |

**Sprint 2 total: ~30h**

---

### Sprint 3 — "Volunteer & Programs" (complete remaining domains)

**Goal:** Operational volunteer CRM, functional program management  
**Estimated effort:** ~6 days  
**Depends on:** Sprint 1 (T06 volunteer status API)

| ID | Task | Type | Files | Effort |
|---|---|---|---|---|
| T07 | **Center + Village CRUD** | BE+FE | | 5h |
| T07a | ↳ `GET/POST /api/settings/centers` + `GET/POST /api/settings/villages` | BE | 2 route files | 2h |
| T07b | ↳ `/settings/geography` page — center list + create, villages nested under centers | FE | New page + components | 3h |
| T18 | **Volunteer edit/create form** | BE+FE | | 4h |
| T18a | ↳ `PUT /api/volunteers/[id]` — edit profile fields, skills, centerId | BE | `src/app/api/volunteers/[id]/route.ts` | 1.5h |
| T18b | ↳ Edit form (wire "تعديل الملف" button) + manual create form (wire "إضافة متطوع يدوياً") | FE | Client components | 2.5h |
| T19 | **Volunteer hour logging** | BE+FE | | 3h |
| T19a | ↳ `POST /api/volunteers/[id]/hours` — date, hours, activity | BE | Route file | 1h |
| T19b | ↳ Add-hours form in volunteer detail page (wire "تسجيل ساعات نشاط" button) | FE | Client component | 2h |
| T20 | **Volunteer search/filter** — wire search input to URL query params, add `where` clause to Prisma query | FE+BE | Modify `volunteers/page.tsx` | 2h |
| T21 | **Volunteer teams CRUD** | BE+FE | | 4h |
| T21a | ↳ `GET/POST /api/volunteers/teams` + `PUT/DELETE /api/volunteers/teams/[id]` | BE | 2 route files | 2h |
| T21b | ↳ Teams tab content — team list, create, assign volunteers | FE | Replace placeholder in volunteers page | 2h |
| T22 | **Training sessions + attendance** | BE+FE | | 5h |
| T22a | ↳ `GET/POST /api/trainings` + `POST /api/trainings/[id]/attendance` | BE | 2 route files | 2h |
| T22b | ↳ `/trainings` page upgrade — session list, create form, attendance sheet | FE | Upgrade T01 placeholder | 3h |
| T23 | **Program CRUD** | BE+FE | | 4h |
| T23a | ↳ `POST /api/programs` + `PUT/DELETE /api/programs/[id]` — RBAC PROGRAM_TEAM | BE | 2 route files | 2h |
| T23b | ↳ Create program form/dialog, wire "إضافة برنامج رئيسي" button | FE | Client component in programs page | 2h |
| T24 | **Project CRUD** | BE+FE | | 4h |
| T24a | ↳ `POST /api/programs/[id]/projects` + `PUT/DELETE /api/projects/[id]` | BE | 2 route files | 2h |
| T24b | ↳ Create project form/dialog, wire "بناء مشروع جديد" button | FE | Client component in programs page | 2h |
| T25 | **Wire public /our-programs to DB** — replace hardcoded array with program query | FE | Modify `our-programs/page.tsx` | 1h |

**Sprint 3 total: ~32h**

---

### Sprint 4 — "Harden & Polish" (infrastructure + remaining gaps)

**Goal:** Production-grade resilience, no dead-end UI  
**Estimated effort:** ~5 days  
**Depends on:** Sprints 1-3 for full context

| ID | Task | Type | Files | Effort |
|---|---|---|---|---|
| T26 | **Pagination** — add `take`/`skip` + page controls to cases, households, intake, volunteers, programs, news CMS, audit log | FE+BE | ~7 pages modified | 6h |
| T27 | **Branch scoping** — add `where: { branchId }` to all case, household, volunteer, program queries | BE | ~8 query modifications | 3h |
| T28 | **Error + not-found pages** — `error.tsx` and `not-found.tsx` for `(dashboard)` and `(public)` route groups | FE | 4 new files | 2h |
| T29 | **Mobile sidebar toggle** — add state + drawer behavior to sidebar, wire hamburger button | FE | Modify `sidebar.tsx` + `(dashboard)/layout.tsx` | 2h |
| T30 | **Audit log viewer** — `/settings/audit-log` page with filterable, paginated table | FE+BE | `src/app/(dashboard)/settings/audit-log/page.tsx` + `GET /api/audit-log` | 4h |
| T31 | **File upload infrastructure** — upload API endpoint, local/S3 storage adapter, file size/type validation | BE | `src/app/api/upload/route.ts` + `src/lib/storage.ts` | 5h |
| T32 | **Document management** — wire Document model to case detail, volunteer detail | FE+BE | Components + API endpoints | 4h |
| T33 | **Household create + edit** — standalone create form, edit form on detail page | FE+BE | `POST/PUT /api/households` + forms | 4h |
| T34 | **Person edit** — edit person fields within household detail, add/remove members | FE+BE | `PUT /api/persons/[id]` + `POST/DELETE /api/households/[id]/members` | 3h |
| T37 | **Replace hardcoded stats** — dashboard "+12%", homepage "15,000+", public news list | FE | ~3 file modifications | 2h |

**Sprint 4 total: ~35h**

---

### Backlog (Post-Sprint 4 — as capacity allows)

| ID | Task | Type | Effort |
|---|---|---|---|
| T17 | Disbursement/Delivery tracking within interventions | BE+FE | 3h |
| T35 | CMS expansion: Page CRUD, Partner CRUD, FAQ, Media library | FE+BE | 16h |
| T36 | Export expansion: PDF case report, volunteer CSV | BE | 4h |
| T38 | Program sub-entities: Cohort, Enrollment, Milestone, Output, Funder CRUD | FE+BE | 16h |
| — | Loading skeleton components for all pages | FE | 3h |
| — | Bulk operations (batch approve/reject intakes, applications) | FE+BE | 4h |
| — | Notification system (new intakes, pending actions) | FE+BE | 8h |
| — | Newsletter subscription API + store | BE | 2h |

---

## 4) Top 15 Highest-Value Tasks

Ranked by: **operations unblocked × users affected × dependency depth**

| Rank | ID | Task | Why It's High-Value |
|---|---|---|---|
| 1 | **T05** | Case status transition API + wire buttons | **Unblocks the entire case lifecycle.** Without this, every case sits at SCREENING forever. 6 workflow buttons depend on it. |
| 2 | **T04** | User management CRUD | **Only 1 person can log in.** No one can be added to the system without DB access. Blocks T11 (case assignment). |
| 3 | **T02** | Fix /households/[id] 404 | **Active link to broken page.** Every household row in the table links to a crash. |
| 4 | **T06** | Volunteer accept/reject API + wire buttons | **Volunteer applications pile up with no way to process them.** The onboarding funnel is completely stuck. |
| 5 | **T03** | Wire public /news to DB | **CMS is fully built but its output is invisible.** Staff write news that the public never sees. |
| 6 | **T09** | Case notes CRUD | **Core daily action** — field researchers and case managers need to record findings. No current way to do it. |
| 7 | **T12** | Visit + NeedAssessment forms | **The entire field-research workflow** is a placeholder tab. This is how cases get investigated. |
| 8 | **T13** | Committee decision CRUD | **The approval/rejection bottleneck.** Cases can't progress past COMMITTEE_REVIEW without this. |
| 9 | **T10** | Case edit form + API | **Cases can't be corrected** after creation. Wrong type, wrong priority — stuck forever. |
| 10 | **T01** | Fix /trainings 404 | **Sidebar nav leads to crash.** Every logged-in user sees and can click this. |
| 11 | **T07** | Center + Village CRUD | **Enables geographic data** on cases and volunteers. Required for meaningful field research assignments. |
| 12 | **T14** | Intervention CRUD | **The delivery mechanism.** Approved cases need interventions scheduled to actually help families. |
| 13 | **T19** | Volunteer hour logging | **Volunteer engagement tracking** — the primary metric for volunteer program health. Button exists, does nothing. |
| 14 | **T26** | Pagination on all lists | **Tables will break** as data grows. Currently fetches all rows on every page load. |
| 15 | **T18** | Volunteer edit/create form | **Can't fix volunteer data or add volunteers manually.** Both buttons exist but are inert. |

---

## 5) Dedicated Domain Sections

---

### 5A. Beneficiary & Household Work

**Current state:** Households are auto-created during intake conversion. List page works. Detail page is 404. Person records are auto-created with no way to edit. Household members can't be added/removed.

**Task breakdown:**

| Phase | Task | Backend | Frontend | Depends On |
|---|---|---|---|---|
| S1 | **T02: Household detail page** | Query household with members, cases, address | New page: members table, linked cases, household info card | — |
| S4 | **T33: Household create + edit** | `POST /api/households` (create with primary person), `PUT /api/households/[id]` | Create form dialog on list page, edit form on detail page | T02 |
| S4 | **T34: Person edit + member management** | `PUT /api/persons/[id]`, `POST /api/households/[id]/members`, `DELETE /api/households/[id]/members/[memberId]` | Edit person dialog from member row, add-member form | T02, T33 |

**API contracts:**

```
POST   /api/households         { name, address, income?, primaryPerson: { firstName, lastName, phone, nationalId? } }
PUT    /api/households/[id]    { name?, address?, income? }
PUT    /api/persons/[id]       { firstName?, lastName?, phone?, nationalId?, gender?, dateOfBirth?, maritalStatus? }
POST   /api/households/[id]/members    { personId, relationship, isPrimary? }
DELETE /api/households/[id]/members/[memberId]
```

---

### 5B. Case Workflow Work

**Current state:** Intake→Case conversion works. Cases display in list and detail views. All 6 workflow buttons, all 3 placeholder tabs, edit button, and PDF button are non-functional. 12 case sub-entity models in schema have zero CRUD.

**Task breakdown (ordered by workflow sequence):**

| Phase | Task | Backend | Frontend | Depends On |
|---|---|---|---|---|
| S1 | **T05: Status transition** | `POST /api/cases/[id]/transition` — validate `{ status, notes }`, enforce allowed transitions (NEW→SCREENING→FIELD_RESEARCH→COMMITTEE_REVIEW→APPROVED/REJECTED→IN_EXECUTION→FOLLOW_UP→CLOSED), write CaseStatusHistory, audit log | Extract `case-actions.tsx` client component, wire 4 workflow buttons + reject button | — |
| S2 | **T15: History tab** | — (data already queried) | Render full `statusHistories` array with user names, timestamps, notes in history tab | T05 |
| S2 | **T09: Case notes** | `POST /api/cases/[id]/notes` — `{ content }`, RBAC CASE_TEAM | Notes tab: list existing + add-note textarea/button | — |
| S2 | **T10: Case edit** | `PUT /api/cases/[id]` — `{ title?, description?, caseType?, priority?, villageId?, centerId? }` | Edit dialog/form triggered by "تعديل الحالة" button | — |
| S2 | **T11: Case assignment** | `POST /api/cases/[id]/assignments` — `{ userId, role }`, `DELETE .../assignments/[assignId]` | Assignment section in case detail showing assigned users + add/remove | T04 |
| S2 | **T12: Visit + NeedAssessment** | `POST /api/cases/[id]/visits` — `{ date, findings, assessments: [{ needType, score, details }] }` | Field-research tab: visit list cards, create-visit form with nested assessment rows | T07 (nice-to-have) |
| S2 | **T13: Committee decision** | `POST /api/cases/[id]/decisions` — `{ decision, amount?, notes? }`, auto-set reviewerId from session | Committee tab: decision cards, create-decision form | — |
| S2 | **T14: Intervention** | `POST /api/cases/[id]/interventions` — `{ type, description?, cost?, status? }` | Add-intervention form in overview section | — |
| S2 | **T16: Follow-up** | `POST /api/cases/[id]/followups` — `{ date, notes, status }` | Follow-up section/tab with log entries + add form | — |
| S4+ | **T17: Disbursement** | `POST /api/interventions/[id]/deliveries` — `{ date, amount?, items?, notes? }` | Delivery log inside intervention detail | T14 |

**Allowed status transitions (encode in API):**

```
NEW            → SCREENING
SCREENING      → FIELD_RESEARCH, MISSING_DOCUMENTS, REJECTED
MISSING_DOCUMENTS → SCREENING
FIELD_RESEARCH → UNDER_REVIEW
UNDER_REVIEW   → COMMITTEE_REVIEW
COMMITTEE_REVIEW → APPROVED, REJECTED
APPROVED       → IN_EXECUTION
REJECTED       → REOPENED
IN_EXECUTION   → FOLLOW_UP, CLOSED
FOLLOW_UP      → CLOSED, IN_EXECUTION
CLOSED         → REOPENED
REOPENED       → SCREENING
```

---

### 5C. Volunteer Workflow Work

**Current state:** Public application form works end-to-end. Dashboard shows volunteer list, applications, and detail views (all read-only). Accept/reject buttons, edit button, hour-log button, team tab, search input — all non-functional. /trainings is 404.

**Task breakdown:**

| Phase | Task | Backend | Frontend | Depends On |
|---|---|---|---|---|
| S1 | **T06: Application review** | `PUT /api/volunteers/[id]/status` — `{ status }`, validate VolunteerStatus transitions, audit log | Wire accept/reject buttons on application cards to call API with `ACCEPTED`/`REJECTED`, refresh page | — |
| S3 | **T18: Volunteer edit/create** | `PUT /api/volunteers/[id]` — all profile fields; `POST /api/volunteers` — manual create | Edit form (wire "تعديل الملف"), create dialog (wire "إضافة متطوع يدوياً") | — |
| S3 | **T19: Hour logging** | `POST /api/volunteers/[id]/hours` — `{ date, hours, activity }` | Add-hours form in detail page (wire "تسجيل ساعات نشاط" button) | — |
| S3 | **T20: Search/filter** | Add search params to volunteer list query (`where: { OR: [{ firstName: contains }, { phone: contains }] }`) | Wire search input to URL params with `useSearchParams`, debounce | — |
| S3 | **T21: Teams CRUD** | `GET/POST /api/volunteers/teams`, `PUT/DELETE /api/volunteers/teams/[id]`, `POST /api/volunteers/teams/[id]/members` | Teams tab content: team list, create, member assignment checkboxes | — |
| S3 | **T22: Training sessions** | `GET/POST /api/trainings`, `POST /api/trainings/[id]/attendance` — bulk attendance sheet | `/trainings` page (upgrade from T01): session list, create form, attendance sheet with volunteer checkboxes | T01, T21 |

**Volunteer status transition rules (encode in API):**

```
APPLIED          → UNDER_REVIEW, REJECTED
UNDER_REVIEW     → ACCEPTED, REJECTED
ACCEPTED         → TRAINING_PENDING, ACTIVE
TRAINING_PENDING → ACTIVE, REJECTED
ACTIVE           → INACTIVE
INACTIVE         → ACTIVE
REJECTED         → (terminal)
```

---

### 5D. Programs Work

**Current state:** Programs and projects display in read-only tables/cards with analytics (beneficiary counts, budget totals, milestone progress bars). All create/edit buttons are inert. Public `/our-programs` is hardcoded. 6 sub-entity models (Cohort, Enrollment, Milestone, Output, Funder) have zero CRUD.

**Task breakdown:**

| Phase | Task | Backend | Frontend | Depends On |
|---|---|---|---|---|
| S3 | **T23: Program CRUD** | `POST /api/programs` — `{ name, description, startDate?, endDate?, branchId, status }`, `PUT/DELETE /api/programs/[id]` — RBAC PROGRAM_TEAM | Create-program dialog (wire "إضافة برنامج رئيسي"), edit form in program card | — |
| S3 | **T24: Project CRUD** | `POST /api/programs/[id]/projects` — `{ name, description, budget? }`, `PUT/DELETE /api/projects/[id]` | Create-project dialog (wire "بناء مشروع جديد"), edit via row action | T23 |
| S3 | **T25: Wire public programs** | — | Replace hardcoded array in `/our-programs` with `prisma.program.findMany` | T23 |
| S4+ | **T38a: Cohort + Enrollment** | `POST /api/projects/[id]/cohorts`, `POST /api/cohorts/[id]/enrollments` | Cohort management section inside project detail | T24 |
| S4+ | **T38b: Milestones** | `POST/PUT /api/projects/[id]/milestones` | Milestone checklist in project detail | T24 |
| S4+ | **T38c: Outputs + Funders** | `POST /api/projects/[id]/outputs`, `POST /api/projects/[id]/funders` | Output tracking + funder list in project detail | T24 |

---

### 5E. CMS & Public Website Work

**Current state:** NewsPost has full CRUD (dashboard) and working detail view (public). Public news list is hardcoded. Contact form is decorative. Public programs page is hardcoded. Page/Partner/FAQ models are schema-only or missing. Homepage stats are hardcoded literals.

**Task breakdown:**

| Phase | Task | Backend | Frontend | Depends On |
|---|---|---|---|---|
| S1 | **T03: Wire public /news to DB** | — | Convert to server component, query `prisma.newsPost.findMany({ where: { isPublished: true }, orderBy: { createdAt: 'desc' } })` | — |
| S1 | **T08: Contact form API** | `POST /api/public/contact` — Zod + rate limit, store in new `ContactMessage` table or email forward | Change button from `type="button"` to `type="submit"`, add `onSubmit` with fetch | — |
| S3 | **T25: Wire public /our-programs** | — | Convert hardcoded array to DB query | T23 |
| S4 | **T37: Replace hardcoded stats** | Queries for counts on homepage + dashboard | Replace literals with DB results | — |
| S4+ | **T35a: Page CMS** | `GET/POST/PUT/DELETE /api/cms/pages` | CMS hub enable Pages module, page list + create/edit | — |
| S4+ | **T35b: Partner CRUD** | `GET/POST/PUT/DELETE /api/cms/partners` | Partner management + homepage integration | — |
| S4+ | **T35c: Media library** | Requires T31 (upload infra) | Upload + browse + select for cover images | T31 |

---

## Cross-Reference: Task → Sprint

| Task | Sprint | Domain |
|---|---|---|
| T01 | S1 | Infrastructure |
| T02 | S1 | Household |
| T03 | S1 | CMS/Public |
| T04 | S1 | Identity |
| T05 | S1 | Case |
| T06 | S1 | Volunteer |
| T08 | S1 | CMS/Public |
| T07 | S3 | Organization |
| T09 | S2 | Case |
| T10 | S2 | Case |
| T11 | S2 | Case |
| T12 | S2 | Case |
| T13 | S2 | Case |
| T14 | S2 | Case |
| T15 | S2 | Case |
| T16 | S2 | Case |
| T17 | Backlog | Case |
| T18 | S3 | Volunteer |
| T19 | S3 | Volunteer |
| T20 | S3 | Volunteer |
| T21 | S3 | Volunteer |
| T22 | S3 | Volunteer |
| T23 | S3 | Programs |
| T24 | S3 | Programs |
| T25 | S3 | CMS/Public |
| T26 | S4 | Infrastructure |
| T27 | S4 | Infrastructure |
| T28 | S4 | Infrastructure |
| T29 | S4 | Infrastructure |
| T30 | S4 | Infrastructure |
| T31 | S4 | Infrastructure |
| T32 | S4 | Infrastructure |
| T33 | S4 | Household |
| T34 | S4 | Household |
| T35 | Backlog | CMS |
| T36 | Backlog | Infrastructure |
| T37 | S4 | CMS/Public |
| T38 | Backlog | Programs |
