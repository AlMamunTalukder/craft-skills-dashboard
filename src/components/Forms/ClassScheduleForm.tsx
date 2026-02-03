import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, BookOpen, Hash } from "lucide-react";
import { useNavigate } from "react-router-dom";


const CLASS_TYPES = [
  { id: 1, label: "মেইন ক্লাস", placeholder: "শুক্র ও সোমবার" },
  { id: 2, label: "প্রব্লেম সলভিং", placeholder: "শনি ও মঙ্গলবার" },
  { id: 3, label: "প্রাক্টিস", placeholder: "রবি ও বুধবার" },
  { id: 4, label: "প্রেজেন্টেশন রিভিউ", placeholder: "মঙ্গলবার" },
  
];

type ClassItem = {
  id: number;
  className: string;
  days: string;
  time: string;
};

type CompleteSchedule = {
  _id?: string;
  weekNumber: number;
  holidays: string;
  schedules: ClassItem[];
};

interface Props {
  initialData?: CompleteSchedule;
  mode?: 'create' | 'update';
}

export default function ClassScheduleForm({ 
  initialData,
  mode = 'update'
}: Props) {
  const [weekNumber, setWeekNumber] = useState<number>(1);
  const [holidays, setHolidays] = useState<string>("");
  
  // Initialize with 13 empty classes
  const [schedules, setSchedules] = useState<ClassItem[]>(
    CLASS_TYPES.map(cls => ({
      id: cls.id,
      className: cls.label,
      days: "",
      time: "",
    }))
  );
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (initialData) {
      setWeekNumber(initialData.weekNumber || 1);
      setHolidays(initialData.holidays || "");
      
      if (initialData.schedules && initialData.schedules.length > 0) {
        // Merge existing data with our 13-class structure
        const mergedSchedules = CLASS_TYPES.map(cls => {
          const existing = initialData.schedules.find(s => 
            s.className.includes(cls.label.split(" ")[0]) || 
            s.id === cls.id
          );
          return {
            id: cls.id,
            className: existing?.className || cls.label,
            days: existing?.days || "",
            time: existing?.time || "",
          };
        });
        setSchedules(mergedSchedules);
      }
    }
  }, [initialData]);

  const handleScheduleChange = (index: number, field: keyof ClassItem, value: string) => {
    const updated = [...schedules];
    updated[index] = { ...updated[index], [field]: value };
    setSchedules(updated);
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const scheduleData = {
      weekNumber,
      holidays,
      schedules: schedules.filter(s => s.days.trim() && s.time.trim()),
    };

    let url = `${import.meta.env.VITE_API_URL}/class-schedule`;
    let method = "PUT";

    // If we have an ID and we're in update mode, use the specific endpoint
    if (mode === 'update' && initialData?._id) {
      url = `${import.meta.env.VITE_API_URL}/class-schedule/${initialData._id}`;
      method = "PUT";
    } else if (mode === 'create') {
      method = "POST";
    }

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(scheduleData),
    });

    if (res.ok) {
      toast.success(mode === 'create' ? "Schedule created!" : "Schedule updated!");
      navigate("/class-schedule");
    } else {
      const errorData = await res.json();
      throw new Error(errorData.message);
    }
  } catch (error: any) {
    toast.error(error.message || "Failed to save schedule");
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Week Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5" />
            <CardTitle>Week {weekNumber} Schedule</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Week Number</Label>
            <Input
              type="number"
              value={weekNumber}
              onChange={(e) => setWeekNumber(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Holidays</Label>
            <Input
              value={holidays}
              onChange={(e) => setHolidays(e.target.value)}
              placeholder="সাপ্তাহিক ছুটিঃ বৃহস্পতিবার"
            />
          </div>
        </CardContent>
      </Card>

      {/* 13 Classes Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            <CardTitle>Weekly Classes</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schedules.map((item, index) => (
              <div key={item.id} className="space-y-3 p-4 border rounded-lg">
                <Label className="font-semibold">{item.className}</Label>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <Input
                      value={item.days}
                      onChange={(e) => handleScheduleChange(index, "days", e.target.value)}
                      placeholder={CLASS_TYPES[index]?.placeholder || "Days"}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <Input
                      value={item.time}
                      onChange={(e) => handleScheduleChange(index, "time", e.target.value)}
                      placeholder="Time"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/class-schedule")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : mode === 'create' ? "Create Schedule" : "Update Schedule"}
        </Button>
      </div>
    </form>
  );
}