import Link from "next/link";
import { Search, AlertTriangle, LayoutList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

const iconMap = {
  search: Search,
  error: AlertTriangle,
  list: LayoutList,
};

export function DashboardQuickLinks({
  links,
}: {
  links: Array<{ title: string; href: string; icon?: keyof typeof iconMap }>;
}) {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">اختصارات العمل</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        {links.map((link) => {
          const Icon = link.icon ? iconMap[link.icon] : LayoutList;
          return (
            <Link key={link.href} href={link.href} className={cn(buttonVariants({ variant: "outline" }), "gap-2") }>
              <Icon className="h-4 w-4" />
              {link.title}
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
