 
import TextArea from "@/components/FormInputs/TextAreaInput";
import TextInput from "@/components/FormInputs/TextInput";
import AppForm from "@/components/Forms/AppForm";
import { seminarRegistration } from "@/queries/seminar/registration";
import { seminarFormSchema } from "@/schemas/seminar/registration";
import { zodResolver } from "@hookform/resolvers/zod";
import { Briefcase, Loader2, Mail, Phone, User } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { z } from "zod";
import SubmitButton from "../FormInputs/SubmitButton";
import { FaArrowCircleRight } from "react-icons/fa";

export type SeminarRegistrationFormData = z.infer<typeof seminarFormSchema>;

export default function SeminarRegistrationForm({
  seminarId,
}: {
  seminarId: string | undefined;
}) {
  const router = useRouter();

  const handleSubmit = async (data: SeminarRegistrationFormData) => {
    const toastId = toast.loading("Registering...");

    try {
      await seminarRegistration(data, seminarId);
      toast.success("Successfully registered for the seminar.", {
        id: toastId,
      });
      router.push("/seminar-registration/success");
    } catch (error: any) {
      toast.error(error.message || "Failed to register for the seminar.", {
        id: toastId,
      });
    }
  };

  return (
    <AppForm onSubmit={handleSubmit} resolver={zodResolver(seminarFormSchema)}>
      <>
      <h1 className="text-[36px] text-center font-[500]">রেজিস্ট্রেশন ফরম</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 text-white">
          <TextInput
            label="নাম"
            name="name"
            placeholder="আপনার নাম লিখুন"
            icon={User}
               labelClassName="text-white"
          />

          <TextInput
            label="মোবাইল নাম্বার (ইংরেজি)"
            name="phone"
            placeholder="01XXXXXXXXX"
            icon={Phone}
               labelClassName="text-white"
          />

          <TextInput
            label="WhatsApp নাম্বার (ইংরেজি)"
            name="whatsapp"
            placeholder="01XXXXXXXXX"
            icon={Phone}
               labelClassName="text-white"
          />

          <TextInput
            label="ই-মেইল"
            name="email"
            placeholder="example@email.com"
            icon={Mail}
               labelClassName="text-white"
          />

          <TextInput        
            label="পেশা"
            name="occupation"
            placeholder="আপনার পেশা লিখুন"
            icon={Briefcase}
            labelClassName="text-white"          
          />

          <div className="hidden md:block" />

          <div className="md:col-span-2">
            <TextArea
              name="address"
              label="ঠিকানা"
              placeholder="আপনার ঠিকানা লিখুন"
              rows={4}

            />
          </div>
        </div>

        <div className="pt-4 flex justify-center">
          <SubmitButton
            title=" জমা দিন"
            loadingTitle="প্রক্রিয়া চলছে..."
            className="flex content-center items-center justify-center gap-2 w-[200px] bg-[#FFCB2C] text-lg py-3 rounded-md text-black transition-all duration-200 shadow-md hover:shadow-lg"
            loaderIcon={Loader2}
            buttonIcon={FaArrowCircleRight }
          />
        </div>
      </>
    </AppForm>
  );
}
