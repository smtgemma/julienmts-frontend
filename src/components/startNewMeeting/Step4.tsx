
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
// import { useState, useRef } from 'react';

// // Methodology core fields data
// const METHODOLOGY_DATA: Record<string, { field: string; definition: string }[]> = {
//   MEDDIC: [
//     { field: "Metrics", definition: "Quantified business impact / ROI" },
//     { field: "Economic Buyer", definition: "Person with final budget authority" },
//     { field: "Decision Criteria", definition: "Factors used to evaluate vendors" },
//     { field: "Decision Process", definition: "Steps to approve purchase" },
//     { field: "Identify Pain", definition: "Main business problem to solve" },
//     { field: "Champion", definition: "Internal advocate pushing your deal" },
//   ],
//   "Challenger Sales": [
//     { field: "Commercial Insight", definition: "New perspective taught to buyer" },
//     { field: "Pain Intensity", definition: "Severity of business issue" },
//     { field: "Change Urgency", definition: "Need to act now" },
//     { field: "Stakeholder Alignment", definition: "Internal agreement across teams" },
//     { field: "Status Quo Cost", definition: "Risk/cost of doing nothing" },
//   ],
//   BANT: [
//     { field: "Budget", definition: "Available spending capacity" },
//     { field: "Authority", definition: "Decision-maker ownership" },
//     { field: "Need", definition: "Clear business requirement" },
//     { field: "Timeline", definition: "Expected buying timeframe" },
//   ],
//   "SPIN Selling": [
//     { field: "Situation", definition: "Current customer environment" },
//     { field: "Problem", definition: "Existing issue/friction" },
//     { field: "Implication", definition: "Business consequences of problem" },
//     { field: "Need-Payoff", definition: "Value of solving the issue" },
//   ],
//   MEDDPICC: [
//     { field: "Metrics", definition: "Quantified business impact" },
//     { field: "Economic Buyer", definition: "Final financial approver" },
//     { field: "Decision Criteria", definition: "Vendor evaluation standards" },
//     { field: "Decision Process", definition: "Internal approval workflow" },
//     { field: "Paper Process", definition: "Procurement/legal contract steps" },
//     { field: "Identify Pain", definition: "Critical business challenge" },
//     { field: "Champion", definition: "Internal supporter influencing deal" },
//     { field: "Competition", definition: "Alternative vendors or status quo" },
//   ],
//   "Value Selling": [
//     { field: "Business Value", definition: "Measurable customer gain" },
//     { field: "ROI", definition: "Financial return expected" },
//     { field: "Customer Goals", definition: "Strategic objectives" },
//     { field: "Pain Cost", definition: "Cost of current problem" },
//     { field: "Success Outcomes", definition: "Desired measurable result" },
//   ],
// };

// // Define form types
// type Question = { value: string };
// type FormValues = {
//   meetingGoal: string;
//   personality: string;
//   difficulty: string;
//   sales_methodology: string;
//   methodology_description: string;
//   duration: string;
//   questions: Question[];
// };

// export default function MeetingPrepForm(
//   { handleNext, handlePrev }: { handleNext: () => void; handlePrev: () => void }
// ) {

//   // sales person Id from account destils page
//   const rawSalespersonId = Cookies.get("salesperson_id");
//   const salespersonId = (rawSalespersonId === "undefined" || rawSalespersonId === "null" || !rawSalespersonId)
//     ? undefined
//     : rawSalespersonId;
//   // console.log(salespersonId);

//   const dispatch = useDispatch()
//   const [isSuccess, setIsSuccess] = useState(false);
//   const savedPayloadRef = useRef<any>(null);
//   // const searchParams = useSearchParams()
//   // const companyIdFromParams = searchParams.get("id")
//   const companyIdFromStep2 = Cookies.get("companyId");
//   // console.log(companyIdFromStep2, "=======================companyIdFromParams")
//   // const [showDescription, setShowDescription] = useState(false);


//   // Active subscription
//   const { data: activeSubcripiton } = useActiveSubscriptionQuery("")
//   const status = activeSubcripiton?.data?.plan?.status;

//   // Redux data
//   const allData = useSelector((state: RootState) => state.startMeeting);
//   const representatives = allData?.participants;
//   const salesperson_id = salespersonId ?? allData?.product?.salesperson_id;
//   console.log("salesperson_id:", salesperson_id, "| from cookie:", salespersonId, "| from redux:", allData?.product?.salesperson_id)
//   const companyId = companyIdFromStep2 || allData?.companyData?.company_id;

//   const [createMeetingId, { isLoading }] = useCreateMeetingIdMutation();

