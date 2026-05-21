
// "use client"
// import { useForm, useFieldArray, Controller } from 'react-hook-form';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import StepTitle from './stepTitle';
// import { useCreateMeetingIdMutation } from '@/redux/api/startMettingApi/startMettingApi';
// import { RootState } from '@/redux/store';
// import { useDispatch, useSelector } from 'react-redux';
// import DashboardButton from '../shared/dashboardButton/DashboardButton';
// import { toast } from 'sonner';
// import Cookies from "js-cookie";
// import { useActiveSubscriptionQuery } from '@/redux/api/subscriptionApi/subscriptionApi';
// import { setMeetingPayload } from "@/redux/features/startMeeting/startMeetingSlice";
// import { useSearchParams } from 'next/navigation';
// import { useState } from 'react';

// // Define form types
// type Question = { value: string };
// type FormValues = {
//   meetingGoal: string;
//   personality: string;
//   difficulty: string;
//   sales_methodology: string;
//   duration: string;
//   questions: Question[];
// };

// export default function MeetingPrepForm(
//   { handleNext, handlePrev }: { handleNext: () => void; handlePrev: () => void }
// ) {

//   const dispatch = useDispatch()
//   const [isSuccess, setIsSuccess] = useState(false);
//   const searchParams = useSearchParams()
//   const companyIdFromParams = searchParams.get("id")

//   // Active subscription
//   const { data: activeSubcripiton } = useActiveSubscriptionQuery("")
//   const status = activeSubcripiton?.data?.plan?.status;

//   // Redux data
//   const allData = useSelector((state: RootState) => state.startMeeting);
//   const representatives = allData?.participants;
//   const salesperson_id = allData?.product?.salesperson_id;
//   const companyId = companyIdFromParams || allData?.companyData?.company_id;

//   const [createMeetingId, { isLoading }] = useCreateMeetingIdMutation();

//   // React Hook Form setup
//   const { register, control, handleSubmit, formState: { errors } } = useForm<FormValues>({
//     defaultValues: {
//       meetingGoal: 'Discovery',
//       questions: [],
//       personality: 'nice',
//       difficulty: 'intermediate',
//       sales_methodology: "MEDDIC",
//       duration: '5 minutes'
//     }
//   });

//   // Field array for questions
//   const { fields, append, remove, replace } = useFieldArray({
//     control,
//     name: 'questions'
//   });

//   // Submit function
//   const onSubmit = async (data: FormValues) => {
//     const lastVoiceId = Cookies.get("last_voice_id");

//     const payload = {
//       salesperson_id: salesperson_id,
//       company_id: companyId,
//       meeting_mode: lastVoiceId,
//       status: status,
//       representatives: representatives,
//       sales_methodology: data.sales_methodology,
//       meeting_goal: data.meetingGoal,
//       personality: data.personality,
//       duration_minutes: parseInt(data.duration) || 15,
//       difficulty: data.difficulty,
//     };

//     dispatch(setMeetingPayload(payload))

//     try {
//       const response = await createMeetingId(payload).unwrap()
//       if (response?.success) {
//         Cookies.set("meetingId", response.data.meeting_id);
//         toast.success(response.message)

//         // Set dynamic questions in form
//         const questionsFromAPI = response.data.top_5_questions.map((q: string, index: number) => ({
//           id: index,
//           value: q
//         }));

//         replace(questionsFromAPI);
//         setIsSuccess(true)
//       }
//     } catch (error: any) {
//       toast.error("Something went wrong")
//     }
//   };

//   const handleBack = () => {
//     handlePrev();
//   };

//   return (
//     <div className="bg-white rounded-lg w-full p-6 border border-[#D1D6DB]">
//       <StepTitle title="Meeting Objective" subtitle="Define your goals and strategy" />

//       <form onSubmit={handleSubmit(onSubmit)}>
//         {/* Meeting Goal */}
//         <div className='mb-6'>
//           <label className="block text-sm font-medium text-[#2D2D2D] mb-2.5">
//             Meeting Goal
//           </label>
//           <Controller
//             name="meetingGoal"
//             control={control}
//             render={({ field }) => (
//               <Select onValueChange={field.onChange} value={field.value}>
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="Discovery" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Discovery">Discovery</SelectItem>
//                   <SelectItem value="Follow">Follow up Meeting </SelectItem>
//                   <SelectItem value="Demo">Demo</SelectItem>
//                   <SelectItem value="Closing">Closing </SelectItem>
//                 </SelectContent>
//               </Select>
//             )}
//           />
//         </div>

