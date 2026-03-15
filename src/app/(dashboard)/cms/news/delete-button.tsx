"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

export function DeleteNewsButton({ id }: { id: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("هل أنت متأكد من حذف هذا الخبر نهائياً؟")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/cms/news/${id}`, { method: "DELETE" });
      if (!res.ok) {
        alert("حدث خطأ أثناء حذف الخبر.");
        return;
      }
      router.refresh();
    } catch {
      alert("حدث خطأ في الاتصال بالخادم.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon" }),
        "text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8",
        isDeleting && "opacity-50 cursor-not-allowed"
      )}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
