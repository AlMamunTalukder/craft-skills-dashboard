"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // optional - if you use react-router
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import GlobalImageSelector from "@/components/common/GlobalImageSelector";
import { Loader2, Upload } from "lucide-react";

type SiteData = {
  _id?: string;
  name?: string;
  logoHeader?: string;
  logoFooter?: string;
  tagline?: string;
  address?: string;
  phone1?: string;
  phone2?: string;
  email?: string;
  facebook?: string;
  whatsapp?: string;
  youtube?: string;
  instagram?: string;
  homeBannerInfo?: {
    title?: string;
    subtitle?: string;
    description?: string;
    otherInfo?: string;
  };
  admissionBannerInfo?: {
    title?: string;
    subtitle?: string;
    description?: string;
    otherInfo?: string;
  };
  seminarHeaderTitle?: string;
  seminarHeaderDescription?: string;
  seminarDeadline?: string | Date;
  admissionHeaderTitle?: string;
  admissionHeaderDescription?: string;
  admissionDeadline?: string | Date;
};

type Props = {
  initialValues: SiteData;
  onSaved?: (updated: SiteData) => void;
};

export default function SiteContentForm({ initialValues, onSaved }: Props) {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate?.() as any;
  const [logoHeaderSelector, setLogoHeaderSelector] = useState(false);
  const [logoFooterSelector, setLogoFooterSelector] = useState(false);
  const [logoHeader, setLogoHeader] = useState<string>(initialValues.logoHeader || "");
  const [logoFooter, setLogoFooter] = useState<string>(initialValues.logoFooter || "");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, watch } = useForm<SiteData>({
    defaultValues: {
      ...initialValues,
      seminarDeadline: initialValues.seminarDeadline ? new Date(initialValues.seminarDeadline).toISOString().slice(0, 16) : undefined,
      admissionDeadline: initialValues.admissionDeadline ? new Date(initialValues.admissionDeadline).toISOString().slice(0, 16) : undefined,
    },
  });

  // keep logo paths in sync with form values
  React.useEffect(() => {
    setValue("logoHeader", logoHeader);
  }, [logoHeader, setValue]);
  React.useEffect(() => {
    setValue("logoFooter", logoFooter);
  }, [logoFooter, setValue]);

  const onSubmit = async (formData: SiteData) => {
    setLoading(true);
    try {
      // Convert datetime-local back to ISO if present
      const payload: any = {
        ...formData,
        logoHeader: logoHeader,
        logoFooter: logoFooter,
      };

      if (payload.seminarDeadline) payload.seminarDeadline = new Date(String(payload.seminarDeadline)).toISOString();
      if (payload.admissionDeadline) payload.admissionDeadline = new Date(String(payload.admissionDeadline)).toISOString();

      // PUT to /site (single resource)
      const res = await fetch(`${API}/site`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to update site");
      }

      const json = await res.json();
      const updated = json?.data ?? json;
      toast.success("Site content updated");
      if (onSaved) onSaved(updated);

      // optional: navigate back to listing
      // if (navigate) navigate("/dashboard/content/site-content");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Brand & Company Information</CardTitle>
          <CardDescription>Update your site content and contact information</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic */}
            <div>
              <label className="block text-sm font-medium mb-1">Site Name</label>
              <input {...register("name")} className="input w-full" placeholder="Craft Skills" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tagline</label>
                <input {...register("tagline")} className="input w-full" placeholder="Tagline" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input {...register("address")} className="input w-full" placeholder="Address" />
              </div>
            </div>

            <Separator />

            {/* Contact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input {...register("email")} className="input w-full" placeholder="email@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone 1</label>
                <input {...register("phone1")} className="input w-full" placeholder="+8801..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone 2</label>
                <input {...register("phone2")} className="input w-full" placeholder="+8801..." />
              </div>
            </div>

            <Separator />

            {/* Social */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Facebook</label>
                <input {...register("facebook")} className="input w-full" placeholder="https://facebook.com/..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">WhatsApp</label>
                <input {...register("whatsapp")} className="input w-full" placeholder="https://wa.me/..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">YouTube</label>
                <input {...register("youtube")} className="input w-full" placeholder="https://youtube.com/..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Instagram</label>
                <input {...register("instagram")} className="input w-full" placeholder="https://instagram.com/..." />
              </div>
            </div>

            <Separator />

            {/* Banner sections */}
            <div>
              <h4 className="font-medium mb-2">Home Banner</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input {...register("homeBannerInfo.title")} placeholder="Title" className="input w-full" />
                <input {...register("homeBannerInfo.subtitle")} placeholder="Subtitle" className="input w-full" />
                <input {...register("homeBannerInfo.description")} placeholder="Description" className="input w-full" />
                <input {...register("homeBannerInfo.otherInfo")} placeholder="Other info" className="input w-full" />
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">Admission Banner</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input {...register("admissionBannerInfo.title")} placeholder="Title" className="input w-full" />
                <input {...register("admissionBannerInfo.subtitle")} placeholder="Subtitle" className="input w-full" />
                <input {...register("admissionBannerInfo.description")} placeholder="Description" className="input w-full" />
                <input {...register("admissionBannerInfo.otherInfo")} placeholder="Other info" className="input w-full" />
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">Seminar & Admission Headers / Deadlines</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input {...register("seminarHeaderTitle")} placeholder="Seminar Header Title" className="input w-full" />
                <input {...register("admissionHeaderTitle")} placeholder="Admission Header Title" className="input w-full" />
                <input {...register("seminarHeaderDescription")} placeholder="Seminar Header Description" className="input w-full" />
                <input {...register("admissionHeaderDescription")} placeholder="Admission Header Description" className="input w-full" />
                <div>
                  <label className="block text-sm font-medium mb-1">Seminar Deadline</label>
                  <input type="datetime-local" {...register("seminarDeadline")} className="input w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Admission Deadline</label>
                  <input type="datetime-local" {...register("admissionDeadline")} className="input w-full" />
                </div>
              </div>
            </div>

            <Separator />

            {/* Logos via GlobalImageSelector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Logo Header</label>
                <div className="flex gap-3 items-center">
                  <div className="w-36 h-20 border rounded flex items-center justify-center bg-white">
                    {logoHeader ? <img src={logoHeader} alt="logoHeader" className="max-h-16 object-contain" /> : <div className="text-sm text-gray-500">No logo</div>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" onClick={() => setLogoHeaderSelector(true)}><Upload className="mr-2 w-4 h-4" />Select</Button>
                    <Button variant="ghost" size="sm" onClick={() => setLogoHeader("")}>Remove</Button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Logo Footer</label>
                <div className="flex gap-3 items-center">
                  <div className="w-36 h-20 border rounded flex items-center justify-center bg-white">
                    {logoFooter ? <img src={logoFooter} alt="logoFooter" className="max-h-16 object-contain" /> : <div className="text-sm text-gray-500">No logo</div>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" onClick={() => setLogoFooterSelector(true)}><Upload className="mr-2 w-4 h-4" />Select</Button>
                    <Button variant="ghost" size="sm" onClick={() => setLogoFooter("")}>Remove</Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" className="px-6" disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                Save Site Content
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Global image pickers */}
      <GlobalImageSelector
        open={logoHeaderSelector}
        onClose={() => setLogoHeaderSelector(false)}
        selectedImage={logoHeader}
        setSelectedImage={(url) => setLogoHeader(url)}
        mode="single"
      />

      <GlobalImageSelector
        open={logoFooterSelector}
        onClose={() => setLogoFooterSelector(false)}
        selectedImage={logoFooter}
        setSelectedImage={(url) => setLogoFooter(url)}
        mode="single"
      />
    </>
  );
}
