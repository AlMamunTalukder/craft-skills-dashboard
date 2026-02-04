import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { Loader2, Save } from "lucide-react";

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: any;
  courses: any[];
  batches: any[];
  onSuccess: () => void;
}

interface EditFormData {
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

export default function EditStudentModal({
  isOpen,
  onClose,
  student,
  courses,
  batches,
  onSuccess,
}: EditStudentModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<EditFormData>({
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

  // Initialize form with student data when modal opens
  useEffect(() => {
    if (student && isOpen) {
      setFormData({
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
      });
    }
  }, [student, isOpen]);

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
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
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
      setLoading(true);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admissions/${student._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update student");
      }

      toast.success("Student updated successfully!");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error updating student:", error);
      toast.error(error.message || "Failed to update student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=" max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Edit Student Information</DialogTitle>
              <DialogDescription>
                Update student details. Changes will be saved immediately.
              </DialogDescription>
            </div>
           
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Personal Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name *</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone *</Label>
                <Input
                  id="edit-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-whatsapp">WhatsApp</Label>
                <Input
                  id="edit-whatsapp"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-facebook">Facebook</Label>
                <Input
                  id="edit-facebook"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-occupation">Occupation</Label>
                <Input
                  id="edit-occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Course & Batch */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Course & Batch</h4>

            <div className="grid grid-cols-1  gap-4">
              <div className="space-y-2 w-full">
                <Label htmlFor="edit-courseId">Course *</Label>
                <Select
                  value={formData.courseId}
                  onValueChange={(value) => handleSelectChange("courseId", value)}
                  
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent >
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-batchId">Batch *</Label>
                <Select
                  value={formData.batchId}
                  onValueChange={(value) => handleSelectChange("batchId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id}>
                        {batch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Payment Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-amount">Amount (৳) *</Label>
                <Input
                  id="edit-amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-discountAmount">Discount (৳)</Label>
                <Input
                  id="edit-discountAmount"
                  name="discountAmount"
                  type="number"
                  value={formData.discountAmount}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-paymentMethod">Payment Method</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => handleSelectChange("paymentMethod", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
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
                <Label htmlFor="edit-senderNumber">Sender Number</Label>
                <Input
                  id="edit-senderNumber"
                  name="senderNumber"
                  value={formData.senderNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-couponCode">Coupon Code</Label>
                <Input
                  id="edit-couponCode"
                  name="couponCode"
                  value={formData.couponCode}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Status & Notes */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Status & Notes</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-status">Admission Status</Label>
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
                <Label htmlFor="edit-paymentStatus">Payment Status</Label>
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

              <div className="space-y-2">
                <Label htmlFor="edit-result">Result</Label>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-notes">Admin Notes</Label>
              <Textarea
                id="edit-notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}