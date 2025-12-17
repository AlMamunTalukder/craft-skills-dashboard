 

import { DateTimePickerForm } from "@/components/FormInputs/DateTimePicker";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import TextInput from "@/components/FormInputs/TextInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createBatch, updateBatch } from "@/queries/course/batch";
import { batchSchema } from "@/schemas/course/batch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Batch } from "@prisma/client";
import {
  Facebook,
  Loader2,
  MessageCircle,
  MessageCircleHeart,
  NotebookPen,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { z } from "zod";
import AppForm from "../AppForm";

export type BatchFormData = z.infer<typeof batchSchema>;

type Props = {
  initialValues?: Partial<Batch>;
};

export default function BatchForm({ initialValues }: Props) {
  const router = useRouter();

  const onSubmit = async (data: BatchFormData) => {
    const toastId = toast.loading("ব্যাচ সংরক্ষণ করা হচ্ছে...");
    try {
      if (initialValues?.id) {
        await updateBatch({ id: initialValues.id, data });
        toast.success("ব্যাচ সফলভাবে আপডেট হয়েছে", { id: toastId });
      } else {
        await createBatch(data);
        toast.success("ব্যাচ সফলভাবে তৈরি হয়েছে", { id: toastId });
      }

      router.push("/dashboard/courses/batch/list");
    } catch (error: any) {
      toast.error(error.message || "কিছু ভুল হয়েছে", { id: toastId });
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>
          {initialValues ? "ব্যাচ আপডেট করুন" : "নতুন ব্যাচ তৈরি করুন"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AppForm
          resolver={zodResolver(batchSchema)}
          onSubmit={onSubmit}
          defaultValues={initialValues}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 ">
              <TextInput
                label="ব্যাচের নাম"
                name="name"
                placeholder="যেমনঃ ব্যাচ ১"
                icon={NotebookPen}
              />

              <DateTimePickerForm
                label="রেজিস্ট্রেশনের শুরুর তারিখ"
                name="registrationStart"
              />
              <DateTimePickerForm
                label="রেজিস্ট্রেশনের শেষ তারিখ"
                name="registrationEnd"
              />

              {/* Secret Groups */}
              <TextInput
                label="Facebook Secret Group Link"
                name="facebookSecretGroup"
                placeholder="Facebook secret group link"
                icon={Facebook}
              />
              <TextInput
                label="WhatsApp Secret Group Link"
                name="whatsappSecretGroup"
                placeholder="WhatsApp secret group link"
                icon={MessageCircle}
              />
              <TextInput
                label="Messenger Secret Group Link"
                name="messengerSecretGroup"
                placeholder="Messenger secret group link"
                icon={MessageCircleHeart}
              />

              {/* Public Groups */}
              <TextInput
                label="Facebook Public Group Link"
                name="facebookPublicGroup"
                placeholder="Facebook public group link"
                icon={Facebook}
              />
              <TextInput
                label="WhatsApp Public Group Link"
                name="whatsappPublicGroup"
                placeholder="WhatsApp public group link"
                icon={MessageCircle}
              />
            </div>

            <div className="pt-4 flex justify-end">
              <SubmitButton
                title={initialValues ? "আপডেট করুন" : "তৈরি করুন"}
                loadingTitle="সংরক্ষণ হচ্ছে..."
                loading={false}
                className="px-6"
                loaderIcon={Loader2}
              />
            </div>
          </div>
        </AppForm>
      </CardContent>
    </Card>
  );
}
