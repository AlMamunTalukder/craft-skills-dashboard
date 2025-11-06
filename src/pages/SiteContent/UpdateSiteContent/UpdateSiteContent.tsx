"use client";

import FormHeader from "@/components/Forms/FormHeader";
import SiteContentForm from "@/components/Forms/SiteContentForm";
import { useEffect, useState } from "react";

export default function UpdateSiteContent() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/site`);
        const json = await res.json();
        setData(json?.data);
      } catch (error) {
        console.error("Failed to load site data:", error);
      }
    };

    loadData();
  }, []);

  if (!data) {
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  }

  return (
    <>
      <FormHeader
        href="/dashboard/content/site-content"
        parent=""
        title="Site Content"
        editingId={data.id}
      />

      {/* Pass data into the form so logos + all fields show + update correctly */}
      <SiteContentForm initialValues={data} />
    </>
  );
}
