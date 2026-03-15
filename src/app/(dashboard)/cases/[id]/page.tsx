import { notFound } from "next/navigation";
import { CaseStatus } from "@prisma/client";
import { requireAuth } from "@/lib/auth-utils";
import { getCaseDossierData } from "@/lib/case-detail/loader";
import { getAllowedCaseTransitions, getCaseTransitionActionLabel } from "@/lib/case-workflow";
import {
  formatArabicDate,
  formatArabicDateTime,
  getCaseTypeLabel,
  getPriorityLabel,
  getStatusLabel,
} from "@/lib/case-detail/presenters";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CaseDetailSectionHeader } from "@/components/case-detail/section-header";
import { CaseDetailMetadataGrid } from "@/components/case-detail/metadata-grid";
import { CaseSummaryCard } from "@/components/case-detail/case-summary-card";
import { WorkflowBadgeRow } from "@/components/case-detail/workflow-badge-row";
import { AssignmentPanel } from "@/components/case-detail/assignment-panel";
import { HouseholdMemberTable } from "@/components/case-detail/household-member-table";
import { TimelineBlock } from "@/components/case-detail/timeline-block";
import { EmptyDossierState } from "@/components/case-detail/empty-dossier-state";
import { CaseQuickActions } from "@/components/case-detail/case-quick-actions";

function groupInterventionsByStatus(statuses: string[]) {
  const map = new Map<string, number>();
  for (const status of statuses) {
    map.set(status, (map.get(status) ?? 0) + 1);
  }
  return Array.from(map.entries()).map(([status, count]) => ({ status, count }));
}

