import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Loader2, ArrowLeft, UserPlus } from "lucide-react";
import AddStudentForm from "@/components/Forms/AddStudentForm";

export default function AddStudentPage() {
  const navigate = useNavigate();
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

  const handleSubmitSuccess = () => {
    toast.success("Student added successfully!");
    navigate("/dashboard/students");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/dashboard/students")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Students
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Add New Student
            </h1>
            <p className="text-muted-foreground">
              Manually register a student to any course batch
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Student Registration Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AddStudentForm
            courses={courses}
            batches={batches}
            onSuccess={handleSubmitSuccess}
          />
        </CardContent>
      </Card>
    </div>
  );
}