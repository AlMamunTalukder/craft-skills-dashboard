 

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   ArrowRight,
//   BadgeCheck,
//   CreditCard,
//   Facebook,
//   GraduationCap,
//   Mail,
//   MessageSquare,
//   Phone,
//   Send,
//   StarIcon,
//   User,
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import toast from "react-hot-toast";
// import { z } from "zod";

// import FormSelectInput from "@/components/FormInputs/FormSelectInput";
// import SubmitButton from "@/components/FormInputs/SubmitButton";
// import TextInput from "@/components/FormInputs/TextInput";
// import AppForm from "../AppForm";
// import Image from "next/image";
// import { courseRegistrationSchema } from "@/schemas/course/registration";
// import { courseRegistration } from "@/queries/course/registration";
// import FormSelectInputWithWatch from "@/components/FormInputs/FormSelectInputWithWatch";

// export type CourseRegistrationFormData = z.infer<
//   typeof courseRegistrationSchema
// >;

// type Props = {
//   courses: any[];
//   batch: any;
//   loading?: boolean;
// };

// export default function RegistrationForm({
//   courses,
//   batch,
//   loading = false,
// }: Props) {
//   const router = useRouter();
//   const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

//   // Transform courses data for the select input
//   const courseOptions = courses.map((course) => {
//     const discountedPrice =
//       course.price - (course.price * course.discount) / 100;
//     const totalPrice = Math.round(discountedPrice + course.paymentCharge);
//     return {
//       label: `${course.name} - ৳${totalPrice.toLocaleString()}`,
//       value: course.id,
//     };
//   });

//   // Payment method options
//   const paymentMethods = [
//     { label: "বিকাশ", value: "BKASH" },
//     { label: "নগদ", value: "NAGAD" },
//     { label: "রকেট", value: "ROCKET" },
//   ];

//   const onSubmit = async (data: CourseRegistrationFormData) => {
//     const toastId = toast.loading("ফর্ম জমা দেওয়া হচ্ছে...");
//     try {
//       // Add batch ID to the form data
//       const formData = {
//         ...data,
//         batchId: batch?.id,
//       };

//       await courseRegistration(formData, batch?.id);

//       toast.success("আপনার রেজিস্ট্রেশন সফল হয়েছে", { id: toastId });
//       router.push("/admission-registration/success");
//     } catch (error: any) {
//       toast.error(error.message || "কিছু ভুল হয়েছে", { id: toastId });
//     }
//   };

//   // Get selected course details for payment amount
//   const getSelectedCourseAmount = () => {
//     if (!selectedCourse) return "";
//     const course = courses.find((c) => c.id === selectedCourse);
//     if (!course) return "";

//     const discountedPrice =
//       course.price - (course.price * course.discount) / 100;
//     const totalPrice = Math.round(discountedPrice + course.paymentCharge);
//     return totalPrice.toString();
//   };

//   return (
//     <div className="md:max-w-6xl mx-auto my-12">
//       <div className="relative">
//         {/* Main card */}
//         <Card className="border border-purple-300/30 shadow-xl overflow-hidden bg-gradient-to-b from-[#4F0187] to-[#3A0161] relative z-10">
//           {/* Header badge */}
//           <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold py-2 px-6 rounded-b-lg shadow-lg z-20">
//             <span className="flex items-center gap-2">
//               <GraduationCap size={18} />
//               <span>ব্যাচ {batch?.name || ""}</span>
//             </span>
//           </div>

//           <CardHeader className="pb-8 pt-12 text-center">
//             <CardTitle className="text-4xl font-bold text-white mb-3 drop-shadow-md">
//               কোর্স ভর্তি ফরম
//             </CardTitle>
//             <CardDescription className="text-xl font-medium text-white/90 max-w-3xl mx-auto">
//               ভর্তি নিশ্চিত করতে টাকা পাঠিয়ে ফরমটি পূরণ করুন।
//               {batch?.registrationEnd && (
//                 <span className="block mt-2 text-yellow-300 font-semibold">
//                   শেষ তারিখ:{" "}
//                   {new Date(batch.registrationEnd).toLocaleDateString("bn-BD", {
//                     year: "numeric",
//                     month: "long",
//                     day: "numeric",
//                   })}
//                 </span>
//               )}
//             </CardDescription>
//           </CardHeader>

//           <CardContent className="p-0">
//             {/* Course Information Section */}
//             <div className="bg-[#370165]/80 backdrop-blur-md p-8 border-y border-white/20">
//               <h3 className="font-bold text-2xl text-white mb-6 flex items-center gap-2">
//                 <span className="bg-white/20 p-1.5 rounded-md">
//                   <GraduationCap size={20} className="text-yellow-300" />
//                 </span>
//                 কোর্স বিবরণ
//               </h3>

//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 {courses.map((course) => {
//                   const discountedPrice =
//                     course.price - (course.price * course.discount) / 100;
//                   const totalPrice = Math.round(
//                     discountedPrice + course.paymentCharge,
//                   );

