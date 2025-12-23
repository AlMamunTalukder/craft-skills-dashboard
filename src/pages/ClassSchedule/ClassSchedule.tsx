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
import { Skeleton } from "@/components/ui/skeleton";

const ClassSchedule = () => {
  const [data, setData] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  console.log(statusFilter);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/class-schedule`);
      const json = await res.json();
      setData(json.data);
    };

    loadData();
  }, []);

  if (!data) {
    return <div className="text-center mt-10 text-gray-500"><Skeleton/></div>;
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

        <div className="w-full border rounded-md overflow-hidden text-center">
          <Table>
            <TableHeader>
              <TableRow className=" text-white ">
                <TableHead className="pl-4 text-white font-bold text-center">
                  SL. No.
                </TableHead>
                <TableHead className="pl-4 text-white font-bold text-center">
                  Class
                </TableHead>
                <TableHead className="text-white font-bold text-center">Day</TableHead>
                <TableHead className="text-white font-bold text-center">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item: any, index:any) => (
                <TableRow key={item.id} className="odd:bg-muted/50">
                  <TableCell className="font-medium">
                    {index+1}
                  </TableCell>
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
