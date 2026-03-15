"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, Loader2, CheckCircle2 } from "lucide-react";

interface SettingsFormProps {
  branch: {
    nameArabic: string;
    nameEnglish: string;
  };
  settings: {
    address: string;
    phones: string[];
    donationChannels: string[];
  };
}

export function SettingsForm({ branch, settings }: SettingsFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [nameArabic, setNameArabic] = useState(branch.nameArabic);
  const [nameEnglish, setNameEnglish] = useState(branch.nameEnglish);
  const [address, setAddress] = useState(settings.address);
  const [phones, setPhones] = useState(settings.phones.join("\n"));
  const [donationChannels, setDonationChannels] = useState(
    settings.donationChannels.join("\n")
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameArabic,
          nameEnglish,
          address,
          phones: phones
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
          donationChannels: donationChannels
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        alert(json.error || "حدث خطأ أثناء حفظ الإعدادات.");
        return;
      }

      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("حدث خطأ في الاتصال بالخادم.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-2">
            إعدادات الفرع والنظام
          </h1>
          <p className="text-lg text-muted-foreground">
            تحديث بيانات الفرع، وسيلة التواصل، وصلاحيات الإدارة وعرضها على
            الموقع.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle className="text-2xl">البيانات العامة للفرع</CardTitle>
            <CardDescription className="text-base mt-2">
              هذه البيانات تظهر في الموقع للمتطوعين والمستفيدين والمتبرعين.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nameArabic">الاسم (عربي)</Label>
                <Input
                  id="nameArabic"
                  value={nameArabic}
                  onChange={(e) => setNameArabic(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameEnglish">الاسم (إنجليزي)</Label>
                <Input
                  id="nameEnglish"
                  value={nameEnglish}
                  onChange={(e) => setNameEnglish(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">العنوان</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phones">أرقام الهواتف المعتمدة</Label>
                <Textarea
                  id="phones"
                  value={phones}
                  onChange={(e) => setPhones(e.target.value)}
                  dir="ltr"
                  className="text-right"
                  placeholder="رقم واحد في كل سطر"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="channels">قنوات التبرع</Label>
                <Textarea
                  id="channels"
                  value={donationChannels}
                  onChange={(e) => setDonationChannels(e.target.value)}
                  placeholder="قناة واحدة في كل سطر"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/10 pt-4 pb-4">
            <Button
              type="submit"
              className="w-full sm:w-auto mt-2 gap-2"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  تم الحفظ
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  حفظ التغييرات
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>

      <Card className="border-border/50 shadow-sm opacity-70">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle className="text-2xl">إدارة المحتوى (CMS)</CardTitle>
          <CardDescription className="text-base mt-2">
            تم نقل إدارة المحتوى إلى قسم مخصص في القائمة الجانبية.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
