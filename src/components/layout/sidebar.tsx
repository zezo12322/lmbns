"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  FileText, 
  HeartHandshake, 
  GraduationCap, 
  Briefcase, 
  FolderKey, 
  LogOut,
  FolderOpen,
  Search,
  AlertTriangle,
  Clock3,
  ShieldAlert
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { title: "لوحة التحكم", href: "/dashboard", icon: LayoutDashboard },
  { title: "مركز الحالات", href: "/cases", icon: FolderOpen },
  { title: "بحث بالرقم القومي", href: "/cases/search/national-id", icon: Search },
  { title: "بحث متقدم", href: "/cases/search/advanced", icon: Search },
  { title: "كل الحالات الجديدة", href: "/cases/queues/new", icon: FileText },
  { title: "تحت المراجعة", href: "/cases/queues/under-review", icon: Clock3 },
  { title: "بانتظار المدير", href: "/cases/queues/waiting-manager", icon: ShieldAlert },
  { title: "الحالات العاجلة", href: "/cases/queues/urgent", icon: AlertTriangle },
  { title: "أخطاء الرقم القومي", href: "/cases/errors/missing-national-id", icon: AlertTriangle },
  { title: "طلبات المساعدة", href: "/intake", icon: FileText },
  { title: "الأسر والمسجلين", href: "/households", icon: Users },
  { title: "المتطوعين", href: "/volunteers", icon: HeartHandshake },
  { title: "البرامج والمشاريع", href: "/programs", icon: Briefcase },
  { title: "التدريب والفعاليات", href: "/trainings", icon: GraduationCap },
  { title: "المحتوى والأخبار", href: "/cms", icon: FolderKey },
  { title: "الإعدادات", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed right-0 top-0 z-40 h-screen w-64 border-l border-border/40 bg-background/95 backdrop-blur-xl shadow-xl transition-transform sm:translate-x-0">
      <div className="flex h-full flex-col overflow-y-auto px-4 py-6">
        <div className="mb-8 px-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-inner">
            <HeartHandshake className="h-6 w-6 text-primary-foreground" />
          </div>
          <Link href="/" className="font-bold text-lg text-foreground hover:text-primary transition-colors">
            صناع الحياة
          </Link>
        </div>
        
        <ul className="space-y-2 font-medium">
          {navItems.map((item) => {
            const isActive = item.href === "/cases" ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                    isActive 
                      ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary shadow-sm border border-primary/20" 
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:translate-x-1"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 transition-colors", 
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto px-2 pt-6 border-t border-border/40">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-destructive hover:bg-destructive/10 transition-all duration-200 hover:translate-x-1"
          >
            <LogOut className="h-5 w-5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
