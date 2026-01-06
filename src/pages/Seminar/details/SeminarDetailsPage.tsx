// src/pages/Seminar/list/details/page.tsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import DataTable from "@/components/DataTableComponents/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertCircle, 
  Calendar, 
  Clock, 
  Users, 
  Mail, 
  Phone, 
  MessageSquare, 
  ChevronLeft,
  Link as LinkIcon,
  Edit,
  ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { participantColumns } from "./columns";

// Define the Seminar type based on your schema
interface Seminar {
  _id: string;
  sl?: string;
  title: string;
  description?: string;
  date: string;
  registrationDeadline: string;
  isActive: boolean;
  link?: string;
  facebookSecretGroup?: string;
  whatsappSecretGroup?: string;
  messengerSecretGroup?: string;
  facebookPublicGroup?: string;
  whatsappPublicGroup?: string;
  telegramGroup?: string;
  participants?: any[];
  createdAt: string;
  updatedAt: string;
}

export default function SeminarDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [seminar, setSeminar] = useState<Seminar | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeminar = async () => {
      if (!id) {
        setError("No seminar ID provided");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/seminars/${id}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Seminar not found");
          }
          throw new Error(`Failed to fetch seminar: ${response.status}`);
        }

        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch seminar');
        }

        setSeminar(result.data);
      } catch (err: any) {
        console.error("Error fetching seminar:", err);
        setError(err.message || "Failed to load seminar");
        toast.error("Failed to load seminar details");
      } finally {
        setLoading(false);
      }
    };

    fetchSeminar();
  }, [id]);

  const handleDelete = async () => {
    if (!seminar || !id) return;
    
    if (!window.confirm(`Are you sure you want to delete "${seminar.title}"?`)) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/seminars/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to delete seminar");
      }

      toast.success("Seminar deleted successfully");
      navigate("/seminar/list");
    } catch (err: any) {
      console.error("Error deleting seminar:", err);
      toast.error(err.message || "Failed to delete seminar");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-gray-600">Loading seminar details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !seminar) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Seminar Not Found</h2>
            <p className="text-gray-600 mb-6">{error || "The seminar you're looking for doesn't exist."}</p>
            <Button asChild>
              <Link to="/seminar/list">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Seminars
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Format dates
  const seminarDate = seminar.date ? new Date(seminar.date) : null;
  const formattedDate = seminarDate ? format(seminarDate, "MMMM d, yyyy") : "";
  const formattedTime = seminarDate ? format(seminarDate, "h:mm a") : "";

  const registrationDeadline = seminar.registrationDeadline
    ? new Date(seminar.registrationDeadline)
    : null;
  const formattedDeadline = registrationDeadline
    ? format(registrationDeadline, "MMMM d, yyyy h:mm a")
    : "";

  const createdAt = seminar.createdAt
    ? format(new Date(seminar.createdAt), "MMMM d, yyyy")
    : "";
  const updatedAt = seminar.updatedAt
    ? format(new Date(seminar.updatedAt), "MMMM d, yyyy")
    : "";

  const participantCount = seminar.participants?.length || 0;

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header with actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <Button variant="outline" asChild className="w-fit">
          <Link to="/seminar/list">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Seminars
          </Link>
        </Button>
        
       
      </div>

     

      {/* Participants Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">{seminar.sl} Seninar Batch Participants Details</CardTitle>
              <p className="text-gray-600 mt-1">
                {participantCount} registered participant{participantCount !== 1 ? 's' : ''}
              </p>
            </div>
            
            
          </div>
        </CardHeader>
        
        <CardContent>
          {participantCount > 0 ? (
            <DataTable 
              data={seminar.participants || []} 
              columns={participantColumns} 
              searchable={true}
              searchPlaceholder="Search participants by name, email, or phone..."
            />
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Participants Yet</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                No one has registered for this seminar yet. Participants will appear here once they register.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}