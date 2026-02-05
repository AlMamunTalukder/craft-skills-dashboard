import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Globe,
  Mail,
  Phone,
  Users,
  BookOpen,
  Layers,
  TrendingUp,
  Facebook,
  Youtube,
  MessageSquare,
  Send,
  Type,
  Link,
  BarChart3,
} from "lucide-react";

interface SiteContentData {
  _id?: string;
  id?: string;
  tagline: string;
  email: string;
  phone1: string;
  phone2?: string;
  facebook?: string;
  facebookGroup?: string;
  whatsapp?: string;
  youtube?: string;
  telegram?: string;
  logoLight: string;
  logoDark: string;
  totalsTeachers?: number;
  totalCourses?: number;
  totalBatches?: number;
  successRate?: number;
}

interface Props {
  initialValues: SiteContentData;
}

export default function SiteContentForm({ initialValues }: Props) {
  const [formData, setFormData] = useState<SiteContentData>(initialValues);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const navigate = useNavigate();

  console.log(setUploading);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/site`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

   

      if (response.ok) {
        toast.success("Site content updated successfully.");
        setTimeout(() => {
          navigate("/site-content");
        }, 1000);
      } else {
        // const errorData = await response.json();
        // console.error('Update failed:', errorData);
        throw new Error("Failed to update site content");
      }
    } catch (error) {
      // console.error('Error updating site content:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update site content. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? 0 : Number(value),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Site Configuration
          </h1>
          <p className="text-muted-foreground">
            Update your website content, branding, and social media links
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brand Identity Section */}
        <Card>
          <CardContent>
            <div className="space-y-4 py-3">
              <div className="space-y-2">
                <Label htmlFor="tagline" className="flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Site Tagline
                </Label>
                <Textarea
                  id="tagline"
                  name="tagline"
                  value={formData.tagline || ""}
                  onChange={handleChange}
                  placeholder="Enter your compelling site tagline..."
                  rows={3}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information Section */}
        <Card>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-5">
              <div className="space-y-3">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    placeholder="contact@example.com"
                    className="pl-10"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="phone1" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Primary Phone
                </Label>
                <div className="relative">
                  <Input
                    id="phone1"
                    name="phone1"
                    value={formData.phone1 || ""}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className="pl-10"
                  />
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="phone2" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Secondary Phone (Optional)
                </Label>
                <div className="relative">
                  <Input
                    id="phone2"
                    name="phone2"
                    value={formData.phone2 || ""}
                    onChange={handleChange}
                    placeholder="+1 (555) 987-6543"
                    className="pl-10"
                  />
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media Section */}
        <Card className="py-5 ">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Link className="w-5 h-5 text-primary" />
              <CardTitle>Social Media Links</CardTitle>
            </div>
            <CardDescription>
              Connect your social media profiles to increase engagement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="facebook" className="flex items-center gap-2">
                    <Facebook className="w-4 h-4 text-blue-600" />
                    Facebook Page
                  </Label>
                  <Input
                    id="facebook"
                    name="facebook"
                    value={formData.facebook || ""}
                    onChange={handleChange}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="whatsapp" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-green-600" />
                    WhatsApp Group
                  </Label>
                  <Input
                    id="whatsapp"
                    name="whatsapp"
                    value={formData.whatsapp || ""}
                    onChange={handleChange}
                    placeholder="https://wa.me/group-invite"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="telegram" className="flex items-center gap-2">
                    <Send className="w-4 h-4 text-blue-500" />
                    Telegram Channel
                  </Label>
                  <Input
                    id="telegram"
                    name="telegram"
                    value={formData.telegram || ""}
                    onChange={handleChange}
                    placeholder="https://t.me/yourchannel"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <Label
                    htmlFor="facebookGroup"
                    className="flex items-center gap-2"
                  >
                    <Users className="w-4 h-4 text-blue-700" />
                    Facebook Group
                  </Label>
                  <Input
                    id="facebookGroup"
                    name="facebookGroup"
                    value={formData.facebookGroup || ""}
                    onChange={handleChange}
                    placeholder="https://facebook.com/groups/yourgroup"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="youtube" className="flex items-center gap-2">
                    <Youtube className="w-4 h-4 text-red-600" />
                    YouTube Channel
                  </Label>
                  <Input
                    id="youtube"
                    name="youtube"
                    value={formData.youtube || ""}
                    onChange={handleChange}
                    placeholder="https://youtube.com/@yourchannel"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Section */}
        <Card className="py-5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <CardTitle>Key Statistics</CardTitle>
            </div>
            <CardDescription>
              Showcase your achievements and success metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-3">
                <Label
                  htmlFor="totalsTeachers"
                  className="flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Total Teachers
                </Label>
                <Input
                  id="totalsTeachers"
                  name="totalsTeachers"
                  type="number"
                  value={formData.totalsTeachers || 0}
                  onChange={handleNumberChange}
                  placeholder="50"
                  className="text-center text-lg"
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="totalCourses"
                  className="flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Total Courses
                </Label>
                <Input
                  id="totalCourses"
                  name="totalCourses"
                  type="number"
                  value={formData.totalCourses || 0}
                  onChange={handleNumberChange}
                  placeholder="100"
                  className="text-center text-lg"
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="totalBatches"
                  className="flex items-center gap-2"
                >
                  <Layers className="w-4 h-4" />
                  Total Batches
                </Label>
                <Input
                  id="totalBatches"
                  name="totalBatches"
                  type="number"
                  value={formData.totalBatches || 0}
                  onChange={handleNumberChange}
                  placeholder="250"
                  className="text-center text-lg"
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="successRate"
                  className="flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  Success Rate (%)
                </Label>
                <Input
                  id="successRate"
                  name="successRate"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.successRate || 0}
                  onChange={handleNumberChange}
                  placeholder="98"
                  className="text-center text-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Section */}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button
            type="submit"
            disabled={loading || uploading !== null}
            size="lg"
            className="gap-2 min-w-[200px]"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Updating...
              </>
            ) : uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Globe className="w-4 h-4" />
                Update Site Configuration
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
