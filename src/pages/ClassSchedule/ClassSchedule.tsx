"use client";


import { useEffect, useState } from "react";
import TableHeader from "../Tables/TableHeader";

const ClassSchedule = () => {
  const [data, setData] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const res = await fetch(`${import.meta.env.VITE_API_URL}/site`);
//         const json = await res.json();
//         setData(json?.data);
//       } catch (error) {
//         console.error("Failed to load site data:", error);
//       }
//     };

//     loadData();
//   }, []);

  if (!data) {
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  }
  return (
    <>
      <div className="py-10 space-y-8">
        {/* Page header */}
        <TableHeader
          title="Class Schedule"
          href="/class-schedule/update"
          linkTitle="Update Class Schedule"
        //   data={data}
          data={""}
          model="site"
          onStatusFilter={setStatusFilter}
        />
      </div>
    </>
  );
};

export default ClassSchedule;
