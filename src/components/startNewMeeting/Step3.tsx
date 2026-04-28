
// import React, { useState } from 'react';
// import StepTitle from './stepTitle';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '@/redux/store';
// import { useMeetngCompanyMutation } from '@/redux/api/startMettingApi/startMettingApi';
// import { useForm } from 'react-hook-form';
// import { toast } from 'sonner';
// import { setCompanyData } from '@/redux/features/startMeeting/startMeetingSlice';

// type FormValues = {
//   company_url: string;
//   salesperson_id: string;
// };

// export default function Step3(
//   { handleNext, handlePrev }: { handleNext: () => void; handlePrev: () => void }
// ) {
//   const [companyDataShow, setcompanyDataShow] = useState<any>(null);
//   const [isSuccess, setIsSuccess] = useState(false);
//   const dispatch = useDispatch()

//   const allData = useSelector((state: RootState) => state.startMeeting);
//   const salesperson_id = allData?.product?.salesperson_id;
//   console.log(salesperson_id, "===========salesperson_id=========")

//   const [meetngCompany, { isLoading }] = useMeetngCompanyMutation();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormValues>({
//     defaultValues: {
//       company_url: '',
//       salesperson_id: ''
//     },
//   });

//   const onSubmit = async (data: FormValues) => {
//     try {
//       const response = await meetngCompany({
//         company_url: data.company_url,
//         salesperson_id: salesperson_id,
//       }).unwrap();

//       if (response?.success) {
//         toast.success(response.message);
//         setcompanyDataShow(response?.data?.company_data);
//         dispatch(setCompanyData(response?.data));
//         setIsSuccess(true)
//       }

//     } catch (error: any) {
//       const message =
//         error?.data?.message || "Something went wrong";
//       toast.error(message);
//     }
//   };

//   return (
//     <div className="p-6 bg-white rounded-lg border border-[#D1D6DB]">

//       {/* Header */}
//       <StepTitle title="Company Information" subtitle="Provide details about the target company" />

//       {/* Form - only wraps the input + submit button */}
//       <form onSubmit={handleSubmit(onSubmit)}>

//         {/* Company URL */}
//         <div className='flex items-center gap-3'>
//           <div className="mb-6 flex-1">
//             <label className="block text-[16px] font-medium text-[#2D2D2D] mb-2">
//               Company URL
//             </label>
//             <input
//               type="text"
//               {...register('company_url', {
//                 required: 'Company URL is required',
//                 pattern: {
//                   value: /^https?:\/\/.+/,
//                   message: 'Please enter a valid URL starting with http:// or https://',
//                 },
//               })}
//               className="w-full px-4 py-2 text-[#636F85] text-sm border border-[#D1D6DB] rounded-lg focus:ring-2 focus:ring-[#6E51E0] focus:border-transparent outline-none"
//               placeholder="https://"
//             />
//             {errors.company_url && (
//               <p className="text-red-500 text-xs mt-1">{errors.company_url.message}</p>
//             )}
//           </div>
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="bg-primaryBgColor text-white px-6 py-2 rounded-lg 
//   flex items-center justify-center gap-2
//   disabled:opacity-50 disabled:cursor-not-allowed -mb-1 cursor-pointer"
//           >
//             {isLoading && (
//               <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//             )}

//             {isLoading ? "Processing..." : "Submit"}
//           </button>
//         </div>

//         {/* Company Size and Headquarters */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//           <div className="bg-[#F9FAFB] border border-[#D1D6DB] rounded-lg p-4 hover:shadow-sm transition-shadow">
//             <div className="text-sm text-[#636F85] mb-1">Company Size</div>
//             <div className="text-xl font-semibold text-[#2D2D2D]">
//               {companyDataShow?.company_size || 'N/A'}
//             </div>
//           </div>
//           <div className="bg-[#F9FAFB] border border-[#D1D6DB] rounded-lg p-4 hover:shadow-sm transition-shadow">
//             <div className="text-sm text-[#636F85] mb-1">Headquarters</div>
//             <div className="text-xl font-semibold text-[#2D2D2D]">
//               {companyDataShow?.headquarters || 'N/A'}
//             </div>
//           </div>
//           <div className="bg-[#F9FAFB] border border-[#D1D6DB] rounded-lg p-4 hover:shadow-sm transition-shadow">
//             <div className="text-sm text-[#636F85] mb-1">Revenue</div>
//             <div className="text-xl font-semibold text-[#2D2D2D]">
//               {companyDataShow?.revenue || 'N/A'}
//             </div>
//           </div>
//           <div className="bg-[#F9FAFB] border border-[#D1D6DB] rounded-lg p-4 hover:shadow-sm transition-shadow">
//             <div className="text-sm text-[#636F85] mb-1">Industry</div>
//             <div className="text-xl font-semibold text-[#2D2D2D]">
//               {companyDataShow?.industry || 'N/A'}
//             </div>
//           </div>
//         </div>

