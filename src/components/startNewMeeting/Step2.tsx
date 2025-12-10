
// "use client";

// import { useForm, useFieldArray } from "react-hook-form";
// import { X, Plus } from "lucide-react";
// import { useState } from "react";

// export default function Step2() {
//   const { register, control, handleSubmit, setValue, watch } = useForm({
//     defaultValues: {
//       participants: [
//         {
//           name: "",
//           role: "",
//           tenure: "",
//           personality: [],
//           note: "",
//           decisionMaker: false,
//           linkedin: "",
//         },
//       ],
//     },
//   });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "participants",
//   });

//   const participants = watch("participants");

//   // Store input per participant for adding personality traits
//   const [inputs, setInputs] = useState<{ [key: number]: string }>({});

//   const onSubmit = (data: any) => {
//     console.log("Final Submitted Data:", data);
//   };

//   const handleAddTrait = (
//     index: number,
//     trait: string,
//     setInput: (v: string) => void
//   ) => {
//     if (!trait.trim()) return;
//     const newTraits = [...participants[index].personality, trait.trim()];
//     setValue(`participants.${index}.personality`, newTraits);
//     setInput("");
//   };

//   const handleRemoveTrait = (index: number, traitIndex: number) => {
//     const newTraits = participants[index].personality.filter(
//       (_: any, i: number) => i !== traitIndex
//     );
//     setValue(`participants.${index}.personality`, newTraits);
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <div className="space-y-2">
//         <h2 className="text-xl font-semibold text-[#2D2D2D]">
//           Who Are You Meeting?
//         </h2>
//         <p className="text-[16px] text-[#636F85] mb-4">
//           Add information about meeting participants
//         </p>

//         {fields.map((item, index) => (
//           <div
//             key={item.id}
//             className="border border-[#D1D6DB] rounded-xl p-6 bg-white hover:shadow-sm transition-shadow relative"
//           >
//             {/* Header */}
//             <div className="flex justify-between mb-4">
//               <h3 className="font-semibold text-[#2D2D2D] text-xl">
//                 Participant {index + 1}
//               </h3>

//               {fields.length > 1 && (
//                 <button
//                   type="button"
//                   onClick={() => remove(index)}
//                   className="text-[#64748B] hover:text-[#64748B] cursor-pointer"
//                 >
//                   <X size={24} />
//                 </button>
//               )}
//             </div>

