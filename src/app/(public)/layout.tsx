import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { Heart, Menu } from "lucide-react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2 space-x-reverse font-bold text-2xl text-primary transition-transform hover:scale-105">
              <Heart className="h-7 w-7 fill-primary/20" />
              <span>صناع الحياة <span className="text-foreground/80 font-medium text-lg hidden sm:inline-block">- بني سويف</span></span>
            </Link>
            <nav className="hidden md:flex gap-8">
              <Link href="/about" className="text-base font-medium text-foreground/70 transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform hover:after:origin-bottom-left hover:after:scale-x-100 pb-1">عن الجمعية</Link>
              <Link href="/our-programs" className="text-base font-medium text-foreground/70 transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform hover:after:origin-bottom-left hover:after:scale-x-100 pb-1">برامجنا</Link>
              <Link href="/news" className="text-base font-medium text-foreground/70 transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform hover:after:origin-bottom-left hover:after:scale-x-100 pb-1">الأخبار</Link>
              <Link href="/contact" className="text-base font-medium text-foreground/70 transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform hover:after:origin-bottom-left hover:after:scale-x-100 pb-1">تواصل معنا</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/volunteer" className={cn(buttonVariants({ variant: "outline" }), "hidden md:flex rounded-full px-6 font-semibold shadow-sm hover:shadow-md transition-all")}>تطوع معنا</Link>
            <Link href="/donate" className={cn(buttonVariants(), "hidden md:flex rounded-full px-6 font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all bg-gradient-to-r from-primary to-primary/80")}>تبرع الآن</Link>
            <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden md:flex text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full")}>دخول الموظفين</Link>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-muted">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0 px-4">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Heart className="h-5 w-5" />
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              جميع الحقوق محفوظة &copy; {new Date().getFullYear()} مؤسسة صناع الحياة مصر - فرع بني سويف.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
