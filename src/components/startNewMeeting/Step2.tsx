
// "use client";

// import { useForm, useFieldArray, Controller } from "react-hook-form";
// import { X, Plus } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { setParticipantsValue } from "@/redux/features/startMeeting/startMeetingSlice";
// import { useMeetingCompanyRepresentitiveMutation } from "@/redux/api/startMettingApi/startMettingApi";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { RootState } from "@/redux/store";

// type Participant = {
//   name: string;
//   role: string;
//   notes: string;
//   is_decision_maker: boolean;
//   linkedin_profile: string;
// };

// type FormValues = {
//   participants: Participant[];
// };

// export default function Step2({
//   handleNext,
//   handlePrev,
// }: {
//   handleNext: () => void;
//   handlePrev: () => void;
// }) {
//   const dispatch = useDispatch();
//   const allData = useSelector((state: RootState) => state.startMeeting);
//   const companyId = allData?.companyData?.company_id;

//   const [meetingCompanyRepresentitive, { isLoading }] =
//     useMeetingCompanyRepresentitiveMutation();

//   const { register, control, handleSubmit } = useForm<FormValues>({
//     defaultValues: {
//       participants: [
//         {
//           name: "",
//           role: "",
//           notes: "",
//           is_decision_maker: false,
//           linkedin_profile: "",
//         },
//       ],
//     },
//   });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "participants",
//   });

//   const onSubmit = async (data: FormValues) => {
//     // Add voice_id to each participant
//     const payload = data.participants.map((p) => ({
//       ...p,
//       voice_id: "1-on-1",
//     }));

//     try {
//       // Send payload as array with companyId
//       const response = await meetingCompanyRepresentitive({
//         companyId,
//         participants: payload, // ✅ renamed from `body` to match the destructure above
//       }).unwrap();

//       console.log("Response:", response);
//     } catch (error) {
//       console.log("Something went wrong", error);
//     }

//     dispatch(setParticipantsValue(data));
//     handleNext();
//   };

//   return (
//     <div className="py-6">
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="mb-8">
//           <h2 className="text-2xl font-bold text-[#2D2D2D] mb-2">
//             Who Are You Meeting?
//           </h2>
//           <p className="text-[#64748B]">
//             Add information about meeting participants
//           </p>
//         </div>

//         {/* Participants */}
//         {fields.map((item, index) => (
//           <div
//             key={item.id}
//             className="border border-[#D1D6DB] rounded-xl p-6 bg-white"
//           >
//             {/* Header */}
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="font-semibold text-xl">Participant {index + 1}</h3>
//               {fields.length > 1 && (
//                 <button
//                   type="button"
//                   onClick={() => remove(index)}
//                   className="text-gray-500 hover:text-red-500"
//                 >
//                   <X size={22} />
//                 </button>
//               )}
//             </div>

//             {/* Name + Role */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm font-medium">Name</label>
//                 <input
//                   className="w-full border mt-1 rounded-md px-3 py-2"
//                   placeholder="Sarah Miller"
//                   {...register(`participants.${index}.name`)}
//                 />
//               </div>

//               {/* Role Dropdown */}
//               <div>
//                 <label className="text-sm font-medium">Role</label>
//                 <Controller
//                   name={`participants.${index}.role`}
//                   control={control}
//                   render={({ field }) => (
//                     <Select onValueChange={field.onChange} value={field.value}>
//                       <SelectTrigger className="w-full mt-1">
//                         <SelectValue placeholder="Select role" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="ceo">CEO</SelectItem>
//                         <SelectItem value="cmo">CMO</SelectItem>
//                         <SelectItem value="cfo">CFO</SelectItem>
//                         <SelectItem value="coo">COO</SelectItem>
//                         <SelectItem value="cto">CTO</SelectItem>
//                         <SelectItem value="vp_sales">VP Sales</SelectItem>
//                         <SelectItem value="manager">Manager</SelectItem>
//                         <SelectItem value="director">Director</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   )}
//                 />
//               </div>
//             </div>

//             {/* LinkedIn + Notes */}
//             <div className="mt-4">
//               <div>
//                 <label className="text-sm font-medium">LinkedIn Profile</label>
//                 <input
//                   className="w-full border mt-1 rounded-md px-3 py-2"
//                   placeholder="https://linkedin.com/..."
//                   {...register(`participants.${index}.linkedin_profile`)}
//                 />
//               </div>

//               {/* Decision Maker */}
//               <div className="mt-4 flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   {...register(`participants.${index}.is_decision_maker`)}
//                 />
//                 <label className="text-sm">Is Decision Maker?</label>
//               </div>

//               <div className="mt-4">
//                 <label className="text-sm font-medium">Notes</label>
//                 <textarea
//                   className="w-full border rounded-md px-3 py-2 mt-1"
//                   rows={3}
//                   placeholder="Write notes here..."
//                   {...register(`participants.${index}.notes`)}
//                 />
//               </div>
//             </div>
//           </div>
//         ))}

//         {/* Add Participant Button */}
//         <button
//           type="button"
//           onClick={() =>
//             append({
//               name: "",
//               role: "",
//               notes: "",
//               is_decision_maker: false,
//               linkedin_profile: "",
//             })
//           }
//           className="w-full py-3 border rounded-md flex items-center justify-center gap-2 hover:bg-gray-50"
//         >
//           <Plus size={20} />
//           <span>Add Another Participant</span>
//         </button>

