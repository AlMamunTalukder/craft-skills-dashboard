import { useState } from "react";
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
  Badge,
  Loader2,
  Save,
} from "lucide-react";

interface AddStudentFormProps {
  courses: any[];
  batches: any[];
  onSuccess: () => void;
}

interface StudentFormData {
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
  notes?: string;
}

export default function AddStudentForm({ courses, batches, onSuccess }: AddStudentFormProps) {
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
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
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle number inputs
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
      setSelectedCourse(course);
      
      // Auto-calculate price when course is selected
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
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          courseId: value,
          amount: 0,
          discountAmount: 0,
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const calculatePrice = () => {
    if (!selectedCourse) return;
    
    const basePrice = selectedCourse.price || 0;
    const discountPercent = selectedCourse.discount || 0;
    const paymentCharge = selectedCourse.paymentCharge || 0;
    
    const discountAmount = (basePrice * discountPercent) / 100;
    const priceAfterDiscount = basePrice - discountAmount;
    const totalWithCharge = priceAfterDiscount + paymentCharge;

    setFormData(prev => ({
      ...prev,
      amount: totalWithCharge,
      discountAmount: discountAmount,
    }));

    toast.success("Price calculated successfully!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
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
      setLoading(true);
      
      // Prepare submission data
      const submitData = {
        ...formData,
        registeredAt: new Date().toISOString(),
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/admissions/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to create admission");
      }

      toast.success("Student registered successfully!");
      onSuccess();
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "Failed to register student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal Information Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            <CardTitle>Personal Information</CardTitle>
          </div>
          <CardDescription>
            Enter the student's personal details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      {/* Course & Batch Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-purple-600" />
              <CardTitle>Course & Batch Selection</CardTitle>
            </div>
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
          <CardDescription>
            Select the course and batch for the student
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{selectedCourse.name}</p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    <span>Price: ৳{selectedCourse.price.toLocaleString()}</span>
                    {selectedCourse.discount > 0 && (
                      <Badge type="secondary" className="bg-green-100 text-green-800">
                        Discount: {selectedCourse.discount}%
                      </Badge>
                    )}
                    {selectedCourse.paymentCharge > 0 && (
                      <Badge type="primary">
                        Charge: ৳{selectedCourse.paymentCharge}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <CardTitle>Payment Information</CardTitle>
          </div>
          <CardDescription>
            Enter payment details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
              <Label htmlFor="discountAmount">Discount Amount (৳)</Label>
              <Input
                id="discountAmount"
                name="discountAmount"
                type="number"
                value={formData.discountAmount}
                onChange={handleChange}
                placeholder="Discount amount"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="couponCode">Coupon Code</Label>
              <Input
                id="couponCode"
                name="couponCode"
                value={formData.couponCode}
                onChange={handleChange}
                placeholder="Coupon code (if any)"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status & Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Status & Notes</CardTitle>
          <CardDescription>
            Set admission status and add any notes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registering...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Register Student
            </>
          )}
        </Button>
      </div>
    </form>
  );
}