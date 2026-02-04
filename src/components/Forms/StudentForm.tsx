// src/components/Forms/StudentForm.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import {
  User,
  Phone,
  Mail,
  MessageSquare,
  Facebook,
  Briefcase,
  MapPin,
  Calculator,
  CreditCard,
  Tag,
  AlertCircle,
  Loader2,
  Save,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Types
export interface StudentFormData {
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  facebook?: string;
  occupation?: string;
  address?: string;
  courseId: string;
  batchId: string;
  paymentMethod: string;
  senderNumber?: string;
  couponCode?: string;
  amount: number;
  discountAmount: number;
  status: "pending" | "approved" | "rejected" | "waitlisted";
  paymentStatus: "pending" | "partial" | "paid" | "cancelled";
  result?: "pending" | "needs improvement" | "average" | "good" | "very good" | "excellent";
  notes?: string;
}

interface Course {
  id: string;
  name: string;
  price: number;
  discount: number;
  paymentCharge: number;
  description?: string;
}

interface Batch {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
}

interface CouponState {
  code: string;
  applied: boolean;
  discountAmount: number;
  error: string | null;
  loading: boolean;
}

interface StudentFormProps {
  courses: Course[];
  batches: Batch[];
  initialData?: StudentFormData & { _id?: string };
  isEdit?: boolean;
  backLink?: string;
  onSuccess?: () => void;
}