export default async function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  const { id } = await params;

  const dossier = await getCaseDossierData({
    caseId: id,
    sessionUserId: session.user.id,
    branchId: session.user.branchId || undefined,
  });

  if (!dossier) {
    notFound();
  }

  const interventionGroups = groupInterventionsByStatus(dossier.interventions.map((i) => i.status));
  const pendingFollowUps = dossier.followUps.filter((f) => f.status === "PENDING").length;
  const allowedTransitions = getAllowedCaseTransitions(dossier.status as CaseStatus);
  const transitionOptions = allowedTransitions.map((status) => ({
    value: status,
    label: getCaseTransitionActionLabel(status),
  }));

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      <Card className="border-border/50 shadow-sm">
        <CardContent className="space-y-4 p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{dossier.title}</h1>
                <Badge variant="outline" className="font-semibold">
                  {getStatusLabel(dossier.status)}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="rounded-md bg-muted px-2 py-1 font-mono text-foreground">{dossier.caseNumber}</span>
                <span>•</span>
                <span>{formatArabicDate(dossier.createdAt)}</span>
                <span>•</span>
                <span>{getCaseTypeLabel(dossier.caseType)}</span>
                <span>•</span>
                <span>أولوية {getPriorityLabel(dossier.priority)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline">تصدير PDF</Button>
              <a href="#actions" className={buttonVariants()}>
                إجراءات الحالة
              </a>
            </div>
          </div>

          <WorkflowBadgeRow
            status={dossier.status}
            priority={dossier.priority}
            managerReviewState={dossier.managerReviewState}
            caseType={dossier.caseType}
          />

          <p className="text-sm leading-relaxed text-muted-foreground">{dossier.description}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="h-14 w-full justify-start overflow-x-auto rounded-xl border border-border/30 bg-muted/50 p-1">
          <TabsTrigger value="overview" className="h-10 rounded-lg px-6 text-base">نظرة عامة</TabsTrigger>
          <TabsTrigger value="family" className="h-10 rounded-lg px-6 text-base">الأسرة والبيانات</TabsTrigger>
          <TabsTrigger value="field-research" className="h-10 rounded-lg px-6 text-base">البحث الميداني</TabsTrigger>
          <TabsTrigger value="committee" className="h-10 rounded-lg px-6 text-base">اللجنة والتنفيذ</TabsTrigger>
          <TabsTrigger value="documents" className="h-10 rounded-lg px-6 text-base">المستندات والملاحظات</TabsTrigger>
          <TabsTrigger value="history" className="h-10 rounded-lg px-6 text-base">سجل الإجراءات</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <CaseDetailSectionHeader
            title="ملخص تشغيلي للحالة"
            description="عرض سريع للوضع الحالي، التكليفات، ومؤشرات المتابعة."
          />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <CaseSummaryCard title="عدد التكليفات" value={dossier.assignments.length} />
            <CaseSummaryCard title="الزيارات الميدانية" value={dossier.visits.length} />
            <CaseSummaryCard title="قرارات اللجنة" value={dossier.decisions.length} />
            <CaseSummaryCard title="متابعات معلقة" value={pendingFollowUps} />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">بيانات الحالة الأساسية</CardTitle>
                </CardHeader>
                <CardContent>
                  <CaseDetailMetadataGrid
                    columns={3}
                    items={[
                      { key: "case-type", label: "نوع الحالة", value: getCaseTypeLabel(dossier.caseType) },
                      { key: "priority", label: "الأولوية", value: getPriorityLabel(dossier.priority) },
                      { key: "status", label: "الحالة", value: getStatusLabel(dossier.status) },
                      { key: "manager", label: "مراجعة المدير", value: dossier.managerReviewState },
                      { key: "center", label: "المركز", value: dossier.centerName ?? "غير محدد" },
                      { key: "village", label: "القرية", value: dossier.villageName ?? "غير محدد" },
                      { key: "created", label: "تاريخ الإنشاء", value: formatArabicDate(dossier.createdAt) },
                      { key: "updated", label: "آخر تحديث", value: formatArabicDateTime(dossier.updatedAt) },
                      { key: "household", label: "الأسرة", value: dossier.household.name },
                    ]}
                  />
                </CardContent>
              </Card>

              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">المستفيد الأساسي</CardTitle>
                </CardHeader>
                <CardContent>
                  {dossier.primaryBeneficiary ? (
                    <CaseDetailMetadataGrid
                      columns={3}
                      items={[
                        {
                          key: "name",
                          label: "الاسم",
                          value: `${dossier.primaryBeneficiary.firstName} ${dossier.primaryBeneficiary.lastName}`,
                        },
                        { key: "nid", label: "الرقم القومي", value: dossier.primaryBeneficiary.nationalId ?? "—" },
                        { key: "phone", label: "الهاتف", value: dossier.primaryBeneficiary.phone ?? "—" },
                        { key: "gender", label: "النوع", value: dossier.primaryBeneficiary.gender ?? "—" },
                        {
                          key: "dob",
                          label: "تاريخ الميلاد",
                          value: dossier.primaryBeneficiary.dateOfBirth ? formatArabicDate(dossier.primaryBeneficiary.dateOfBirth) : "—",
                        },
                        { key: "marital", label: "الحالة الاجتماعية", value: dossier.primaryBeneficiary.maritalStatus ?? "—" },
                      ]}
                    />
                  ) : (
                    <EmptyDossierState
                      title="لا يوجد مستفيد أساسي محدد"
                      description="يرجى مراجعة بيانات أفراد الأسرة وتحديد المستفيد الأساسي."
                    />
                  )}
                </CardContent>
              </Card>

              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">ربط طلب الاستقبال</CardTitle>
                </CardHeader>
                <CardContent>
                  {dossier.intakeRequest ? (
                    <CaseDetailMetadataGrid
                      columns={2}
                      items={[
                        { key: "requestor", label: "مقدم الطلب", value: dossier.intakeRequest.requestorName },
                        { key: "status", label: "حالة الطلب", value: dossier.intakeRequest.status },
                        { key: "phone", label: "الهاتف", value: dossier.intakeRequest.phone },
                        { key: "date", label: "تاريخ الطلب", value: formatArabicDate(dossier.intakeRequest.createdAt) },
                      ]}
                    />
                  ) : (
                    <EmptyDossierState title="لا يوجد طلب استقبال مرتبط" description="تم إنشاء الحالة دون ربط مباشر بطلب استقبال." />
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <CaseQuickActions caseId={dossier.id} allowedTransitions={transitionOptions} />

              <AssignmentPanel assignments={dossier.assignments} />

              <TimelineBlock
                title="آخر تحديثات الحالة"
                emptyTitle="لا توجد تحديثات حالة مسجلة بعد."
                items={dossier.statusHistory.slice(0, 5).map((item) => ({
                  id: item.id,
                  title: getStatusLabel(item.status),
                  subtitle: `بواسطة ${item.changedByName}`,
                  description: item.notes ?? undefined,
                  date: item.createdAt,
                }))}
              />

              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">حالة التدخلات</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {interventionGroups.length === 0 ? (
                    <p className="text-sm text-muted-foreground">لا توجد تدخلات مسجلة حتى الآن.</p>
                  ) : (
                    interventionGroups.map((group) => (
                      <div key={group.status} className="flex items-center justify-between rounded-md border border-border/40 p-2 text-sm">
                        <span>{group.status}</span>
                        <span className="font-bold">{group.count}</span>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="family" className="space-y-6">
          <CaseDetailSectionHeader
            title="الأسرة والبيانات"
            description="تفاصيل أفراد الأسرة المقيمين ضمن ملف الحالة."
          />

          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">بيانات الأسرة</CardTitle>
            </CardHeader>
            <CardContent>
              <CaseDetailMetadataGrid
                columns={3}
                items={[
                  { key: "name", label: "اسم الأسرة", value: dossier.household.name },
                  { key: "address", label: "العنوان", value: dossier.household.address ?? "غير محدد" },
                  {
                    key: "income",
                    label: "الدخل المسجل",
                    value: dossier.household.income != null ? `${dossier.household.income} ج.م` : "غير محدد",
                  },
                ]}
              />
            </CardContent>
          </Card>

          <div>
            <h4 className="mb-3 text-base font-bold text-foreground">أفراد الأسرة</h4>
            <HouseholdMemberTable members={dossier.household.members} />
          </div>
        </TabsContent>

        <TabsContent value="field-research" className="space-y-6">
          <CaseDetailSectionHeader
            title="البحث الميداني"
            description="الزيارات الميدانية والتقييمات المرتبطة بكل زيارة."
          />

          <TimelineBlock
            title="الزيارات الميدانية"
            emptyTitle="لا توجد زيارات ميدانية مسجلة للحالة حتى الآن."
            items={dossier.visits.map((visit) => ({
              id: visit.id,
              title: "زيارة ميدانية",
              subtitle: `عدد التقييمات: ${visit.assessments.length}`,
              description: visit.findings,
              date: visit.date,
            }))}
          />

          <TimelineBlock
            title="التقييمات (Need Assessments)"
            emptyTitle="لا توجد تقييمات احتياج مرتبطة بالزيارات الحالية."
            items={dossier.visits.flatMap((visit) =>
              visit.assessments.map((assessment) => ({
                id: assessment.id,
                title: assessment.needType,
                subtitle: assessment.score != null ? `درجة الشدة: ${assessment.score}` : "بدون درجة",
                description: assessment.details ?? undefined,
                date: assessment.createdAt,
              })),
            )}
          />
        </TabsContent>

        <TabsContent value="committee" className="space-y-6">
          <CaseDetailSectionHeader
            title="اللجنة والتنفيذ"
            description="قرارات اللجنة، التدخلات التنفيذية، ومتابعات ما بعد التنفيذ."
          />

          <TimelineBlock
            title="قرارات اللجنة"
            emptyTitle="لا توجد قرارات لجنة مسجلة حتى الآن."
            items={dossier.decisions.map((decision) => ({
              id: decision.id,
              title: decision.decision,
              subtitle: `بواسطة ${decision.reviewerName}${decision.amount != null ? ` • ${decision.amount} ج.م` : ""}`,
              description: decision.notes ?? undefined,
              date: decision.createdAt,
            }))}
          />

          <TimelineBlock
            title="التدخلات والتنفيذ"
            emptyTitle="لا توجد تدخلات تنفيذية مسجلة للحالة."
            items={dossier.interventions.map((intervention) => ({
              id: intervention.id,
              title: intervention.type,
              subtitle: `${intervention.status} • عدد التسليمات: ${intervention.deliveries.length}`,
              description: intervention.description ?? undefined,
              badge: intervention.cost != null ? `${intervention.cost} ج.م` : undefined,
              date: intervention.createdAt,
            }))}
          />

          <TimelineBlock
            title="المتابعات"
            emptyTitle="لا توجد متابعات مسجلة."
            items={dossier.followUps.map((followUp) => ({
              id: followUp.id,
              title: followUp.status,
              description: followUp.notes,
              date: followUp.date,
            }))}
          />
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <CaseDetailSectionHeader
            title="المستندات والملاحظات"
            description="أرشيف المرفقات والملاحظات التشغيلية المرتبطة بالحالة."
          />

          <TimelineBlock
            title="المستندات"
            emptyTitle="لا توجد مستندات مرفوعة لهذه الحالة."
            items={dossier.documents.map((document) => ({
              id: document.id,
              title: document.title,
              subtitle: `${document.fileType}${document.category ? ` • ${document.category}` : ""}`,
              description: document.fileUrl,
              date: document.createdAt,
            }))}
          />

          <TimelineBlock
            title="الملاحظات"
            emptyTitle="لا توجد ملاحظات مسجلة حتى الآن."
            items={dossier.notes.map((note) => ({
              id: note.id,
              title: "ملاحظة تشغيلية",
              description: note.content,
              date: note.createdAt,
            }))}
          />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <CaseDetailSectionHeader
            title="السجل الكامل للإجراءات"
            description="سجل حالة الحالة بالكامل مع المنفّذ والتوقيت والملاحظات."
          />

          <TimelineBlock
            title="سجل تغيّر الحالة"
            emptyTitle="لا يوجد سجل إجراءات متاح."
            items={dossier.statusHistory.map((item) => ({
              id: item.id,
              title: getStatusLabel(item.status),
              subtitle: `بواسطة ${item.changedByName}`,
              description: item.notes ?? undefined,
              date: item.createdAt,
            }))}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