//                   return (
//                     <div
//                       key={course.id}
//                       className={`relative overflow-hidden rounded-xl border ${
//                         selectedCourse === course.id
//                           ? "border-yellow-400 ring-2 ring-yellow-400/50"
//                           : "border-white/20"
//                       } hover:border-white/40 transition-all duration-300 cursor-pointer`}
//                       onClick={() => setSelectedCourse(course.id)}
//                     >
//                       {selectedCourse === course.id && (
//                         <div className="absolute top-3 right-3 bg-yellow-400 text-black p-1 rounded-full z-10">
//                           <BadgeCheck size={18} />
//                         </div>
//                       )}

//                       {course.discount > 0 && (
//                         <div className="absolute -top-1 -right-1 bg-green-500 text-white font-bold py-1 px-3 rounded-bl-lg transform rotate-12 shadow-md z-10">
//                           -{course.discount}%
//                         </div>
//                       )}

//                       <div className="p-5 bg-gradient-to-br from-purple-900/50 to-purple-700/30 backdrop-blur-sm">
//                         <h4 className="text-xl font-bold text-white mb-4">
//                           {course.name}
//                         </h4>

//                         <div className="flex items-center gap-2 text-white/70 mb-4">
//                           <div className="flex items-center gap-1">
//                             <User size={14} />
//                             <span className="text-sm">
//                               {batch?.name || "Current Batch"}
//                             </span>
//                           </div>
//                         </div>

//                         <div className="flex flex-col gap-2 mt-6">
//                           <div className="text-white/90 flex justify-between">
//                             <span>মূল মূল্য:</span>
//                             <span
//                               className={
//                                 course.discount > 0
//                                   ? "line-through text-white/60"
//                                   : ""
//                               }
//                             >
//                               ৳{course.price.toLocaleString()}
//                             </span>
//                           </div>

//                           {course.discount > 0 && (
//                             <div className="text-white/90 flex justify-between">
//                               <span>ডিসকাউন্ট:</span>
//                               <span className="text-green-400">
//                                 -{course.discount}%
//                               </span>
//                             </div>
//                           )}

//                           {course.paymentCharge > 0 && (
//                             <div className="text-white/90 flex justify-between">
//                               <span>পেমেন্ট চার্জ:</span>
//                               <span>৳{course.paymentCharge}</span>
//                             </div>
//                           )}

//                           <div className="mt-2 pt-2 border-t border-white/20 flex justify-between items-center">
//                             <span className="font-medium text-white">
//                               সর্বমোট:
//                             </span>
//                             <span className="text-xl font-bold text-yellow-300">
//                               ৳{totalPrice.toLocaleString()}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Payment Method Section */}
//             <div className="bg-[#370165]/60 backdrop-blur-md p-8 border-b border-white/20">
//               <h3 className="font-bold text-2xl text-white mb-6 flex items-center gap-2">
//                 <span className="bg-white/20 p-1.5 rounded-md">
//                   <CreditCard size={20} className="text-yellow-300" />
//                 </span>
//                 পেমেন্ট নাম্বার সমূহ
//               </h3>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-xl border border-white/20 hover:border-white/30 transition-all duration-300 transform hover:-translate-y-1">
//                   <div className="flex items-center gap-3 mb-4">
//                     <div className="bg-white rounded-full p-2">
//                       <Image
//                         src="/bkash.svg"
//                         alt="Bkash Logo"
//                         width={36}
//                         height={36}
//                         className="w-8 h-8"
//                         priority
//                       />
//                     </div>
//                     <p className="font-bold text-white text-xl">বিকাশ</p>
//                   </div>

//                   <div className="mt-4 bg-white/10 p-3 rounded-lg">
//                     <p className="font-medium text-white text-lg">
//                       01830327579
//                     </p>
//                     <p className="text-sm text-white/70 mt-1">
//                       এজেন্ট — [কাশ আউট]
//                     </p>
//                   </div>
//                 </div>

//                 <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-xl border border-white/20 hover:border-white/30 transition-all duration-300 transform hover:-translate-y-1">
//                   <div className="flex items-center gap-3 mb-4">
//                     <div className="bg-white rounded-full p-2">
//                       <Image
//                         src="/rocket.svg"
//                         alt="Rocket Logo"
//                         width={36}
//                         height={36}
//                         className="w-8 h-8"
//                         priority
//                       />
//                     </div>
//                     <p className="font-bold text-white text-xl">রকেট</p>
//                   </div>

//                   <div className="mt-4 bg-white/10 p-3 rounded-lg">
//                     <p className="font-medium text-white text-lg">
//                       01821813339
//                     </p>
//                     <p className="text-sm text-white/70 mt-1">
//                       পার্সোনাল — [সেন্ড মানি]
//                     </p>
//                   </div>
//                 </div>

