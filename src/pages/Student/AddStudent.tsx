// src/pages/Student/AddStudentPage.tsx
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import StudentForm from "@/components/Forms/StudentForm";

export default function AddStudentPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch courses
        const coursesResponse = await fetch(`${import.meta.env.VITE_API_URL}/courses`, {
          credentials: "include",
        });
        const coursesResult = await coursesResponse.json();
        
        if (coursesResult.success && Array.isArray(coursesResult.data)) {
          setCourses(coursesResult.data.map((course: any) => ({
            id: course._id,
            name: course.name,
            price: course.price,
            discount: course.discount || 0,
            paymentCharge: course.paymentCharge || 0,
            description: course.description || "",
          })));
        }

        // Fetch batches
        const batchesResponse = await fetch(`${import.meta.env.VITE_API_URL}/course-batches`, {
          credentials: "include",
        });
        const batchesResult = await batchesResponse.json();
        
        if (batchesResult.success && Array.isArray(batchesResult.data)) {
          setBatches(batchesResult.data.map((batch: any) => ({
            id: batch._id,
            name: batch.name,
            code: batch.code,
            isActive: batch.isActive,
          })));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <StudentForm
      courses={courses}
      batches={batches}
      isEdit={false}
      backLink="/dashboard/students"
    />
  );
}