//   // React Hook Form setup
//   const { register, control, handleSubmit, watch, getValues, formState: { errors } } = useForm<FormValues>({
//     defaultValues: {
//       meetingGoal: "Discovery",
//       questions: [],
//       personality: "nice",
//       difficulty: "intermediate",
//       sales_methodology: "MEDDIC",
//       methodology_description: "",
//       duration: "5 minutes",
//     },
//   });

//   const selectedMethodology = watch("sales_methodology");

//   // Field array for questions
//   const { fields, append, remove, replace } = useFieldArray({
//     control,
//     name: 'questions'
//   });

//   // Submit function
//   const onSubmit = async (data: FormValues) => {
//     const lastVoiceId = Cookies.get("last_voice_id");

//     // Guard: salesperson_id must exist
//     if (!salesperson_id) {
//       toast.error("Salesperson profile not found. Please complete Step 1 first.");
//       return;
//     }

//     const payload = {
//       salesperson_id: salesperson_id,
//       company_id: companyId,
//       meeting_mode: lastVoiceId,
//       status: status,
//       representatives: representatives,
//       sales_methodology: data.sales_methodology,
//       // methodology_description: data.methodology_description, // ✅ NEW FIELD
//       meeting_goal: data.meetingGoal,
//       personality: data.personality,
//       duration_minutes: parseInt(data.duration) || 5,
//       difficulty: data.difficulty,
//     };

//     dispatch(setMeetingPayload(payload));

//     // console.log(payload, "=====================payload")

//     try {
//       const response = await createMeetingId(payload).unwrap();
//       if (response?.success) {
//         Cookies.set("meetingId", response.data.meeting_id);
//         toast.success(response.message);

//         const questionsFromAPI =
//           response.data.top_5_questions.map(
//             (q: string, index: number) => ({
//               id: index,
//               value: q,
//             })
//           );

//         replace(questionsFromAPI);
//         setIsSuccess(true);

//         // Save payload+questions to ref AND Redux
//         const payloadWithQuestions = {
//           ...payload,
//           questions: response.data.top_5_questions,
//         };
//         savedPayloadRef.current = payloadWithQuestions;
//         dispatch(setMeetingPayload(payloadWithQuestions));
//       }
//     } catch (error: any) {
//       const errorMessage =
//         error?.data?.message ||
//         error?.response?.data?.message ||
//         "Something went wrong";

//       toast.error(errorMessage);
//     }
//   };

//   const handleBack = () => {
//     handlePrev();
//   };

//   return (
//     <div className="bg-white rounded-lg w-full p-6 border border-[#D1D6DB]">
//       <StepTitle title="Meeting Objective" subtitle="Define your goals and strategy" />

//       <form onSubmit={handleSubmit(onSubmit)}>


//         {/* Sales Methodology */}
//         <div className="mb-6">
//           <label className="block text-sm font-medium mb-2.5">
//             Sales Methodology
//           </label>

//           <Controller
//             name="sales_methodology"
//             control={control}
//             render={({ field }) => (
//               <Select
//                 onValueChange={field.onChange}
//                 value={field.value}
//               >
//                 <SelectTrigger className="w-full">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="MEDDIC">MEDDIC</SelectItem>
//                   <SelectItem value="Challenger Sales">Challenger Sales</SelectItem>
//                   <SelectItem value="BANT">BANT</SelectItem>
//                   <SelectItem value="SPIN Selling">SPIN Selling</SelectItem>
//                   <SelectItem value="MEDDPICC">MEDDPICC</SelectItem>
//                   <SelectItem value="Value Selling">Value Selling</SelectItem>
//                 </SelectContent>
//               </Select>
//             )}
//           />

