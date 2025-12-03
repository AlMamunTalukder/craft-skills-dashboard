"use client";

import BannerForm from "@/components/Forms/BannerForm";
import FormHeader from "@/components/Forms/FormHeader";
import { useEffect, useState } from "react";

// Define interfaces
interface BannerInfo {
  title: string;
  subtitle: string;
  description: string;
  otherInfo: string;
}

interface SiteData {
  _id?: string;
  id?: string;
  tagline: string;
  email: string;
  phone1: string;
  phone2?: string;
  address: string;
  facebook?: string;
  facebookGroup?: string;
  whatsapp?: string;
  youtube?: string;
  telegram?: string;
  logoLight: string;
  logoDark: string;
  totalsTeachers?: number;
  totalCourses?: number;
  totalBatches?: number;
  successRate?: number;
  homeBannerInfo?: BannerInfo;
  admissionBannerInfo?: BannerInfo;
  seminarDeadline?: string;
  admissionDeadline?: string;
  seminarHeaderTitle?: string;
  seminarHeaderDescription?: string;
  admissionHeaderTitle?: string;
  admissionHeaderDescription?: string;
}

export default function UpdateBanner() {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/site`);
        const json = await res.json();
        setData(json?.data);
      } catch (error) {
        console.error("Failed to load site data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  }

  if (!data) {
    return <div className="text-center mt-10 text-gray-500">No data found</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <FormHeader
        href="/banner"
        parent="Banner"
        title="Update Banner"
        editingId={data._id || data.id}
        loading={loading}
      />
      <BannerForm initialValues={data} />
    </div>
  );
}