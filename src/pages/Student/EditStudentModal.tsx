// src/pages/Student/EditStudentPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import StudentForm, { type StudentFormData } from "@/components/Forms/StudentForm";

export default function EditStudentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        toast.error("Student ID is required");
        navigate("/dashboard/students");
        return;
      }

      try {
        setLoading(true);
        
        // Fetch student data
        const studentResponse = await fetch(`${import.meta.env.VITE_API_URL}/admissions/${id}`, {
          credentials: "include",
        });
        const studentResult = await studentResponse.json();
        
        if (!studentResponse.ok || !studentResult.success) {
          throw new Error(studentResult.message || "Failed to load student data");
        }
        
        setStudent(studentResult.data);

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
        navigate("/dashboard/students");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Student Not Found</h2>
          <p className="text-gray-600 mb-6">
            The student you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/dashboard/students")}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Back to Students
          </button>
        </div>
      </div>
    );
  }

  // Format initial data
  const initialData: StudentFormData & { _id?: string } = {
    _id: student._id,
    name: student.name || "",
    email: student.email || "",
    phone: student.phone || "",
    whatsapp: student.whatsapp || "",
    facebook: student.facebook || "",
    occupation: student.occupation || "",
    address: student.address || "",
    courseId: student.courseId?._id || student.courseId || "",
    batchId: student.batchId?._id || student.batchId || "",
    paymentMethod: student.paymentMethod || "",
    senderNumber: student.senderNumber || "",
    couponCode: student.couponCode || "",
    amount: student.amount || 0,
    discountAmount: student.discountAmount || 0,
    status: student.status || "pending",
    paymentStatus: student.paymentStatus || "pending",
    result: student.result || "pending",
    notes: student.notes || "",
  };

  return (
    <StudentForm
      courses={courses}
      batches={batches}
      initialData={initialData}
      isEdit={true}
      backLink="/dashboard/students"
    />
  );
}