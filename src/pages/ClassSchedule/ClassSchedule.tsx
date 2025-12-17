 

import { useEffect, useState } from "react";
import TableTopBar from "../Tables/TableTopBar";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
        <TableTopBar
          title="Class Schedule"
          href="/class-schedule/update"
          linkTitle="Update Class Schedule"
          data={data}
          model="site"
          onStatusFilter={setStatusFilter}
        />

        <div className="w-full border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-purple-700 text-white text-center">
                <TableHead className="pl-4 text-white font-bold">Class</TableHead>
                <TableHead className="text-white font-bold">Day</TableHead>
                <TableHead className="text-white font-bold">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item: any) => (
                <TableRow key={item.id} className="odd:bg-muted/50">
                  <TableCell className="font-medium">
                    {item.className}
                  </TableCell>
                  <TableCell>{item.days}</TableCell>
                  <TableCell>{item.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="mt-4 text-center text-sm">{data[0]?.holidays}</p>
      </div>
    </>
  );
};

export default ClassSchedule;
