 

import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ClassScheduleItem {
  _id?: string;
  className: string;
  days: string;
  time: string;
  holidays?: string;
}

interface Props {
  initialValues: ClassScheduleItem[];
}

export default function ClassScheduleForm({ initialValues }: Props) {
  const [schedule, setSchedule] =
    useState<ClassScheduleItem[]>(initialValues);
  const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

  const handleChange = (
    index: number,
    field: keyof ClassScheduleItem,
    value: string
  ) => {
    const updated = [...schedule];
    updated[index] = { ...updated[index], [field]: value };
    setSchedule(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/class-schedule`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(schedule),
        }
      );

        if (res.ok) {
        const result = await res.json();
        toast.success("Banner content updated successfully.");
        setTimeout(() => {
          navigate("/class-schedule");
        }, 1000);
      } else {
        const errorData = await res.json();
        throw new Error('Failed to update banner content');
      }
    } catch {
      toast.error("Failed to update class schedule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {schedule.map((item, index) => (
        <Card key={item._id || index}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <CardTitle>{item.className || "Class Schedule"}</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Class Name</Label>
              <Input
                value={item.className}
                onChange={(e) =>
                  handleChange(index, "className", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Days
              </Label>
              <Input
                value={item.days}
                onChange={(e) =>
                  handleChange(index, "days", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> Time
              </Label>
              <Input
                value={item.time}
                onChange={(e) =>
                  handleChange(index, "time", e.target.value)
                }
              />
            </div>

            {index === 0 && (
              <div className="space-y-2 md:col-span-2">
                <Label>Holidays</Label>
                <Input
                  value={item.holidays || ""}
                  onChange={(e) =>
                    handleChange(index, "holidays", e.target.value)
                  }
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={loading} size="lg">
          {loading ? "Updating..." : "Update Class Schedule"}
        </Button>
      </div>
    </form>
  );
}
