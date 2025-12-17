 

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { 
  Globe, 
  PanelTop, 
  Tag,
  Clock,
} from "lucide-react";

interface BannerInfo {
  title: string;
  subtitle: string;
  description: string;
  otherInfo: string;
}

interface SiteData {
  _id?: string;
  id?: string;
  tagline: string;
  email: string;
  phone1: string;
  phone2?: string;
  address: string;
  facebook?: string;
  facebookGroup?: string;
  whatsapp?: string;
  youtube?: string;
  telegram?: string;
  totalsTeachers?: number;
  totalCourses?: number;
  totalBatches?: number;
  successRate?: number;
  homeBannerInfo?: BannerInfo;
  admissionBannerInfo?: BannerInfo;
  seminarDeadline?: string;
  admissionDeadline?: string;
  seminarHeaderTitle?: string;
  seminarHeaderDescription?: string;
  admissionHeaderTitle?: string;
  admissionHeaderDescription?: string;
}

interface Props {
  initialValues: SiteData;
}

export default function BannerForm({ initialValues }: Props) {
  const [formData, setFormData] = useState<SiteData>(initialValues);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/site`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const result = await response.json();
        toast.success("Banner content updated successfully.");
        setTimeout(() => {
          navigate("/banner");
        }, 1000);
      } else {
        const errorData = await response.json();
        throw new Error('Failed to update banner content');
      }
    } catch (error) {
      console.error('Error updating banner content:', error);
      toast.error(error instanceof Error ? error.message : "Failed to update banner content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Check if the field is nested within banner info objects
    if (name.startsWith('homeBannerInfo.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        homeBannerInfo: {
          ...(prev.homeBannerInfo || { title: '', subtitle: '', description: '', otherInfo: '' }),
          [field]: value
        }
      }));
    } else if (name.startsWith('admissionBannerInfo.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        admissionBannerInfo: {
          ...(prev.admissionBannerInfo || { title: '', subtitle: '', description: '', otherInfo: '' }),
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value ? new Date(value).toISOString() : "",
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Banner Management</h1>
          <p className="text-muted-foreground">
            Update seminar and admission banner information
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seminar Banner Section */}
        <Card className="py-5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <PanelTop className="w-5 h-5 text-blue-600" />
              <CardTitle>Seminar Banner (Home Page)</CardTitle>
            </div>
            
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* <div className="space-y-3">
                <Label htmlFor="homeBannerInfo.title" className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4" />
                  Title
                </Label>
                <Input
                  id="homeBannerInfo.title"
                  name="homeBannerInfo.title"
                  value={formData.homeBannerInfo?.title || ''}
                  onChange={handleChange}
                  placeholder="Enter seminar banner title"
                />
              </div> */}
              
             
              
              <div className="space-y-3 md:col-span-2">
                <Label htmlFor="homeBannerInfo.description" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Description
                </Label>
                <Textarea
                  id="homeBannerInfo.description"
                  name="homeBannerInfo.description"
                  value={formData.homeBannerInfo?.description || ''}
                  onChange={handleChange}
                  placeholder="Enter seminar description"
                  rows={2}
                />
              </div>
              </div>
              
              
            
            
          </CardContent>
        </Card>

        {/* Admission Banner Section */}
        <Card className="py-5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-green-600" />
              <CardTitle>Admission Banner</CardTitle>
            </div>
            
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* <div className="space-y-3">
                <Label htmlFor="admissionBannerInfo.title" className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4" />
                  Title
                </Label>
                <Input
                  id="admissionBannerInfo.title"
                  name="admissionBannerInfo.title"
                  value={formData.admissionBannerInfo?.title || ''}
                  onChange={handleChange}
                  placeholder="Enter admission banner title"
                />
              </div> */}
              
             
              
              <div className="space-y-3 md:col-span-2">
                <Label htmlFor="admissionBannerInfo.description" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Description
                </Label>
                <Textarea
                  id="admissionBannerInfo.description"
                  name="admissionBannerInfo.description"
                  value={formData.admissionBannerInfo?.description || ''}
                  onChange={handleChange}
                  placeholder="Enter admission description"
                  rows={2}
                />
              </div>
              </div>
              
              
            
            
          </CardContent>
        </Card>

        {/* Submit Section */}
        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            disabled={loading} 
            size="lg"
            className="gap-2 min-w-[200px]"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Globe className="w-4 h-4" />
                Update Banner Information
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}