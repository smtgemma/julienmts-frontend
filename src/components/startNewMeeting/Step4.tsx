
// // import StepTitle from './stepTitle'

// // function Step4() {
// //   return (
// //     <div>
// //       <StepTitle title='Meeting Objective' subtitle='Define your goals and strategy'/>
// //     </div>
// //   )
// // }

// // export default Step4


// import { useForm, useFieldArray } from 'react-hook-form';
// import { Plus, X } from 'lucide-react';
// import StepTitle from './stepTitle';

// export default function MeetingPrepForm() {
//   const { register, control, handleSubmit, formState: { errors } } = useForm({
//     defaultValues: {
//       meetingGoal: 'Book a Demo',
//       questions: [
//         { value: 'What are your current biggest challenges?' },
//         { value: 'How do you measure success?' },
//         { value: 'What is your timeline for implementation?' },
//         { value: 'Who else is involved in the decision?' },
//         { value: 'What is your budget allocated for this?' }
//       ],
//       personality: 'Nice',
//       difficulty: 'Intermediate',
//       duration: '30 minutes'
//     }
//   });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: 'questions'
//   });

//   const onSubmit = (data: any) => {
//     console.log('Form Data:', data);
//     // Handle form submission here
//   };

//   const handleBack = () => {
//     console.log('Back clicked');
//     // Handle back navigation
//   };

//   return (
//     <div className="bg-gray-50 flex items-center justify-center">
//       <div className="bg-white rounded-lg shadow-sm w-full p-8">
//         {/* header  */}
//         <StepTitle title="Meeting Objective" subtitle="Define your goals and strategy" />

//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Meeting Goal
//             </label>
//             <input
//               type="text"
//               {...register('meetingGoal', { required: 'Meeting goal is required' })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//             />
//             {errors.meetingGoal && (
//               <p className="mt-1 text-sm text-red-600">{errors.meetingGoal.message}</p>
//             )}
//           </div>

//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-3">
//               Top 5 Discovery Questions
//             </label>
//             <div className="space-y-3">
//               {fields.map((field, index) => (
//                 <div key={field.id} className="flex gap-2">
//                   <input
//                     type="text"
//                     {...register(`questions.${index}.value`, {
//                       required: 'Question is required'
//                     })}
//                     placeholder="Enter your question"
//                     className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   />
//                   {fields.length > 1 && (
//                     <button
//                       type="button"
//                       onClick={() => remove(index)}
//                       className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
//                     >
//                       <X size={20} />
//                     </button>
//                   )}
//                 </div>
//               ))}
//             </div>
//             <button
//               type="button"
//               onClick={() => append({ value: '' })}
//               className="mt-3 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
//             >
//               <Plus size={16} />
//               Add Question
//             </button>
//           </div>

//           <div className="grid grid-cols-2 gap-4 mb-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Personality
//               </label>
//               <select
//                 {...register('personality')}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
//               >
//                 <option>Nice</option>
//                 <option>Professional</option>
//                 <option>Casual</option>
//                 <option>Direct</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Difficulty Level
//               </label>
//               <select
//                 {...register('difficulty')}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
//               >
//                 <option>Beginner</option>
//                 <option>Intermediate</option>
//                 <option>Advanced</option>
//                 <option>Expert</option>
//               </select>
//             </div>
//           </div>

//           <div className="mb-8">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Meeting Duration
//             </label>
//             <input
//               type="text"
//               {...register('duration', { required: 'Duration is required' })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//             />
//             {errors.duration && (
//               <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
//             )}
//           </div>

//           <div className="flex justify-between">
//             <button
//               type="button"
//               onClick={handleBack}
//               className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
//             >
//               Back
//             </button>
//             <button
//               type="submit"
//               className="px-6 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
//             >
//               Next Step
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }



import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Plus, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import StepTitle from './stepTitle';

export default function MeetingPrepForm() {
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      meetingGoal: 'Book a Demo',
      questions: [
        { value: 'What are your current biggest challenges?' },
        { value: 'How do you measure success?' },
        { value: 'What is your timeline for implementation?' },
        { value: 'Who else is involved in the decision?' },
        { value: 'What is your budget allocated for this?' }
      ],
      personality: 'Nice',
      difficulty: 'Intermediate',
      duration: '30 minutes'
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions'
  });

  const onSubmit = (data: any) => {
    console.log('Form Data:', data);
    // Handle form submission here
  };

  const handleBack = () => {
    console.log('Back clicked');
    // Handle back navigation
  };

  return (
    <div className="bg-white rounded-lg w-full p-6 border border-[#D1D6DB]">
      {/* header  */}
      <StepTitle title="Meeting Objective" subtitle="Define your goals and strategy" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#2D2D2D] mb-2.5">
            Meeting Goal
          </label>
          <input
            type="text"
            {...register('meetingGoal', { required: 'Meeting goal is required' })}
            className="w-full px-3 py-2.5 text-[#636F85] text-sm border border-[#D1D6DB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#6E51E0] focus:border-transparent"
          />
          {errors.meetingGoal && (
            <p className="mt-1 text-sm text-red-600">{errors.meetingGoal.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-[#2D2D2D] mb-2.5">
            Top 5 Discovery Questions
          </label>
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-3">
                <input
                  type="text"
                  {...register(`questions.${index}.value`, {
                    required: 'Question is required'
                  })}
                  placeholder="Enter your question"
                  className="flex-1 px-3 py-2.5 text-[#636F85] text-sm border border-[#D1D6DB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#6E51E0] focus:border-transparent"
                />
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => append({ value: '' })}
            className="mt-3 flex items-center gap-2 text-[16px] text-[#2D2D2D] border border-[#D1D6DB] px-6 py-2.5 rounded-lg"
          >
            <Plus size={16} />
            Add Question
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-[#2D2D2D] mb-2.5">
              Personality
            </label>
            <Controller
              name="personality"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select personality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nice">Nice</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Casual">Casual</SelectItem>
                    <SelectItem value="Direct">Direct</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2D2D2D] mb-2.5">
              Difficulty Level
            </label>
            <Controller
              name="difficulty"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="">
          <label className="block text-sm font-medium text-[#2D2D2D] mb-2.5">
            Meeting Duration
          </label>
          <input
            type="text"
            {...register('duration', { required: 'Duration is required' })}
            className="w-full px-3 py-2.5 text-[#636F85] text-sm border border-[#D1D6DB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#6E51E0] focus:border-transparent"
          />
          {errors.duration && (
            <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
          )}
        </div>

        {/* <div className="flex justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
          >
            Next Step
          </button>
        </div> */}
      </form>
    </div>
  );
}