//                 <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-xl border border-white/20 hover:border-white/30 transition-all duration-300 transform hover:-translate-y-1">
//                   <div className="flex items-center gap-3 mb-4">
//                     <div className="bg-white rounded-full p-2">
//                       <Image
//                         src="/nagad.svg"
//                         alt="Nagad Logo"
//                         width={36}
//                         height={36}
//                         className="w-8 h-8"
//                         priority
//                       />
//                     </div>
//                     <p className="font-bold text-white text-xl">নগদ</p>
//                   </div>

//                   <div className="mt-4 bg-white/10 p-3 rounded-lg">
//                     <p className="font-medium text-white text-lg">
//                       01639438893
//                     </p>
//                     <p className="text-sm text-white/70 mt-1">
//                       পার্সোনাল — [সেন্ড মানি]
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-6 p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
//                 <p className="text-yellow-300 flex items-center gap-2">
//                   <Send size={16} className="flex-shrink-0" />
//                   <span>
//                     পেমেন্ট করার পর এই ফর্মটি পূরণ করুন। আপনার পেমেন্ট ৬ ঘন্টার
//                     মধ্যে যাচাই করা হবে।
//                   </span>
//                 </p>
//               </div>
//             </div>

//             {/* Registration Form Section */}
//             <div className="bg-gradient-to-b from-[#370165]/40 to-[#2D014C]/60 p-8 backdrop-blur-lg">
//               <AppForm
//                 resolver={zodResolver(courseRegistrationSchema)}
//                 onSubmit={onSubmit}
//                 defaultValues={{
//                   amount: getSelectedCourseAmount(),
//                 }}
//               >
//                 <div className="space-y-10">
//                   {/* Personal Information */}
//                   <div>
//                     <h3 className="font-bold text-2xl text-white mb-6 flex items-center gap-2">
//                       <span className="bg-white/20 p-1.5 rounded-md">
//                         <User size={20} className="text-yellow-300" />
//                       </span>
//                       ব্যক্তিগত তথ্য
//                     </h3>

//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                       <TextInput
//                         label="নাম"
//                         name="name"
//                         placeholder="আপনার নাম লিখুন"
//                         icon={User}
//                         labelClassName="text-white font-medium"
//                       />
//                       <TextInput
//                         label="মোবাইল নাম্বার"
//                         name="phone"
//                         placeholder="আপনার মোবাইল নাম্বার লিখুন"
//                         icon={Phone}
//                         labelClassName="text-white font-medium"
//                       />
//                       <TextInput
//                         label="ইমেইল"
//                         name="email"
//                         placeholder="আপনার ইমেইল লিখুন"
//                         icon={Mail}
//                         labelClassName="text-white font-medium"
//                       />
//                       <TextInput
//                         label="হোয়াটসঅ্যাপ (ঐচ্ছিক)"
//                         name="whatsapp"
//                         placeholder="আপনার হোয়াটসঅ্যাপ নাম্বার"
//                         icon={MessageSquare}
//                         labelClassName="text-white font-medium"
//                       />
//                       <TextInput
//                         label="ফেসবুক (ঐচ্ছিক)"
//                         name="facebook"
//                         placeholder="আপনার ফেসবুক প্রোফাইল"
//                         icon={Facebook}
//                         labelClassName="text-white font-medium"
//                       />
//                       <FormSelectInput
//                         label="কোর্স নির্বাচন করুন"
//                         name="course"
//                         options={courseOptions}
//                         labelClassName="text-white font-medium"
//                       />
//                     </div>
//                   </div>

//                   {/* Payment Information */}
//                   <div>
//                     <h3 className="font-bold text-2xl text-white mb-6 flex items-center gap-2">
//                       <span className="bg-white/20 p-1.5 rounded-md">
//                         <CreditCard size={20} className="text-yellow-300" />
//                       </span>
//                       পেমেন্ট তথ্য
//                     </h3>

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                       <TextInput
//                         label="টাকার পরিমাণ"
//                         name="amount"
//                         placeholder="টাকার পরিমাণ লিখুন"
//                         icon={CreditCard}
//                         labelClassName="text-white font-medium"
//                         value={getSelectedCourseAmount()}
//                       />
//                       <FormSelectInput
//                         label="পেমেন্ট মেথড"
//                         name="paymentMethod"
//                         options={paymentMethods}
//                         labelClassName="text-white font-medium"
//                       />
//                       <TextInput
//                         label="সেন্ডারের নম্বর"
//                         name="senderNumber"
//                         placeholder="যে নাম্বার থেকে টাকা পাঠিয়েছেন"
//                         icon={Send}
//                         labelClassName="text-white font-medium"
//                       />
//                     </div>
//                   </div>

//                   <div className="pt-6 flex justify-center">
//                     <SubmitButton
//                       title="ভর্তি সম্পন্ন করুন"
//                       loadingTitle="প্রক্রিয়া চলছে..."
//                       loading={loading}
//                       className="px-10 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-bold rounded-lg transition-all duration-300 shadow-lg text-xl flex items-center gap-2"
//                       loaderIcon={ArrowRight}
//                     />
//                   </div>
//                 </div>
//               </AppForm>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }




const RegistrationForm = () => {
  return (
    <div>
      
    </div>
  );
};

export default RegistrationForm;