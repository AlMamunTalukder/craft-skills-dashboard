 

import FormHeader from "@/components/Forms/FormHeader";
import SiteContentForm from "@/components/Forms/SiteContentForm";
import { useEffect, useState } from "react";

// Define the interface for the site data
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
}

export default function UpdateSiteContentPage() {
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
        href="/site-content"
        parent="Site Content"
        title="Site Content"
        editingId={data._id || data.id}
        loading={loading}
      />
      <SiteContentForm initialValues={data} />
    </div>
  );
}