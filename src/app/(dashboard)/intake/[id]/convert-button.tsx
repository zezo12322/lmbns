"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ConvertToCaseButton({ requestId, payload }: { requestId: string, payload: any }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleConvert() {
    if (!confirm("هل أنت متأكد من تحويل هذا الطلب إلى حالة جديدة وفتح سجل أسرة؟")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/intake/${requestId}/convert`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to convert");
      router.refresh();
      router.push("/cases");
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء تحويل الطلب.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleConvert} disabled={loading}>
      {loading ? "جاري التحويل..." : "قبول كحالة جديدة"}
    </Button>
  );
}