//             {/* Name + Role */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm font-medium text-[#2D2D2D]">Name</label>
//                 <input
//                   className="w-full border border-[#D1D6DB] mt-1 rounded-md px-3 py-2 focus:outline-none focus:border-[#6E51E0]"
//                   placeholder="Sarah Miller"
//                   {...register(`participants.${index}.name`)}
//                 />
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-[#2D2D2D]">Role</label>
//                 <input
//                   className="w-full border border-[#D1D6DB] mt-1 rounded-md px-3 py-2 focus:outline-none focus:border-[#6E51E0]"
//                   placeholder="CMO"
//                   {...register(`participants.${index}.role`)}
//                 />
//               </div>
//             </div>

//             {/* Tenure + Personality */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
//               <div>
//                 <label className="text-sm font-medium text-[#2D2D2D]">Tenure Months</label>
//                 <input
//                   className="w-full border border-[#D1D6DB] mt-1 rounded-md px-3 py-2 focus:outline-none focus:border-[#6E51E0]"
//                   placeholder="12"
//                   {...register(`participants.${index}.tenure`)}
//                 />
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-[#2D2D2D]">
//                   Personality Traits
//                 </label>
//                 {/* Input to add trait */}
//                 <input
//                   type="text"
//                   value={inputs[index] || ""}
//                   onChange={(e) =>
//                     setInputs((prev) => ({ ...prev, [index]: e.target.value }))
//                   }
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       e.preventDefault();
//                       handleAddTrait(index, inputs[index] || "", (v) =>
//                         setInputs((prev) => ({ ...prev, [index]: v }))
//                       );
//                     }
//                   }}
//                   placeholder="Add trait & press Enter"
//                   className="w-full border border-[#D1D6DB] mt-1 rounded-md px-3 py-2 focus:outline-none focus:border-[#6E51E0]"
//                 />
//                 <div className="flex gap-2 flex-wrap mt-2">
//                   {participants[index].personality.map((tag: string, i: number) => (
//                     <span
//                       key={i}
//                       className="bg-[#F4F0FF] text-[#9B6AFD] px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1"
//                     >
//                       {tag}
//                       <button
//                         type="button"
//                         onClick={() => handleRemoveTrait(index, i)}
//                         className="hover:text-purple-900"
//                       >
//                         <X size={14} />
//                       </button>
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Note */}
//             <div className="mt-4">
//               <label className="text-sm font-medium text-[#2D2D2D]">Note</label>
//               <textarea
//                 className="w-full border border-[#D1D6DB] rounded-md px-3 py-2 mt-1 focus:outline-none focus:border-[#6E51E0]"
//                 placeholder="write note here..."
//                 rows={3}
//                 {...register(`participants.${index}.note`)}
//               />
//             </div>

//             {/* Decision Maker */}
//             <div className="mt-4 flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 className="w-4 h-4"
//                 {...register(`participants.${index}.decisionMaker`)}
//               />
//               <label className="text-sm">Is Decision Maker?</label>
//             </div>

//             {/* LinkedIn */}
//             <div className="mt-4">
//               <label className="text-sm font-medium text-[#2D2D2D]">LinkedIn Profile</label>
//               <input
//                 className="w-full border border-[#D1D6DB] mt-1 rounded-md px-3 py-2 focus:outline-none focus:border-[#6E51E0]"
//                 placeholder="https://linkedin.com/..."
//                 {...register(`participants.${index}.linkedin`)}
//               />
//             </div>
//           </div>
//         ))}

//         {/* Add another participant */}
//         <button
//           type="button"
//           onClick={() =>
//             append({
//               name: "",
//               role: "",
//               tenure: "",
//               personality: [],
//               note: "",
//               decisionMaker: false,
//               linkedin: "",
//             })
//           }
//           className="w-full text-center py-3 border rounded-md flex items-center justify-center gap-2 text-[#6E51E0] hover:border-[#6E51E0] font-medium hover:bg-gray-50 mt-6 cursor-pointer"
//         >
//           <Plus size={24} className="text-[#2D2D2D]" />{" "}
//           <span className="text-[16px] text-[#2D2D2D]">Add Another Participant</span>
//         </button>

//         {/* Footer Buttons */}
//         <div className="flex justify-between mt-6">
//           <button type="button" className="border px-6 py-3 rounded-lg">
//             Back
//           </button>

//           <button type="submit" className="bg-[#6E51E0] text-white px-6 py-3 rounded-lg">
//             Next Step
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// }



"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { X, Plus } from "lucide-react";
import { useState } from "react";

// Define types for participants and form
type Participant = {
  name: string;
  role: string;
  tenure: string;
  personality: string[];
  note: string;
  decisionMaker: boolean;
  linkedin: string;
};

type FormValues = {
  participants: Participant[];
};

export default function Step2() {
  // Initialize useForm with proper type
  const { register, control, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      participants: [
        {
          name: "",
          role: "",
          tenure: "",
          personality: [],
          note: "",
          decisionMaker: false,
          linkedin: "",
        },
      ],
    },
  });

  // Setup useFieldArray
  const { fields, append, remove } = useFieldArray({
    control,
    name: "participants",
  });

  const participants = watch("participants");

  // Track input for each participant's personality traits
  const [inputs, setInputs] = useState<{ [key: number]: string }>({});

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    console.log("Final Submitted Data:", data);
  };

  // Add a personality trait
  const handleAddTrait = (
    index: number,
    trait: string,
    setInput: (v: string) => void
  ) => {
    if (!trait.trim()) return;
    const newTraits = [...participants[index].personality, trait.trim()];
    setValue(`participants.${index}.personality`, newTraits);
    setInput("");
  };

  // Remove a personality trait
  const handleRemoveTrait = (index: number, traitIndex: number) => {
    const newTraits = participants[index].personality.filter(
      (_: string, i: number) => i !== traitIndex
    );
    setValue(`participants.${index}.personality`, newTraits);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-[#2D2D2D]">
          Who Are You Meeting?
        </h2>
        <p className="text-[16px] text-[#636F85] mb-4">
          Add information about meeting participants
        </p>

        {fields.map((item, index) => (
          <div
            key={item.id}
            className="border border-[#D1D6DB] rounded-xl p-6 bg-white hover:shadow-sm transition-shadow relative"
          >
            {/* Header */}
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold text-[#2D2D2D] text-xl">
                Participant {index + 1}
              </h3>

              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-[#64748B] hover:text-[#64748B] cursor-pointer"
                >
                  <X size={24} />
                </button>
              )}
            </div>

            {/* Name + Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[#2D2D2D]">Name</label>
                <input
                  className="w-full border border-[#D1D6DB] mt-1 rounded-md px-3 py-2 focus:outline-none focus:border-[#6E51E0]"
                  placeholder="Sarah Miller"
                  {...register(`participants.${index}.name`)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#2D2D2D]">Role</label>
                <input
                  className="w-full border border-[#D1D6DB] mt-1 rounded-md px-3 py-2 focus:outline-none focus:border-[#6E51E0]"
                  placeholder="CMO"
                  {...register(`participants.${index}.role`)}
                />
              </div>
            </div>

            {/* Tenure + Personality */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm font-medium text-[#2D2D2D]">Tenure Months</label>
                <input
                  className="w-full border border-[#D1D6DB] mt-1 rounded-md px-3 py-2 focus:outline-none focus:border-[#6E51E0]"
                  placeholder="12"
                  {...register(`participants.${index}.tenure`)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#2D2D2D]">
                  Personality Traits
                </label>
                <input
                  type="text"
                  value={inputs[index] || ""}
                  onChange={(e) =>
                    setInputs((prev) => ({ ...prev, [index]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTrait(index, inputs[index] || "", (v) =>
                        setInputs((prev) => ({ ...prev, [index]: v }))
                      );
                    }
                  }}
                  placeholder="Add trait & press Enter"
                  className="w-full border border-[#D1D6DB] mt-1 rounded-md px-3 py-2 focus:outline-none focus:border-[#6E51E0]"
                />
                <div className="flex gap-2 flex-wrap mt-2">
                  {participants[index].personality.map((tag: string, i: number) => (
                    <span
                      key={i}
                      className="bg-[#F4F0FF] text-[#9B6AFD] px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTrait(index, i)}
                        className="hover:text-purple-900"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="mt-4">
              <label className="text-sm font-medium text-[#2D2D2D]">Note</label>
              <textarea
                className="w-full border border-[#D1D6DB] rounded-md px-3 py-2 mt-1 focus:outline-none focus:border-[#6E51E0]"
                placeholder="write note here..."
                rows={3}
                {...register(`participants.${index}.note`)}
              />
            </div>

            {/* Decision Maker */}
            <div className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4"
                {...register(`participants.${index}.decisionMaker`)}
              />
              <label className="text-sm">Is Decision Maker?</label>
            </div>

            {/* LinkedIn */}
            <div className="mt-4">
              <label className="text-sm font-medium text-[#2D2D2D]">LinkedIn Profile</label>
              <input
                className="w-full border border-[#D1D6DB] mt-1 rounded-md px-3 py-2 focus:outline-none focus:border-[#6E51E0]"
                placeholder="https://linkedin.com/..."
                {...register(`participants.${index}.linkedin`)}
              />
            </div>
          </div>
        ))}

        {/* Add another participant */}
        <button
          type="button"
          onClick={() =>
            append({
              name: "",
              role: "",
              tenure: "",
              personality: [],
              note: "",
              decisionMaker: false,
              linkedin: "",
            })
          }
          className="w-full text-center py-3 border rounded-md flex items-center justify-center gap-2 text-[#6E51E0] hover:border-[#6E51E0] font-medium hover:bg-gray-50 mt-6 cursor-pointer"
        >
          <Plus size={24} className="text-[#2D2D2D]" />
          <span className="text-[16px] text-[#2D2D2D]">Add Another Participant</span>
        </button>

        {/* Footer Buttons */}
        {/* <div className="flex justify-between mt-6">
          <button type="button" className="border px-6 py-3 rounded-lg">
            Back
          </button>

          <button type="submit" className="bg-[#6E51E0] text-white px-6 py-3 rounded-lg">
            Next Step
          </button>
        </div> */}
      </div>
    </form>
  );
}
