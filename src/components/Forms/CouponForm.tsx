// src/components/Forms/CouponForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Calendar, Percent, DollarSign } from "lucide-react";
import { couponSchema, type CouponFormData } from "@/api/coupon.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type FormCouponData = {
  code: string;
  discountType: "PERCENTAGE" | "AMOUNT";
  discount: number;
  isActive: boolean;
  validFrom: string;
  validTo: string;
  maxUsage?: number;
};

interface CouponFormProps {
  initialValues?: Partial<FormCouponData>;
  onSubmit: (data: CouponFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export default function CouponForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
}: CouponFormProps) {
  const form = useForm<FormCouponData>({
    resolver: zodResolver(couponSchema) as any, // Use type assertion
    defaultValues: {
      code: "",
      discountType: "PERCENTAGE",
      discount: 10,
      isActive: true,
      validFrom: new Date().toISOString().slice(0, 16),
      validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      maxUsage: undefined,
      ...initialValues,
    },
  });

  const discountType = form.watch("discountType");

  const handleSubmit = async (data: FormCouponData) => {
    // Convert FormCouponData to CouponFormData for the API
    const submitData: CouponFormData = {
      ...data,
      discount: Number(data.discount),
      maxUsage: data.maxUsage ? Number(data.maxUsage) : undefined,
    };
    
    await onSubmit(submitData);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>{initialValues?.code ? "Edit Coupon" : "Create New Coupon"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Coupon Code *</Label>
                  <div className="relative">
                    <Input
                      id="code"
                      {...form.register("code")}
                      placeholder="e.g., SUMMER2024"
                      className="pl-10 uppercase"
                    />
                    <span className="absolute left-3 top-3 h-4 w-4 text-muted-foreground font-bold">
                      #
                    </span>
                  </div>
                  {form.formState.errors.code && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.code.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountType">Discount Type *</Label>
                  <Select
                    value={discountType}
                    onValueChange={(value: "PERCENTAGE" | "AMOUNT") =>
                      form.setValue("discountType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select discount type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                      <SelectItem value="AMOUNT">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount">
                    Discount {discountType === "PERCENTAGE" ? "(%)" : "(৳)"} *
                  </Label>
                  <div className="relative">
                    {discountType === "PERCENTAGE" ? (
                      <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    ) : (
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    )}
                    <Input
                      id="discount"
                      type="number"
                      step="0.01"
                      {...form.register("discount", { valueAsNumber: true })}
                      className="pl-10"
                      placeholder={discountType === "PERCENTAGE" ? "10" : "500"}
                    />
                  </div>
                  {form.formState.errors.discount && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.discount.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxUsage">Max Usage (Optional)</Label>
                  <Input
                    id="maxUsage"
                    type="number"
                    {...form.register("maxUsage", { valueAsNumber: true })}
                    placeholder="e.g., 100"
                  />
                  <p className="text-xs text-gray-500">
                    Leave empty for unlimited usage
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="validFrom">Valid From *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="validFrom"
                      type="datetime-local"
                      {...form.register("validFrom")}
                      className="pl-10"
                    />
                  </div>
                  {form.formState.errors.validFrom && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.validFrom.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="validTo">Valid To *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="validTo"
                      type="datetime-local"
                      {...form.register("validTo")}
                      className="pl-10"
                    />
                  </div>
                  {form.formState.errors.validTo && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.validTo.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={form.watch("isActive")}
                  onCheckedChange={(checked) =>
                    form.setValue("isActive", checked === true)
                  }
                />
                <Label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
                  Active Coupon
                </Label>
              </div>
            </div>

            <div className="pt-4 flex justify-end border-t">
              <Button type="submit" disabled={isSubmitting} className="px-8">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : initialValues?.code ? (
                  "Update Coupon"
                ) : (
                  "Create Coupon"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}