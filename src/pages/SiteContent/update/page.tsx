import FormHeader from "@/components/Forms/FormHeader";
import SiteContentForm from "@/components/Forms/SiteContentForm";
import { useEffect, useState } from "react";



export default async function UpdateSiteContentPage() {
const [data, setData] = useState<any>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    const filteredData = statusFilter
        ? data.filter((item: any) => String(item.status) === statusFilter)
        : data;

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

  if (!data) {
    return <div className="text-center mt-10 text-gray-500">No data found</div>;
  }

  return (
    <>
      <FormHeader
        href="/content/site-content"
        parent=""
        title="Site Content"
        editingId={data.id}
      />
      {/* <SiteContentForm initialValues={data} /> */}
    </>
  );
}