//         {/* Top 5 Questions */}
//         {/* Top 5 Questions */}
//         {isSuccess && (
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-[#2D2D2D] mb-2.5">
//               Top 5 Discovery Questions
//             </label>
//             <div className="space-y-3">
//               {fields.map((field, index) => (
//                 <div key={field.id} className="flex gap-3">
//                   <input
//                     type="text"
//                     {...register(`questions.${index}.value` as const, { required: "Question is required" })}
//                     placeholder="Enter your question"
//                     className="flex-1 px-3 py-2.5 text-[#636F85] text-sm border border-[#D1D6DB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#6E51E0] focus:border-transparent"
//                     defaultValue={field.value}
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Personality & Difficulty */}
//         <div className="grid grid-cols-2 gap-4 mb-6">
//           <div>
//             <label className="block text-sm font-medium text-[#2D2D2D] mb-2.5">Personality</label>
//             <Controller
//               name="personality"
//               control={control}
//               render={({ field }) => (
//                 <Select onValueChange={field.onChange} value={field.value}>
//                   <SelectTrigger className="w-full">
//                     <SelectValue placeholder="Select personality" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="angry">Angry</SelectItem>
//                     <SelectItem value="arrogant">Arrogant</SelectItem>
//                     <SelectItem value="soft">Soft</SelectItem>
//                     <SelectItem value="cold_hearted">Cold Hearted</SelectItem>
//                     <SelectItem value="nice">Nice</SelectItem>
//                     <SelectItem value="cool">Cool</SelectItem>
//                     <SelectItem value="not_well">Not Well</SelectItem>
//                     <SelectItem value="analytical">Analytical</SelectItem>
//                     <SelectItem value="professional">Professional</SelectItem>
//                     <SelectItem value="casual">Casual</SelectItem>
//                     <SelectItem value="direct">Direct</SelectItem>
//                   </SelectContent>
//                 </Select>
//               )}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-[#2D2D2D] mb-2.5">Difficulty Level</label>
//             <Controller
//               name="difficulty"
//               control={control}
//               render={({ field }) => (
//                 <Select onValueChange={field.onChange} value={field.value}>
//                   <SelectTrigger className="w-full">
//                     <SelectValue placeholder="Select difficulty" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="beginner">Beginner</SelectItem>
//                     <SelectItem value="intermediate">Intermediate</SelectItem>
//                     <SelectItem value="advanced">Advanced</SelectItem>
//                     <SelectItem value="expert">Expert</SelectItem>
//                   </SelectContent>
//                 </Select>
//               )}
//             />
//           </div>
//         </div>

//         {/* Sales Methodology & Duration */}
//         <div className="grid grid-cols-2 gap-4 mb-6">
//           <div>
//             <label className="block text-sm font-medium text-[#2D2D2D] mb-2.5">Sales Methodology</label>
//             <Controller
//               name="sales_methodology"
//               control={control}
//               render={({ field }) => (
//                 <Select onValueChange={field.onChange} value={field.value}>
//                   <SelectTrigger className="w-full">
//                     <SelectValue placeholder="MEDDIC" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="MEDDIC">MEDDIC</SelectItem>
//                     <SelectItem value="Challenger Sales">Challenger Sales</SelectItem>
//                     <SelectItem value="BANT">BANT</SelectItem>
//                     <SelectItem value="SPIN Selling">SPIN Selling</SelectItem>
//                     <SelectItem value="MEDDPICC">MEDDPICC</SelectItem>
//                     <SelectItem value="Value Selling">Value Selling</SelectItem>
//                   </SelectContent>
//                 </Select>
//               )}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-[#2D2D2D] mb-2.5">Meeting Duration</label>
//             <Controller
//               name="duration"
//               control={control}
//               render={({ field }) => (
//                 <Select onValueChange={field.onChange} value={field.value}>
//                   <SelectTrigger className="w-full">
//                     <SelectValue placeholder="5 minutes" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {Array.from({ length: 12 }, (_, i) => 5 + i * 5).map(min => (
//                       <SelectItem key={min} value={`${min} minutes`}>{min} minutes</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               )}
//             />
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-between">
//           <button
//             type="button"
//             onClick={handleBack}
//             className="border border-[#D1D6DB] px-6 py-3 rounded-lg hover:bg-primaryBgColor hover:text-white transition-colors cursor-pointer"
//           >
//             Back
//           </button>

