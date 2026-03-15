import { prisma } from "@/lib/db";
import { requireRole, parseBranchSettings, RoleGroups } from "@/lib/auth-utils";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const session = await requireRole(RoleGroups.ADMINS);

  const branch = await prisma.branch.findUnique({
    where: { id: session.user.branchId || "branch-bns-01" },
  });

  if (!branch) {
    return <div>لم يتم العثور على إعدادات الفرع</div>;
  }

  const settings = parseBranchSettings(branch.settings);

  return (
    <SettingsForm
      branch={{
        nameArabic: branch.nameArabic,
        nameEnglish: branch.nameEnglish ?? "",
      }}
      settings={{
        address: settings.address ?? "",
        phones: settings.phones ?? [],
        donationChannels: settings.donationChannels ?? [],
      }}
    />
  );
}
