 

import ClassScheduleForm from "@/components/Forms/ClassScheduleForm";
import FormHeader from "@/components/Forms/FormHeader";
import { useEffect, useState } from "react";

export interface ClassScheduleItem {
  _id?: string;
  id?: string;
  className: string;
  days: string;
  time: string;
  holidays?: string;
}

export default function UpdateClassSchedule() {
  const [data, setData] = useState<ClassScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/class-schedule`
        );
        const json = await res.json();
        setData(json.data || []);
      } catch (error) {
        console.error("Failed to load class schedule", error);
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <FormHeader
        href="/class-schedule"
        parent="Class Schedule"
        title="Class Schedule"
        editingId={data?.[0]?._id}
        // editingId={""}
        loading={loading}
      />

      <ClassScheduleForm initialValues={data} />
    </div>
  );
}