//         {/* Tech Stack */}
//         <div className="mb-6">
//           <div className="text-sm font-medium text-[#2D2D2D] mb-3">Wappalyzer Tech Stack</div>
//           <div className="flex flex-wrap gap-2">
//             {(companyDataShow?.tech_stack || ['N/A']).map((tech: string) => (
//               <span
//                 key={tech}
//                 className="px-6 py-2 bg-[#F3F4F6] text-[#2D2D2D] text-[16px] rounded-md"
//               >
//                 {tech}
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* Hiring Data and Customer Reviews */}
//         <div className="grid grid-cols-2 gap-4 mb-6">
//           <div className="bg-[#B9F8CF33] border border-[#B9F8CF] rounded-lg p-4 hover:shadow-sm transition-shadow">
//             <div className="text-xl font-semibold text-[#2D2D2D] mb-1">💼 Hiring Data</div>
//             <div className="text-sm text-[#636F85]">
//               {/* {companyDataShow?.hiring_data || 'N/A'} */}
//               N/A
//             </div>
//           </div>
//           <div className="bg-[#E9D4FF33] border border-[#E9D4FF] rounded-lg p-4 hover:shadow-sm transition-shadow">
//             <div className="text-xl font-semibold text-[#2D2D2D] mb-1">⭐ Customer Reviews</div>
//             <div className="text-sm text-[#636F85]">
//               {/* {companyDataShow?.customer_reviews || 'N/A'} */}
//               "N/A"
//             </div>
//           </div>
//         </div>

//         {/* Latest News */}
//         <div className="mb-6">
//           <div className="text-sm font-medium text-[#2D2D2D] mb-3">Latest News</div>
//           <div className="bg-[#6E51E00D] border border-[#6E51E01A] rounded-lg p-4 hover:shadow-sm transition-shadow">
//             <p className="text-sm text-[#2D2D2D]">
//               {/* {companyDataShow?.latest_news || 'N/A'} */}
//               "N/A"
//             </p>
//           </div>
//         </div>

//         {/* Financial Statements and Product Documentation */}
//         <div className="grid grid-cols-2 gap-4 mb-6">
//           <div className="bg-[#FFD6A733] border border-[#FFD6A7] rounded-lg p-4 hover:shadow-sm transition-shadow">
//             <div className="text-xl font-semibold text-[#2D2D2D] mb-1">📊 Financial Statements</div>
//             <div className="text-[16px] text-[#636F85]">
//               {/* {companyDataShow?.financial_statements || 'N/A'} */}
//               "N/A"
//             </div>
//           </div>
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
//             <div className="text-xl font-semibold text-[#2D2D2D] mb-1">📄 Product Documentation</div>
//             <div className="text-[16px] text-[#636F85]">
//               {/* {companyDataShow?.product_documentation || 'N/A'} */}
//               "N/A"
//             </div>
//           </div>
//         </div>
//       </form>

//       {/* Navigation Buttons */}
//       <div className="flex justify-between">
//         <button
//           onClick={handlePrev}
//           className="border border-[#D1D6DB] px-6 py-3 rounded-lg hover:bg-primaryBgColor hover:text-white transition-colors cursor-pointer">
//           Back
//         </button>
//         {
//           isSuccess && (
//             <button
//               onClick={handleNext}
//               className="bg-primaryBgColor text-white px-6 py-3 rounded-lg hover:bg-primaryBgColor transition-colors cursor-pointer">
//               Next Step
//             </button>
//           )
//         }
//       </div>
//     </div>
//   );
// }