export default function StudentForm({
  courses,
  batches,
  initialData,
  isEdit = false,
  backLink = "/add-student",
  onSuccess,
}: StudentFormProps) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [couponState, setCouponState] = useState<CouponState>({
    code: "",
    applied: false,
    discountAmount: 0,
    error: null,
    loading: false,
  });
  
  const [formData, setFormData] = useState<StudentFormData>({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    facebook: "",
    occupation: "",
    address: "",
    courseId: "",
    batchId: "",
    paymentMethod: "",
    senderNumber: "",
    couponCode: "",
    amount: 0,
    discountAmount: 0,
    status: "pending",
    paymentStatus: "pending",
    result: "pending",
    notes: "",
  });

  // Initialize form with initialData when provided
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        whatsapp: initialData.whatsapp || "",
        facebook: initialData.facebook || "",
        occupation: initialData.occupation || "",
        address: initialData.address || "",
        courseId: initialData.courseId || "",
        batchId: initialData.batchId || "",
        paymentMethod: initialData.paymentMethod || "",
        senderNumber: initialData.senderNumber || "",
        couponCode: initialData.couponCode || "",
        amount: initialData.amount || 0,
        discountAmount: initialData.discountAmount || 0,
        status: initialData.status || "pending",
        paymentStatus: initialData.paymentStatus || "pending",
        result: initialData.result || "pending",
        notes: initialData.notes || "",
      });

      // Find and set selected course
      if (initialData.courseId) {
        const course = courses.find(c => c.id === initialData.courseId);
        if (course) {
          setSelectedCourse(course);
          
          // Initialize coupon state
          if (initialData.couponCode) {
            setCouponState({
              code: initialData.couponCode,
              applied: true,
              discountAmount: initialData.discountAmount || 0,
              error: null,
              loading: false,
            });
          }
        }
      }
    }
  }, [initialData, courses]);

  // Calculate price details
  const calculatePriceDetails = () => {
    if (!selectedCourse) return null;
    
    const basePrice = selectedCourse.price || 0;
    const discountPercent = selectedCourse.discount || 0;
    const paymentCharge = selectedCourse.paymentCharge || 0;
    
    const courseDiscountAmount = (basePrice * discountPercent) / 100;
    const priceAfterCourseDiscount = basePrice - courseDiscountAmount;
    const totalWithCharge = priceAfterCourseDiscount + paymentCharge;
    const finalTotal = Math.max(0, totalWithCharge - couponState.discountAmount);
    
    return {
      basePrice,
      discountPercent,
      paymentCharge,
      courseDiscountAmount,
      priceAfterCourseDiscount,
      totalWithCharge,
      finalTotal,
    };
  };

  const priceDetails = calculatePriceDetails();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "number") {
      setFormData(prev => ({
        ...prev,
        [name]: value === "" ? 0 : Number(value),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "courseId") {
      const course = courses.find(c => c.id === value);
      setSelectedCourse(course || null);
      
      // Reset coupon when course changes
      setCouponState({
        code: "",
        applied: false,
        discountAmount: 0,
        error: null,
        loading: false,
      });
      
      if (course) {
        const basePrice = course.price || 0;
        const discountPercent = course.discount || 0;
        const paymentCharge = course.paymentCharge || 0;
        
        const discountAmount = (basePrice * discountPercent) / 100;
        const priceAfterDiscount = basePrice - discountAmount;
        const totalWithCharge = priceAfterDiscount + paymentCharge;

        setFormData(prev => ({
          ...prev,
          courseId: value,
          amount: totalWithCharge,
          discountAmount: discountAmount,
          couponCode: "",
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          courseId: value,
          amount: 0,
          discountAmount: 0,
          couponCode: "",
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleApplyCoupon = async () => {
    if (!formData.couponCode?.trim() || !selectedCourse || !priceDetails) {
      toast.error("Please select a course and enter a coupon code");
      return;
    }

    setCouponState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/coupons/apply`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: formData.couponCode.trim().toUpperCase(),
          totalAmount: priceDetails.totalWithCharge,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to validate coupon");
      }

      if (result.success) {
        const discountAmount = result.discountAmount || 0;
        setCouponState({
          code: formData.couponCode.trim().toUpperCase(),
          applied: true,
          discountAmount: discountAmount,
          error: null,
          loading: false,
        });
        
        // Update the form data with new amount
        const finalAmount = Math.max(0, priceDetails.totalWithCharge - discountAmount);
        setFormData(prev => ({
          ...prev,
          amount: finalAmount,
          discountAmount: priceDetails.courseDiscountAmount + discountAmount,
        }));
        
        toast.success("Coupon applied successfully!");
      } else {
        setCouponState(prev => ({
          ...prev,
          error: result.message || "Invalid coupon",
          loading: false,
        }));
        toast.error(result.message || "Invalid coupon");
      }
    } catch (error: any) {
      console.error("Error applying coupon:", error);
      setCouponState(prev => ({
        ...prev,
        error: error.message || "Failed to validate coupon",
        loading: false,
      }));
      toast.error(error.message || "Failed to validate coupon");
    }
  };

  const handleRemoveCoupon = () => {
    if (priceDetails) {
      setCouponState({
        code: "",
        applied: false,
        discountAmount: 0,
        error: null,
        loading: false,
      });
      
      // Reset to original amount without coupon
      setFormData(prev => ({
        ...prev,
        amount: priceDetails.totalWithCharge,
        discountAmount: priceDetails.courseDiscountAmount,
        couponCode: "",
      }));
    }
    
    toast.success("Coupon removed");
  };

  const calculatePrice = () => {
    if (!selectedCourse) return;
    
    const basePrice = selectedCourse.price || 0;
    const discountPercent = selectedCourse.discount || 0;
    const paymentCharge = selectedCourse.paymentCharge || 0;
    
    const discountAmount = (basePrice * discountPercent) / 100;
    const priceAfterDiscount = basePrice - discountAmount;
    const totalWithCharge = priceAfterDiscount + paymentCharge;

    // Apply coupon discount if coupon is applied
    const finalAmount = Math.max(0, totalWithCharge - couponState.discountAmount);
    
    setFormData(prev => ({
      ...prev,
      amount: finalAmount,
      discountAmount: discountAmount + couponState.discountAmount,
    }));

    toast.success("Price calculated successfully!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Phone is required");
      return;
    }
    if (!formData.courseId) {
      toast.error("Course is required");
      return;
    }
    if (!formData.batchId) {
      toast.error("Batch is required");
      return;
    }
    if (formData.amount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    try {
      setSubmitting(true);
      
      // Prepare submission data
      const submitData = {
        ...formData,
        couponCode: couponState.applied ? couponState.code : undefined,
        discountAmount: formData.discountAmount,
      };

      if (isEdit && initialData?._id) {
        // Update existing student
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admissions/${initialData._id}`, {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitData),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to update student");
        }

        toast.success("Student updated successfully!");
      } else {
        // Create new student
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admissions/register`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...submitData,
            registeredAt: new Date().toISOString(),
          }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to create admission");
        }

        toast.success("Student registered successfully!");
      }

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      } else {
        // Default navigation
        navigate(backLink);
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error.message || `Failed to ${isEdit ? 'update' : 'register'} student`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(backLink)}
          disabled={submitting}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEdit ? 'Edit Student' : 'Add New Student'}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? 'Update student information' : 'Manually register a student to any course batch'}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isEdit ? (
              <>
                <User className="h-5 w-5" />
                Edit Student Information
              </>
            ) : (
              <>
                <User className="h-5 w-5" />
                Student Registration Form
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="01XXXXXXXXX"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    WhatsApp Number
                  </Label>
                  <Input
                    id="whatsapp"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="Optional WhatsApp number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facebook" className="flex items-center gap-2">
                    <Facebook className="w-4 h-4" />
                    Facebook Profile
                  </Label>
                  <Input
                    id="facebook"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleChange}
                    placeholder="Facebook profile URL"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupation" className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Occupation
                  </Label>
                  <Input
                    id="occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    placeholder="Student/Job/etc."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address
                </Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Full address"
                  rows={3}
                />
              </div>
            </div>

            {/* Course & Batch Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-lg">Course & Batch Selection</h4>
                {selectedCourse && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={calculatePrice}
                    className="flex items-center gap-2"
                  >
                    <Calculator className="w-4 h-4" />
                    Calculate Price
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="courseId">Select Course *</Label>
                  <Select
                    value={formData.courseId}
                    onValueChange={(value) => handleSelectChange("courseId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name} - ৳{course.price.toLocaleString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="batchId">Select Batch *</Label>
                  <Select
                    value={formData.batchId}
                    onValueChange={(value) => handleSelectChange("batchId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a batch" />
                    </SelectTrigger>
                    <SelectContent>
                      {batches.map((batch) => (
                        <SelectItem key={batch.id} value={batch.id}>
                          {batch.name} - {batch.isActive ? "Active" : "Inactive"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedCourse && (
                <div className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{selectedCourse.name}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span>Price: ৳{selectedCourse.price.toLocaleString()}</span>
                        {selectedCourse.discount > 0 && (
                          <Badge className="bg-green-100 text-green-800">
                            Discount: {selectedCourse.discount}%
                          </Badge>
                        )}
                        {selectedCourse.paymentCharge > 0 && (
                          <Badge variant="outline">
                            Charge: ৳{selectedCourse.paymentCharge}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Coupon Section */}
            {selectedCourse && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-lg">Coupon Code</h4>
                  {couponState.applied && (
                    <Badge className="bg-green-100 text-green-800">
                      Applied
                    </Badge>
                  )}
                </div>

                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1">
                    <Input
                      id="code"
                      name="couponCode"
                      value={formData.couponCode}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        setFormData(prev => ({
                          ...prev,
                          couponCode: value,
                        }));
                        
                        if (couponState.applied) {
                          setCouponState({
                            code: value,
                            applied: false,
                            discountAmount: 0,
                            error: null,
                            loading: false,
                          });
                        }
                      }}
                      placeholder="Enter coupon code (e.g., SPECIAL30)"
                      disabled={couponState.applied}
                      className={couponState.error ? "border-red-500" : ""}
                    />
                    {couponState.error && (
                      <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {couponState.error}
                      </div>
                    )}
                  </div>
                  
                  <Button
                    type="button"
                    onClick={couponState.applied ? handleRemoveCoupon : handleApplyCoupon}
                    disabled={couponState.loading || (!formData.couponCode && !couponState.applied)}
                    variant={couponState.applied ? "destructive" : "default"}
                    className="flex items-center gap-2"
                  >
                    {couponState.loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : couponState.applied ? (
                      <XCircle className="h-4 w-4" />
                    ) : (
                      <Tag className="h-4 w-4" />
                    )}
                    {couponState.applied ? "Remove Coupon" : "Apply Coupon"}
                  </Button>
                </div>
                
                {couponState.applied && (
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Coupon Applied:</span>
                        <Badge className="bg-green-100 text-green-800">
                          {couponState.code}
                        </Badge>
                      </div>
                      <span className="font-bold text-green-700">
                        -৳{couponState.discountAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Payment Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Payment Information</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) => handleSelectChange("paymentMethod", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BKASH">Bkash</SelectItem>
                      <SelectItem value="NAGAD">Nagad</SelectItem>
                      <SelectItem value="ROCKET">Rocket</SelectItem>
                      <SelectItem value="CASH">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senderNumber">Sender Number</Label>
                  <Input
                    id="senderNumber"
                    name="senderNumber"
                    value={formData.senderNumber}
                    onChange={handleChange}
                    placeholder="Payment sender number"
                  />
                </div>
              </div>

              {/* Price Summary */}
              {priceDetails && (
                <div className="p-4 rounded-lg border space-y-2">
                  <h4 className="font-semibold text-gray-700">Price Summary</h4>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-gray-600">
                      <span>Base Price:</span>
                      <span>৳{priceDetails.basePrice.toLocaleString()}</span>
                    </div>
                    
                    {priceDetails.discountPercent > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Course Discount ({priceDetails.discountPercent}%):</span>
                        <span>-৳{priceDetails.courseDiscountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    
                    {priceDetails.paymentCharge > 0 && (
                      <div className="flex justify-between text-blue-600">
                        <span>Payment Charge:</span>
                        <span>+৳{priceDetails.paymentCharge.toLocaleString()}</span>
                      </div>
                    )}
                    
                    {couponState.applied && (
                      <div className="flex justify-between text-green-600">
                        <span>Coupon Discount:</span>
                        <span>-৳{couponState.discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Final Amount:</span>
                        <span className="text-emerald-700">
                          ৳{formData.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="amount">Total Amount (৳) *</Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="Enter amount"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discountAmount">Total Discount Amount (৳)</Label>
                    <Input
                      id="discountAmount"
                      name="discountAmount"
                      type="number"
                      value={formData.discountAmount}
                      onChange={handleChange}
                      placeholder="Total discount amount"
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Status & Notes */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Status & Notes</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Admission Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="waitlisted">Waitlisted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentStatus">Payment Status</Label>
                  <Select
                    value={formData.paymentStatus}
                    onValueChange={(value: any) => handleSelectChange("paymentStatus", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {isEdit && (
                  <div className="space-y-2">
                    <Label htmlFor="result">Result</Label>
                    <Select
                      value={formData.result}
                      onValueChange={(value: any) => handleSelectChange("result", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="needs improvement">Needs Improvement</SelectItem>
                        <SelectItem value="average">Average</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="very good">Very Good</SelectItem>
                        <SelectItem value="excellent">Excellent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Admin Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any additional notes or comments"
                  rows={3}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(backLink)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEdit ? "Updating..." : "Registering..."}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEdit ? "Update Student" : "Register Student"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}