//         {/* Footer Buttons */}
//         <div className="flex justify-between mt-8">
//           <button
//             onClick={handlePrev}
//             type="button"
//             className="border px-6 py-3 rounded-lg hover:bg-gray-100"
//           >
//             Back
//           </button>

//           <button
//             onClick={handleSubmit(onSubmit)}
//             disabled={isLoading}
//             className="bg-primaryBgColor text-white px-6 py-3 rounded-lg disabled:opacity-50"
//           >
//             {isLoading ? "Processing..." : "Next Step"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { X, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setParticipantsValue } from "@/redux/features/startMeeting/startMeetingSlice";
import { useMeetingCompanyRepresentitiveMutation } from "@/redux/api/startMettingApi/startMettingApi";
import Cookies from "js-cookie";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RootState } from "@/redux/store";
import { toast } from "sonner";
import DashboardButton from "../shared/dashboardButton/DashboardButton";

type Participant = {
  name: string;
  role: string;
  notes: string;
  is_decision_maker: boolean;
  linkedin_profile: string;
};

type FormValues = {
  participants: Participant[];
};

export default function Step2({
  handleNext,
  handlePrev,
}: {
  handleNext: () => void;
  handlePrev: () => void;
}) {
  const dispatch = useDispatch();
  // take data from redux 
  const allData = useSelector((state: RootState) => state.startMeeting);
  const companyId = allData?.companyData?.company_id;

  const [meetingCompanyRepresentitive, { isLoading }] =
    useMeetingCompanyRepresentitiveMutation();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      participants: [
        {
          name: "",
          role: "",
          notes: "",
          is_decision_maker: false,
          linkedin_profile: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "participants",
  });

  const onSubmit = async (data: FormValues) => {
    const payload = data.participants.map((p) => ({
      ...p,
      voice_id: "1-on-1",
    }));

    try {
      const response = await meetingCompanyRepresentitive({
        companyId,
        participants: payload,
      }).unwrap();
      if (response?.success) {
        toast.success(response?.message)
        // console.log(response, "=======================partice")
        // Cookies.set("representative_ids", response.data.representative_ids);
        dispatch(setParticipantsValue(response?.data?.representative_ids));
        handleNext();
      }
    } catch (error: any) {
      toast.error("Something went wrong", error.message)
    }
  };

  return (
    <div className="py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#2D2D2D] mb-2">
            Who Are You Meeting?
          </h2>
          <p className="text-[#64748B]">
            Add information about meeting participants
          </p>
        </div>

        {/* Participants */}
        {fields.map((item, index) => (
          <div
            key={item.id}
            className="border border-[#D1D6DB] rounded-xl p-6 bg-white"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-xl">Participant {index + 1}</h3>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X size={22} />
                </button>
              )}
            </div>

            {/* Name + Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  className="w-full border mt-1 rounded-md px-3 py-2"
                  placeholder="Sarah Miller"
                  {...register(`participants.${index}.name`, { required: "Name is required" })}
                />
                {errors.participants?.[index]?.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.participants[index].name.message}
                  </p>
                )}
              </div>

              {/* Role Dropdown */}
              <div>
                <label className="text-sm font-medium">Role</label>
                <Controller
                  name={`participants.${index}.role`}
                  control={control}
                  rules={{ required: "Role is required" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ceo">CEO</SelectItem>
                        <SelectItem value="cmo">CMO</SelectItem>
                        <SelectItem value="cfo">CFO</SelectItem>
                        <SelectItem value="coo">COO</SelectItem>
                        <SelectItem value="cto">CTO</SelectItem>
                        <SelectItem value="vp_sales">VP Sales</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="director">Director</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.participants?.[index]?.role && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.participants[index].role.message}
                  </p>
                )}
              </div>
            </div>

            {/* LinkedIn + Notes */}
            <div className="mt-4">
              <div>
                <label className="text-sm font-medium">LinkedIn Profile</label>
                <input
                  className="w-full border mt-1 rounded-md px-3 py-2"
                  placeholder="https://linkedin.com/in/username"
                  {...register(`participants.${index}.linkedin_profile`, {
                    pattern: {
                      value: /^https:\/\/(www\.)?linkedin\.com\/.*$/,
                      message: "Please enter a valid LinkedIn URL",
                    },
                  })}
                />
                {errors.participants?.[index]?.linkedin_profile && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.participants[index].linkedin_profile.message}
                  </p>
                )}
              </div>

              {/* Decision Maker */}
              <div className="mt-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register(`participants.${index}.is_decision_maker`)}
                />
                <label className="text-sm">Is Decision Maker?</label>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium">Notes</label>
                <textarea
                  className="w-full border rounded-md px-3 py-2 mt-1"
                  rows={3}
                  placeholder="Write notes here..."
                  {...register(`participants.${index}.notes`)}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add Participant Button */}
        <button
          type="button"
          onClick={() =>
            append({
              name: "",
              role: "",
              notes: "",
              is_decision_maker: false,
              linkedin_profile: "",
            })
          }
          className="w-full py-3 border rounded-md flex items-center justify-center gap-2 hover:bg-gray-50"
        >
          <Plus size={20} />
          <span>Add Another Participant</span>
        </button>

        {/* Footer Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrev}
            type="button"
            className="border px-6 py-3 rounded-lg hover:bg-gray-100"
          >
            Back
          </button>
          <div className="flex justify-end mt-8">
            <DashboardButton
              text="Next Step"
              onClick={handleSubmit(onSubmit)}
              isLoading={isLoading} // RTK mutation loading state
            />
          </div>
        </div>
      </div>
    </div>
  );
}