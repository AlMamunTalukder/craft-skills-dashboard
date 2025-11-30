"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Upload, X } from "lucide-react";

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
  const [uploading, setUploading] = useState<string | null>(null); // 'light' | 'dark' | null
  const navigate = useNavigate();

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  
  console.log('=== FORM SUBMISSION DATA ===');
  console.log('Form Data:', formData);
  console.log('Logo Light URL length:', formData.logoLight?.length);
  console.log('Logo Dark URL length:', formData.logoDark?.length);
  console.log('Logo Light is base64:', formData.logoLight?.startsWith('data:image'));
  console.log('Logo Dark is base64:', formData.logoDark?.startsWith('data:image'));
  
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
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tagline Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tagline</h3>
            <div className="space-y-2">
              <Label htmlFor="tagline">Site Tagline</Label>
              <Textarea
                id="tagline"
                name="tagline"
                value={formData.tagline || ''}
                onChange={handleChange}
                placeholder="Enter your site tagline"
                rows={3}
              />
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone1">Phone 1</Label>
                <Input
                  id="phone1"
                  name="phone1"
                  value={formData.phone1 || ''}
                  onChange={handleChange}
                  placeholder="Enter primary phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone2">Phone 2 (Optional)</Label>
                <Input
                  id="phone2"
                  name="phone2"
                  value={formData.phone2 || ''}
                  onChange={handleChange}
                  placeholder="Enter secondary phone number"
                />
              </div>
            </div>
          </div>

          {/* Social Media Links Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Social Media Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook Page</Label>
                <Input
                  id="facebook"
                  name="facebook"
                  value={formData.facebook || ''}
                  onChange={handleChange}
                  placeholder="Enter Facebook page URL"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebookGroup">Facebook Group</Label>
                <Input
                  id="facebookGroup"
                  name="facebookGroup"
                  value={formData.facebookGroup || ''}
                  onChange={handleChange}
                  placeholder="Enter Facebook group URL"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Group</Label>
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  value={formData.whatsapp || ''}
                  onChange={handleChange}
                  placeholder="Enter WhatsApp group link"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube">YouTube Channel</Label>
                <Input
                  id="youtube"
                  name="youtube"
                  value={formData.youtube || ''}
                  onChange={handleChange}
                  placeholder="Enter YouTube channel URL"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telegram">Telegram Channel</Label>
                <Input
                  id="telegram"
                  name="telegram"
                  value={formData.telegram || ''}
                  onChange={handleChange}
                  placeholder="Enter Telegram channel URL"
                />
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalsTeachers">Total Teachers</Label>
                <Input
                  id="totalsTeachers"
                  name="totalsTeachers"
                  type="number"
                  value={formData.totalsTeachers || 0}
                  onChange={handleNumberChange}
                  placeholder="Enter total teachers"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalCourses">Total Courses</Label>
                <Input
                  id="totalCourses"
                  name="totalCourses"
                  type="number"
                  value={formData.totalCourses || 0}
                  onChange={handleNumberChange}
                  placeholder="Enter total courses"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalBatches">Total Batches</Label>
                <Input
                  id="totalBatches"
                  name="totalBatches"
                  type="number"
                  value={formData.totalBatches || 0}
                  onChange={handleNumberChange}
                  placeholder="Enter total batches"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="successRate">Success Rate (%)</Label>
                <Input
                  id="successRate"
                  name="successRate"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.successRate || 0}
                  onChange={handleNumberChange}
                  placeholder="Enter success rate percentage"
                />
              </div>
            </div>
          </div>

          {/* Logo URLs Section - DIRECT UPLOAD ONLY */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Brand Logos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Light Logo */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="logoLight" className="text-base font-medium">Light Logo</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('lightLogoUpload')?.click()}
                      disabled={uploading === 'light'}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading === 'light' ? 'Uploading...' : 'Upload Logo'}
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
                
                {/* Hidden file input for direct upload */}
                <input
                  type="file"
                  id="lightLogoUpload"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleDirectUpload(e, 'light')}
                  disabled={uploading === 'light'}
                />
                
                {/* Logo Preview */}
                {formData.logoLight ? (
                  <div className="border-2 border-dashed border-green-200 rounded-lg p-4 bg-green-50">
                    <div className="flex flex-col items-center">
                      <p className="text-sm text-green-600 mb-2 font-medium">Current Light Logo:</p>
                      <img
                        src={formData.logoLight}
                        alt="Light Logo Preview"
                        className="h-32 object-contain max-w-full"
                      />
                      <p className="text-xs text-gray-500 mt-2 text-center break-all max-w-full">
                        {formData.logoLight}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Upload className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500">No light logo uploaded</p>
                      <p className="text-xs text-gray-400">Click "Upload Logo" to add a light logo</p>
                    </div>
                  </div>
                )}
                
                {/* Hidden input for form data */}
                <Input
                  id="logoLight"
                  name="logoLight"
                  value={formData.logoLight || ''}
                  onChange={handleChange}
                  className="hidden"
                />
              </div>

              {/* Dark Logo */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="logoDark" className="text-base font-medium">Dark Logo</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('darkLogoUpload')?.click()}
                      disabled={uploading === 'dark'}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading === 'dark' ? 'Uploading...' : 'Upload Logo'}
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
                
                {/* Hidden file input for direct upload */}
                <input
                  type="file"
                  id="darkLogoUpload"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleDirectUpload(e, 'dark')}
                  disabled={uploading === 'dark'}
                />
                
                {/* Logo Preview */}
                {formData.logoDark ? (
                  <div className="border-2 border-dashed border-blue-200 rounded-lg p-4 bg-blue-50">
                    <div className="flex flex-col items-center">
                      <p className="text-sm text-blue-600 mb-2 font-medium">Current Dark Logo:</p>
                      <div className="bg-gray-800 p-4 rounded">
                        <img
                          src={formData.logoDark}
                          alt="Dark Logo Preview"
                          className="h-32 object-contain max-w-full"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center break-all max-w-full">
                        {formData.logoDark}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Upload className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500">No dark logo uploaded</p>
                      <p className="text-xs text-gray-400">Click "Upload Logo" to add a dark logo</p>
                    </div>
                  </div>
                )}
                
                {/* Hidden input for form data */}
                <Input
                  id="logoDark"
                  name="logoDark"
                  value={formData.logoDark || ''}
                  onChange={handleChange}
                  className="hidden"
                />
              </div>
            </div>
            
            {/* Logo Selection Tips */}
            
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={loading || uploading !== null} 
              size="lg"
            >
              {loading ? "Updating..." : uploading ? "Uploading..." : "Update Site Content"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}