//           {/* Methodology Core Fields Table */}
//           {selectedMethodology && METHODOLOGY_DATA[selectedMethodology] && (
//             <div className="mt-4 border border-[#D1D6DB] rounded-lg overflow-hidden">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="bg-[#F5F6FA]">
//                     <th className="text-left px-4 py-3 font-semibold text-[#2D2D2D] w-1/2">Core Field</th>
//                     <th className="text-left px-4 py-3 font-semibold text-[#2D2D2D] w-1/2">Quick Definition</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {METHODOLOGY_DATA[selectedMethodology].map((item, index) => (
//                     <tr
//                       key={index}
//                       className={index % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"}
//                     >
//                       <td className="px-4 py-3 text-[#2D2D2D]">{item.field}</td>
//                       <td className="px-4 py-3 text-[#636F85]">{item.definition}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

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
//         {isSuccess && (
//           <div className="mb-6">
//             <div className="flex items-center justify-between mb-2.5">
//               <label className="block text-sm font-medium text-[#2D2D2D]">
//                 Top 5 Questions
//               </label>
//               <button
//                 type="button"
//                 onClick={() => append({ value: "" })}
//                 className="flex items-center gap-1.5 text-sm text-[#6E51E0] font-medium hover:opacity-80 transition-opacity cursor-pointer"
//               >
//                 <span className="text-lg leading-none">+</span> Add Question
//               </button>
//             </div>
//             <div className="space-y-3">
//               {fields.map((field, index) => (
//                 <div key={field.id} className="flex gap-2 items-center">
//                   <input
//                     type="text"
//                     {...register(`questions.${index}.value` as const, { required: "Question is required" })}
//                     placeholder="Enter your question"
//                     className="flex-1 px-3 py-2.5 text-[#636F85] text-sm border border-[#D1D6DB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#6E51E0] focus:border-transparent"
//                     defaultValue={field.value}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => remove(index)}
//                     className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md border border-[#D1D6DB] text-[#636F85] hover:border-red-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
//                     title="Remove question"
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                       <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
//                     </svg>
//                   </button>
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

