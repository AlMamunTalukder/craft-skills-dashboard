"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { 
  Upload, 
  X, 
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
  Palette
} from "lucide-react";

// Define the interface for site content data
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
    
    console.log('Update response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('Update successful:', result);
      toast.success("Site content updated successfully.");
      setTimeout(() => {
        navigate("/site-content");
      }, 1000);
    } else {
      const errorData = await response.json();
      console.error('Update failed:', errorData);
      throw new Error('Failed to update site content');
    }
  } catch (error) {
    console.error('Error updating site content:', error);
    toast.error(error instanceof Error ? error.message : "Failed to update site content. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  // Remove logo
  const handleRemoveLogo = (logoType: 'light' | 'dark') => {
    setFormData((prev) => ({
      ...prev,
      [logoType === 'light' ? 'logoLight' : 'logoDark']: "",
    }));
    toast.success(`${logoType === 'light' ? 'Light' : 'Dark'} logo removed!`);
  };

 const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>, logoType: 'light' | 'dark') => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    toast.error('Please select a valid image file (JPEG, PNG, SVG, WebP)');
    return;
  }

  // Validate file size (2MB max)
  if (file.size > 2 * 1024 * 1024) {
    toast.error('Image size should be less than 2MB');
    return;
  }

  setUploading(logoType);

  try {
    const formData = new FormData();
    formData.append('file', file);

    // This should now work with the correct endpoint
    const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Upload failed with status: ${response.status}`);
    }

    const result = await response.json();
    
    // Get the URL from the response
    const imageUrl = result.data?.url;

    if (imageUrl) {
      setFormData((prev) => ({
        ...prev,
        [logoType === 'light' ? 'logoLight' : 'logoDark']: imageUrl,
      }));
      toast.success(`${logoType === 'light' ? 'Light' : 'Dark'} logo uploaded successfully!`);
    } else {
      console.log('Upload response:', result);
      throw new Error('No image URL returned from server');
    }
  } catch (error) {
    console.error('Upload error:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to upload image. Please try again.');
  } finally {
    setUploading(null);
    e.target.value = '';
  }
};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Site Configuration</h1>
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
                  value={formData.tagline || ''}
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
                    value={formData.email || ''}
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
                    value={formData.phone1 || ''}
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
                    value={formData.phone2 || ''}
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
                    value={formData.facebook || ''}
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
                    value={formData.whatsapp || ''}
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
                    value={formData.telegram || ''}
                    onChange={handleChange}
                    placeholder="https://t.me/yourchannel"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="facebookGroup" className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-700" />
                    Facebook Group
                  </Label>
                  <Input
                    id="facebookGroup"
                    name="facebookGroup"
                    value={formData.facebookGroup || ''}
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
                    value={formData.youtube || ''}
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
                <Label htmlFor="totalsTeachers" className="flex items-center gap-2">
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
                <Label htmlFor="totalCourses" className="flex items-center gap-2">
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
                <Label htmlFor="totalBatches" className="flex items-center gap-2">
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
                <Label htmlFor="successRate" className="flex items-center gap-2">
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

        {/* Logo URLs Section - DIRECT UPLOAD ONLY */}
        {/* <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              <CardTitle>Brand Logos</CardTitle>
            </div>
            <CardDescription>
              Upload logos for light and dark mode themes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      Light Mode Logo
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Displayed on light backgrounds
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('lightLogoUpload')?.click()}
                      disabled={uploading === 'light'}
                      className="gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      {uploading === 'light' ? 'Uploading...' : 'Upload'}
                    </Button>
                    {formData.logoLight && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveLogo('light')}
                        disabled={uploading === 'light'}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <input
                  type="file"
                  id="lightLogoUpload"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleDirectUpload(e, 'light')}
                  disabled={uploading === 'light'}
                />
                
                {formData.logoLight ? (
                  <div className="border-2 border-dashed border-green-200 dark:border-green-800 rounded-xl p-4 bg-green-50 dark:bg-green-900/20">
                    <div className="flex flex-col items-center">
                      <Badge variant="secondary" className="mb-3">
                        Current Logo Preview
                      </Badge>
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm w-full">
                        <img
                          src={formData.logoLight}
                          alt="Light Logo Preview"
                          className="h-32 object-contain mx-auto"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-3 text-center break-all max-w-full">
                        {formData.logoLight}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">No light logo uploaded</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Recommended: SVG or PNG with transparent background
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <Input
                  id="logoLight"
                  name="logoLight"
                  value={formData.logoLight || ''}
                  onChange={handleChange}
                  className="hidden"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-800 dark:bg-gray-400" />
                      Dark Mode Logo
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Displayed on dark backgrounds
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('darkLogoUpload')?.click()}
                      disabled={uploading === 'dark'}
                      className="gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      {uploading === 'dark' ? 'Uploading...' : 'Upload'}
                    </Button>
                    {formData.logoDark && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveLogo('dark')}
                        disabled={uploading === 'dark'}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <input
                  type="file"
                  id="darkLogoUpload"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleDirectUpload(e, 'dark')}
                  disabled={uploading === 'dark'}
                />
                
                {formData.logoDark ? (
                  <div className="border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-xl p-4 bg-blue-50 dark:bg-blue-900/20">
                    <div className="flex flex-col items-center">
                      <Badge variant="secondary" className="mb-3">
                        Current Logo Preview
                      </Badge>
                      <div className="bg-gray-900 p-6 rounded-lg shadow-sm w-full">
                        <img
                          src={formData.logoDark}
                          alt="Dark Logo Preview"
                          className="h-32 object-contain mx-auto"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-3 text-center break-all max-w-full">
                        {formData.logoDark}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">No dark logo uploaded</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Recommended: SVG or PNG with transparent background
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <Input
                  id="logoDark"
                  name="logoDark"
                  value={formData.logoDark || ''}
                  onChange={handleChange}
                  className="hidden"
                />
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Submit Section */}
       
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                {/* <p className="font-medium">Ready to update your site configuration?</p>
                <p className="text-sm text-muted-foreground">
                  All changes will be applied immediately after saving
                </p> */}
              </div>
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