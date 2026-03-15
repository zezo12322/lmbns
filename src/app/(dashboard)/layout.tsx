import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="sm:mr-64 flex flex-col flex-1 min-h-screen">
        <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background px-4 sm:px-6">
          <div className="flex items-center gap-4 mr-auto font-medium">
            مرحباً، {session.user?.name || session.user?.email}
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {session.user?.role}
            </span>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