//         <div className='mb-6'>
//           <label className="block text-sm font-medium text-[#2D2D2D] mb-2.5">Meeting Duration</label>
//           <Controller
//             name="duration"
//             control={control}
//             render={({ field }) => (
//               <Select onValueChange={field.onChange} value={field.value}>
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="5 minutes" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {Array.from({ length: 6 }, (_, i) => 5 + i * 5).map(min => (
//                     <SelectItem key={min} value={`${min} minutes`}>{min} minutes</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             )}
//           />
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
//               text="Click for Question"
//               onClick={handleSubmit(onSubmit)}
//               isLoading={isLoading}
//             />
//           )}

//           {isSuccess && (
//             <DashboardButton
//               text="Next Step"
//               onClick={() => {
//                 // Get current questions from form values (includes user edits)
//                 const currentQuestions = getValues("questions")
//                   .map((q) => q.value)
//                   .filter(Boolean);
//                 // Use ref payload (guaranteed to have latest data) + current questions
//                 const base = savedPayloadRef.current || allData?.payloadData;
//                 if (base) {
//                   dispatch(setMeetingPayload({
//                     ...base,
//                     questions: currentQuestions,
//                   }));
//                 }
//                 handleNext();
//               }}
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
import { useState, useRef } from 'react';

// Methodology core fields data
const METHODOLOGY_DATA: Record<string, { field: string; definition: string }[]> = {
  MEDDIC: [
    { field: "Metrics", definition: "Quantified business impact / ROI" },
    { field: "Economic Buyer", definition: "Person with final budget authority" },
    { field: "Decision Criteria", definition: "Factors used to evaluate vendors" },
    { field: "Decision Process", definition: "Steps to approve purchase" },
    { field: "Identify Pain", definition: "Main business problem to solve" },
    { field: "Champion", definition: "Internal advocate pushing your deal" },
  ],
  "Challenger Sales": [
    { field: "Commercial Insight", definition: "New perspective taught to buyer" },
    { field: "Pain Intensity", definition: "Severity of business issue" },
    { field: "Change Urgency", definition: "Need to act now" },
    { field: "Stakeholder Alignment", definition: "Internal agreement across teams" },
    { field: "Status Quo Cost", definition: "Risk/cost of doing nothing" },
  ],
  BANT: [
    { field: "Budget", definition: "Available spending capacity" },
    { field: "Authority", definition: "Decision-maker ownership" },
    { field: "Need", definition: "Clear business requirement" },
    { field: "Timeline", definition: "Expected buying timeframe" },
  ],
  "SPIN Selling": [
    { field: "Situation", definition: "Current customer environment" },
    { field: "Problem", definition: "Existing issue/friction" },
    { field: "Implication", definition: "Business consequences of problem" },
    { field: "Need-Payoff", definition: "Value of solving the issue" },
  ],
  MEDDPICC: [
    { field: "Metrics", definition: "Quantified business impact" },
    { field: "Economic Buyer", definition: "Final financial approver" },
    { field: "Decision Criteria", definition: "Vendor evaluation standards" },
    { field: "Decision Process", definition: "Internal approval workflow" },
    { field: "Paper Process", definition: "Procurement/legal contract steps" },
    { field: "Identify Pain", definition: "Critical business challenge" },
    { field: "Champion", definition: "Internal supporter influencing deal" },
    { field: "Competition", definition: "Alternative vendors or status quo" },
  ],
  "Value Selling": [
    { field: "Business Value", definition: "Measurable customer gain" },
    { field: "ROI", definition: "Financial return expected" },
    { field: "Customer Goals", definition: "Strategic objectives" },
    { field: "Pain Cost", definition: "Cost of current problem" },
    { field: "Success Outcomes", definition: "Desired measurable result" },
  ],
};

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
  const rawSalespersonId = Cookies.get("salesperson_id");
  const salespersonId = (rawSalespersonId === "undefined" || rawSalespersonId === "null" || !rawSalespersonId)
    ? undefined
    : rawSalespersonId;
  // console.log(salespersonId);

  const dispatch = useDispatch()
  const [isSuccess, setIsSuccess] = useState(false);
  const savedPayloadRef = useRef<any>(null);
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
  console.log("salesperson_id:", salesperson_id, "| from cookie:", salespersonId, "| from redux:", allData?.product?.salesperson_id)
  const companyId = companyIdFromStep2 || allData?.companyData?.company_id;

  const [createMeetingId, { isLoading }] = useCreateMeetingIdMutation();

  // React Hook Form setup
  const { register, control, handleSubmit, watch, getValues, formState: { errors } } = useForm<FormValues>({
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

    // Guard: salesperson_id must exist
    if (!salesperson_id) {
      toast.error("Salesperson profile not found. Please complete Step 1 first.");
      return;
    }

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

        // Save payload+questions to ref AND Redux
        const payloadWithQuestions = {
          ...payload,
          questions: response.data.top_5_questions,
        };
        savedPayloadRef.current = payloadWithQuestions;
        dispatch(setMeetingPayload(payloadWithQuestions));
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.response?.data?.message ||
        "Something went wrong";

      toast.error(errorMessage);
    }
  };

  const handleBack = () => {
    handlePrev();
  };

  return (
    <div className="bg-white rounded-lg w-full p-6 border border-[#D1D6DB]">
      {/* <StepTitle title="Meeting Objective" subtitle="Define your goals and strategy" /> */}
      <div className='flex justify-between items-center'>
        <StepTitle title="Meeting Objective" subtitle="Define your goals and strategy" />
          <DashboardButton
            text="Click for Question"
            onClick={handleSubmit(onSubmit)}
            isLoading={isLoading}
          />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>


        {/* Sales Methodology */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2.5">
            Sales Methodology
          </label>

          <Controller
            name="sales_methodology"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
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

          {/* Methodology Core Fields Table */}
          {selectedMethodology && METHODOLOGY_DATA[selectedMethodology] && (
            <div className="mt-4 border border-[#D1D6DB] rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F5F6FA]">
                    <th className="text-left px-4 py-3 font-semibold text-[#2D2D2D] w-1/2">Core Field</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#2D2D2D] w-1/2">Quick Definition</th>
                  </tr>
                </thead>
                <tbody>
                  {METHODOLOGY_DATA[selectedMethodology].map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"}
                    >
                      <td className="px-4 py-3 text-[#2D2D2D]">{item.field}</td>
                      <td className="px-4 py-3 text-[#636F85]">{item.definition}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

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
            <div className="flex items-center justify-between mb-2.5">
              <label className="block text-sm font-medium text-[#2D2D2D]">
                Top 5 Questions
              </label>
              <button
                type="button"
                onClick={() => append({ value: "" })}
                className="flex items-center gap-1.5 text-sm text-[#6E51E0] font-medium hover:opacity-80 transition-opacity cursor-pointer"
              >
                <span className="text-lg leading-none">+</span> Add Question
              </button>
            </div>
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-center">
                  <input
                    type="text"
                    {...register(`questions.${index}.value` as const, { required: "Question is required" })}
                    placeholder="Enter your question"
                    className="flex-1 px-3 py-2.5 text-[#636F85] text-sm border border-[#D1D6DB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#6E51E0] focus:border-transparent"
                    defaultValue={field.value}
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md border border-[#D1D6DB] text-[#636F85] hover:border-red-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Remove question"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                    </svg>
                  </button>
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

          {/* {!isSuccess && (
            <DashboardButton
              text="Click for Question"
              onClick={handleSubmit(onSubmit)}
              isLoading={isLoading}
            />
          )} */}

          {isSuccess && (
            <DashboardButton
              text="Next Step"
              onClick={() => {
                // Get current questions from form values (includes user edits)
                const currentQuestions = getValues("questions")
                  .map((q) => q.value)
                  .filter(Boolean);
                // Use ref payload (guaranteed to have latest data) + current questions
                const base = savedPayloadRef.current || allData?.payloadData;
                if (base) {
                  dispatch(setMeetingPayload({
                    ...base,
                    questions: currentQuestions,
                  }));
                }
                handleNext();
              }}
              isLoading={false}
            />
          )}
        </div>
      </form>
    </div>
  );
}