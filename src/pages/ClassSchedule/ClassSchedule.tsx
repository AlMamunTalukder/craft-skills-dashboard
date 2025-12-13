"use client";

import { useEffect, useState } from "react";
import TableHeader from "../Tables/TableHeader";

const ClassSchedule = () => {
  const [data, setData] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/class-schedule`);
      const json = await res.json();
      setData(json.data);
    };

    loadData();
  }, []);

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
          data={data}
          model="site"
          onStatusFilter={setStatusFilter}
        />

        <table className="w-full border">
          <thead className="bg-purple-700 text-white">
            <tr>
              <th>ক্লাস</th>
              <th>বার</th>
              <th>সময়</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item: any) => (
              <tr key={item._id} className="border-b">
                <td>{item.className}</td>
                <td>{item.days}</td>
                <td>{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-4 text-center text-sm">{data[0]?.holidays}</p>
      </div>
    </>
  );
};

export default ClassSchedule;