//           {!isSuccess && (
//             <DashboardButton
//               text="Submit"
//               onClick={handleSubmit(onSubmit)}
//               isLoading={isLoading}
//             />
//           )}

//           {isSuccess && (
//             <DashboardButton
//               text="Next Step"
//               onClick={handleNext}
//               isLoading={false}
//             />
//           )}
//         </div>
//       </form>
//     </div>
//   );
// }




"use client"
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import StepTitle from './stepTitle';
import { useCreateMeetingIdMutation } from '@/redux/api/startMettingApi/startMettingApi';
import { RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import DashboardButton from '../shared/dashboardButton/DashboardButton';
import { toast } from 'sonner';
import Cookies from "js-cookie";
import { useActiveSubscriptionQuery } from '@/redux/api/subscriptionApi/subscriptionApi';
import { setMeetingPayload } from "@/redux/features/startMeeting/startMeetingSlice";
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

// Define form types
type Question = { value: string };
type FormValues = {
  meetingGoal: string;
  personality: string;
  difficulty: string;
  sales_methodology: string;
  methodology_description: string;
  duration: string;
  questions: Question[];
};

export default function MeetingPrepForm(
  { handleNext, handlePrev }: { handleNext: () => void; handlePrev: () => void }
) {

  // sales person Id from account destils page
  const salespersonId = Cookies.get("salesperson_id");
  // console.log(salespersonId);

  const dispatch = useDispatch()
  const [isSuccess, setIsSuccess] = useState(false);
  // const searchParams = useSearchParams()
  // const companyIdFromParams = searchParams.get("id")
  const companyIdFromStep2 = Cookies.get("companyId");
  // console.log(companyIdFromStep2, "=======================companyIdFromParams")
  // const [showDescription, setShowDescription] = useState(false);


  // Active subscription
  const { data: activeSubcripiton } = useActiveSubscriptionQuery("")
  const status = activeSubcripiton?.data?.plan?.status;

  // Redux data
  const allData = useSelector((state: RootState) => state.startMeeting);
  const representatives = allData?.participants;
  const salesperson_id = salespersonId ?? allData?.product?.salesperson_id;
  console.log(salesperson_id, "===========salesperson_id from main flow")
  const companyId = companyIdFromStep2 || allData?.companyData?.company_id;

  const [createMeetingId, { isLoading }] = useCreateMeetingIdMutation();

  // React Hook Form setup
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      meetingGoal: "Discovery",
      questions: [],
      personality: "nice",
      difficulty: "intermediate",
      sales_methodology: "MEDDIC",
      methodology_description: "",
      duration: "5 minutes",
    },
  });

  const selectedMethodology = watch("sales_methodology");

  // Field array for questions
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'questions'
  });

  // Submit function
  const onSubmit = async (data: FormValues) => {
    const lastVoiceId = Cookies.get("last_voice_id");

    const payload = {
      salesperson_id: salesperson_id,
      company_id: companyId,
      meeting_mode: lastVoiceId,
      status: status,
      representatives: representatives,
      sales_methodology: data.sales_methodology,
      // methodology_description: data.methodology_description, // ✅ NEW FIELD
      meeting_goal: data.meetingGoal,
      personality: data.personality,
      duration_minutes: parseInt(data.duration) || 5,
      difficulty: data.difficulty,
    };

    dispatch(setMeetingPayload(payload));

    // console.log(payload, "=====================payload")

    try {
      const response = await createMeetingId(payload).unwrap();
      if (response?.success) {
        Cookies.set("meetingId", response.data.meeting_id);
        toast.success(response.message);

        const questionsFromAPI =
          response.data.top_5_questions.map(
            (q: string, index: number) => ({
              id: index,
              value: q,
            })
          );

        replace(questionsFromAPI);
        setIsSuccess(true);
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.response?.data?.message ||
        "Something went wrong";

      toast.success(errorMessage);
    }
  };

  const handleBack = () => {
    handlePrev();
  };

  return (
    <div className="bg-white rounded-lg w-full p-6 border border-[#D1D6DB]">
      <StepTitle title="Meeting Objective" subtitle="Define your goals and strategy" />

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Meeting Goal */}
        <div className='mb-6'>
          <label className="block text-sm font-medium text-[#2D2D2D] mb-2.5">
            Meeting Goal
          </label>
          <Controller
            name="meetingGoal"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Discovery" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Discovery">Discovery</SelectItem>
                  <SelectItem value="Follow">Follow up Meeting </SelectItem>
                  <SelectItem value="Demo">Demo</SelectItem>
                  <SelectItem value="Closing">Closing </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Top 5 Questions */}
        {isSuccess && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#2D2D2D] mb-2.5">
              Top 5 Discovery Questions
            </label>
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-3">
                  <input
                    type="text"
                    {...register(`questions.${index}.value` as const, { required: "Question is required" })}
                    placeholder="Enter your question"
                    className="flex-1 px-3 py-2.5 text-[#636F85] text-sm border border-[#D1D6DB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#6E51E0] focus:border-transparent"
                    defaultValue={field.value}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Personality & Difficulty */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-[#2D2D2D] mb-2.5">Personality</label>
            <Controller
              name="personality"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select personality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="angry">Angry</SelectItem>
                    <SelectItem value="arrogant">Arrogant</SelectItem>
                    <SelectItem value="soft">Soft</SelectItem>
                    <SelectItem value="cold_hearted">Cold Hearted</SelectItem>
                    <SelectItem value="nice">Nice</SelectItem>
                    <SelectItem value="cool">Cool</SelectItem>
                    <SelectItem value="not_well">Not Well</SelectItem>
                    <SelectItem value="analytical">Analytical</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="direct">Direct</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2D2D2D] mb-2.5">Difficulty Level</label>
            <Controller
              name="difficulty"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {/* Sales Methodology & Duration */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2.5">
            Sales Methodology
          </label>

          <Controller
            name="sales_methodology"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(value) => {
                  field.onChange(value)
                  // setShowDescription(true);
                }} // ✅ FIXED
                value={field.value}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MEDDIC">MEDDIC</SelectItem>
                  <SelectItem value="Challenger Sales">Challenger Sales</SelectItem>
                  <SelectItem value="BANT">BANT</SelectItem>
                  <SelectItem value="SPIN Selling">SPIN Selling</SelectItem>
                  <SelectItem value="MEDDPICC">MEDDPICC</SelectItem>
                  <SelectItem value="Value Selling">Value Selling</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          {/* ✅ Show input when selected */}
          {/* {selectedMethodology && ( */}

          {/* {showDescription && (
            <input
              type="text"
              {...register("methodology_description")}
              placeholder="Write methodology description..."
              className="mt-3 w-full px-3 py-2 border rounded-md"
            />
          )} */}
        </div>


        <div className='mb-6'>
          <label className="block text-sm font-medium text-[#2D2D2D] mb-2.5">Meeting Duration</label>
          <Controller
            name="duration"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="5 minutes" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 6 }, (_, i) => 5 + i * 5).map(min => (
                    <SelectItem key={min} value={`${min} minutes`}>{min} minutes</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="border border-[#D1D6DB] px-6 py-3 rounded-lg hover:bg-primaryBgColor hover:text-white transition-colors cursor-pointer"
          >
            Back
          </button>

          {!isSuccess && (
            <DashboardButton
              text="Submit"
              onClick={handleSubmit(onSubmit)}
              isLoading={isLoading}
            />
          )}

          {isSuccess && (
            <DashboardButton
              text="Next Step"
              onClick={handleNext}
              isLoading={false}
            />
          )}
        </div>
      </form>
    </div>
  );
}