import React, { useState } from 'react';
import StepTitle from './stepTitle';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useMeetngCompanyMutation } from '@/redux/api/startMettingApi/startMettingApi';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { setCompanyData } from '@/redux/features/startMeeting/startMeetingSlice';

type FormValues = {
  company_url: string;
  salesperson_id: string;
};

export default function Step3({
  handleNext,
  handlePrev,
}: {
  handleNext: () => void;
  handlePrev: () => void;
}) {
  const [companyDataShow, setcompanyDataShow] = useState<any>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const dispatch = useDispatch();
  
  const allData = useSelector((state: RootState) => state.startMeeting);
  const salesperson_id = allData?.product?.salesperson_id;
  console.log(salesperson_id, "===========salesperson_id")
  console.log(salesperson_id)

  const [meetngCompany, { isLoading }] = useMeetngCompanyMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      company_url: '',
      salesperson_id: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      let url = data.company_url.trim();

      // ✅ auto add https if missing (recommended UX)
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }

      const response = await meetngCompany({
        company_url: url,
        salesperson_id: salesperson_id,
      }).unwrap();

      if (response?.success) {
        toast.success(response.message);
        setcompanyDataShow(response?.data?.company_data);
        dispatch(setCompanyData(response?.data));
        setIsSuccess(true);
      }
    } catch (error: any) {
      const message = error?.data?.message || 'Something went wrong';
      toast.error(message);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg border border-[#D1D6DB]">

      {/* Header */}
      <StepTitle
        title="Company Information"
        subtitle="Provide details about the target company"
      />

      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center gap-3">

          {/* Input */}
          <div className="mb-6 flex-1">
            <label className="block text-[16px] font-medium text-[#2D2D2D] mb-2">
              Company URL
            </label>

            <input
              type="text"
              {...register('company_url', {
                required: 'Company URL is required',
              })}
              className="w-full px-4 py-2 text-[#636F85] text-sm border border-[#D1D6DB] rounded-lg focus:ring-2 focus:ring-[#6E51E0] focus:border-transparent outline-none"
              placeholder="fastgrowth.com or https://fastgrowth.com"
            />

            {errors.company_url && (
              <p className="text-red-500 text-xs mt-1">
                {errors.company_url.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primaryBgColor text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {isLoading ? 'Processing...' : 'Submit'}
          </button>
        </div>

        {/* Company Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-[#F9FAFB] border border-[#D1D6DB] rounded-lg p-4">
            <div className="text-sm text-[#636F85] mb-1">Company Size</div>
            <div className="text-xl font-semibold text-[#2D2D2D]">
              {companyDataShow?.company_size || 'N/A'}
            </div>
          </div>

          <div className="bg-[#F9FAFB] border border-[#D1D6DB] rounded-lg p-4">
            <div className="text-sm text-[#636F85] mb-1">Headquarters</div>
            <div className="text-xl font-semibold text-[#2D2D2D]">
              {companyDataShow?.headquarters || 'N/A'}
            </div>
          </div>

          <div className="bg-[#F9FAFB] border border-[#D1D6DB] rounded-lg p-4">
            <div className="text-sm text-[#636F85] mb-1">Revenue</div>
            <div className="text-xl font-semibold text-[#2D2D2D]">
              {companyDataShow?.revenue || 'N/A'}
            </div>
          </div>

          <div className="bg-[#F9FAFB] border border-[#D1D6DB] rounded-lg p-4">
            <div className="text-sm text-[#636F85] mb-1">Industry</div>
            <div className="text-xl font-semibold text-[#2D2D2D]">
              {companyDataShow?.industry || 'N/A'}
            </div>
          </div>
        </div>
      </form>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrev}
          className="border border-[#D1D6DB] px-6 py-3 rounded-lg hover:bg-primaryBgColor hover:text-white transition-colors cursor-pointer"
        >
          Back
        </button>

        {isSuccess && (
          <button
            onClick={handleNext}
            className="bg-primaryBgColor text-white px-6 py-3 rounded-lg cursor-pointer"
          >
            Next Step
          </button>
        )}
      </div>
    </div>
  );
}