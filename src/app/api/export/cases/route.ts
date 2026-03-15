import { prisma } from "@/lib/db";
import { requireRoleApi, RoleGroups } from "@/lib/auth-utils";
import { NextResponse } from "next/server";
import { log } from "@/lib/logger";

const ROUTE = "/api/export/cases";

export async function GET(req: Request) {
  const authResult = await requireRoleApi(RoleGroups.EXPORT_ALLOWED);
  if (authResult.error) return authResult.error;
  const userId = authResult.session.user.id;

  try {
    const cases = await prisma.case.findMany({
      include: {
        household: {
          include: {
            members: {
              include: {
                person: true,
              }
            },
          }
        },
        intakeRequest: true,
        village: {
          include: {
            center: true,
          }
        },
        interventions: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Simple JSON to CSV converter for the MVP
    const generateCsv = (data: any[]) => {
      if (data.length === 0) return "";
      
      const columns = [
        "Case Number",
        "Primary Contact Name",
        "Primary Contact Phone",
        "Case Type",
        "Priority",
        "Status",
        "Household Size",
        "Village",
        "Center",
        "Address",
        "Total Interventions Cost",
        "Created At",
      ];
      
      const rows = data.map((c) => {
        const primaryMember = c.household?.members.find((m: any) => m.isPrimary)?.person;
        const fallbackPhone = c.intakeRequest?.phone || "N/A";
        const contactName = primaryMember ? `${primaryMember.firstName} ${primaryMember.lastName}` : c.household?.name || "N/A";
        const contactPhone = primaryMember?.phone || fallbackPhone;
        const totalCost = c.interventions.reduce((sum: number, intv: any) => sum + (intv.cost || 0), 0);
        const village = c.village?.name || "N/A";
        const center = c.village?.center?.name || "N/A";
        const address = c.household?.address || "N/A";
        
        return [
           c.caseNumber,
           `"${contactName}"`,
           `"${contactPhone}"`,
           c.caseType,
           c.priority,
           c.status,
           c.household?.members.length || 0,
           `"${village}"`,
           `"${center}"`,
           `"${address.split('\n')[0]}"`,
           totalCost,
           new Date(c.createdAt).toISOString(),
        ].join(",");
      });

      return [columns.join(","), ...rows].join("\n");
    };

    const csvData = generateCsv(cases);

    log.info("export.cases.completed", { route: ROUTE, userId, rowCount: cases.length });

    return new Response(csvData, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="cases_export.csv"',
      },
    });
    
  } catch (error) {
    log.error("export.cases.failed", { route: ROUTE, userId, error });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
