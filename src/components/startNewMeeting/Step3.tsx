
// import React, { useState } from 'react';
// import StepTitle from './stepTitle';
// import { useSelector } from 'react-redux';
// import { RootState } from '@/redux/store';
// import { useMeetingCompanyRepresentitiveMutation } from '@/redux/api/startMettingApi/startMettingApi';

// export default function Step3(
//   { handleNext, handlePrev }: { handleNext: () => void; handlePrev: () => void }
// ) {
//   const [companyUrl, setCompanyUrl] = useState('https://fastgrowth.com');

//   const allData = useSelector((state: RootState) => state.startMeeting) 
//   console.log(allData, "==================allData")

//   return (
//     <div className="p-6 bg-white rounded-lg border border-[#D1D6DB]">
//       {/* Header */}
//       <div className="space-y-2">
//         {/* header  */}
//         <StepTitle title="Company Information" subtitle="Provide details about the target company" />
//       </div>

//       {/* Company URL */}
//       <div className="mb-6">
//         <label className="block text-[16px] font-medium text-[#2D2D2D] mb-2">
//           Company URL
//         </label>
//         <input
//           type="text"
//           value={companyUrl}
//           onChange={(e) => setCompanyUrl(e.target.value)}
//           className="w-full px-4 py-2 text-[#636F85] text-sm border border-[#D1D6DB] rounded-lg focus:ring-2 focus:ring-[#6E51E0] focus:border-transparent outline-none"
//           placeholder="https://"
//         />
//       </div>

//       {/* Company Size and Headquarters */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         <div className="bg-[#F9FAFB] border border-[#D1D6DB] rounded-lg p-4 hover:shadow-sm transition-shadow">
//           <div className="text-sm text-[#636F85] mb-1.2">Company Size</div>
//           <div className="text-xl font-semibold text-[#2D2D2D]">320 Employees</div>
//         </div>
//         <div className="bg-[#F9FAFB] border border-[#D1D6DB] rounded-lg p-4 hover:shadow-sm transition-shadow">
//           <div className="text-sm text-[#636F85] mb-1.2">Headquarters</div>
//           <div className="text-xl font-semibold text-[#2D2D2D]">San Francisco</div>
//         </div>
//         {/* Revenue and Industry */}
//         <div className="bg-[#F9FAFB] border border-[#D1D6DB] rounded-lg p-4 hover:shadow-sm transition-shadow">
//           <div className="text-sm text-[#636F85] mb-1.2">Revenue</div>
//           <div className="text-xl font-semibold text-[#2D2D2D]">$55M</div>
//         </div>
//         <div className="bg-[#F9FAFB] border border-[#D1D6DB] rounded-lg p-4 hover:shadow-sm transition-shadow">
//           <div className="text-sm text-[#636F85] mb-1.2">Industry</div>
//           <div className="text-xl font-semibold text-[#2D2D2D]">SaaS</div>
//         </div>
//       </div>
//       {/* Tech Stack */}
//       <div className="mb-6">
//         <div className="text-sm font-medium text-[#2D2D2D] mb-3">Wappalyzer Tech Stack</div>
//         <div className="flex flex-wrap gap-2">
//           {['HubSpot', 'Salesforce', 'Snowflake', 'Slack', 'Zoom', 'React', 'AWS', 'Google Analytics'].map((tech) => (
//             <span
//               key={tech}
//               className="px-6 py-2 bg-[#F3F4F6] text-[#2D2D2D] text-[16px] rounded-md"
//             >
//               {tech}
//             </span>
//           ))}
//         </div>
//       </div>

//       {/* Hiring Data and Customer Reviews */}
//       <div className="grid grid-cols-2 gap-4 mb-6">
//         <div className="bg-[#B9F8CF33] border border-[#B9F8CF] rounded-lg p-4 hover:shadow-sm transition-shadow">
//           <div className="text-xl font-semibold text-[#2D2D2D] mb-1">
//             💼 Hiring Data
//           </div>
//           <div className="text-sm text-[#636F85]">
//             45 open positions • Growing sales & engineering teams
//           </div>
//         </div>
//         <div className="bg-[#E9D4FF33] border border-[#E9D4FF] rounded-lg p-4 hover:shadow-sm transition-shadow">
//           <div className="text-xl font-semibold text-[#2D2D2D] mb-1">
//             ⭐ Customer Reviews
//           </div>
//           <div className="text-sm text-[#636F85]">
//             4.5/5 on G2 • 328 reviews • "Great for scaling teams"
//           </div>
//         </div>
//       </div>

//       {/* Latest News */}
//       <div className="mb-6">
//         <div className="text-sm font-medium text-[#2D2D2D] mb-3">Latest News</div>
//         <div className="bg-[#6E51E00D] border border-[#6E51E01A] rounded-lg p-4 hover:shadow-sm transition-shadow">
//           <p className="text-sm text-[#2D2D2D]">
//             FastGrowth Inc. announces Series B funding of $25M led by Sequoia Capital
//           </p>
//         </div>
//       </div>

//       {/* Financial Statements and Product Documentation */}
//       <div className="grid grid-cols-2 gap-4 mb-6">
//         <div className="bg-[#FFD6A733] border border-[#FFD6A7] rounded-lg p-4 hover:shadow-sm transition-shadow">
//           <div className="text-xl font-semibold text-[#2D2D2D] mb-1">
//             📊 Financial Statements
//           </div>
//           <div className="text-[16px] text-[#636F85]">
//             YoY Growth: 85% • ARR: $42M • Burn Rate: Positive
//           </div>
//         </div>
//         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
//           <div className="text-xl font-semibold text-[#2D2D2D] mb-1">
//             📄 Product Documentation
//           </div>
//           <div className="text-[16px] text-[#636F85]">
//             API docs available • Integration guides • Video tutorials
//           </div>
//         </div>
//       </div>

//       {/* Navigation Buttons */}
//       <div className="flex justify-between">
//         <button
//           onClick={handlePrev}
//           className="border border-[#D1D6DB] px-6 py-3 rounded-lg hover:bg-primaryBgColor hover:text-white transition-colors cursor-pointer">
//           Back
//         </button>
//         <button
//           onClick={handleNext}
//           className="bg-primaryBgColor text-white px-6 py-3 rounded-lg hover:bg-primaryBgColor transition-colors cursor-pointer">
//           Next Step
//         </button>
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
};

export default function Step3(
  { handleNext, handlePrev }: { handleNext: () => void; handlePrev: () => void }
) {
  const [companyDataShow, setcompanyDataShow] = useState<any>(null);
  const dispatch = useDispatch()

  const allData = useSelector((state: RootState) => state.startMeeting);

  const [meetngCompany, { isLoading }] = useMeetngCompanyMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      company_url: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await meetngCompany({
        company_url: data.company_url,
      }).unwrap();
      if (response?.success) {
        // console.log(response, "==============response")
        toast.success(response.message)
        setcompanyDataShow(response?.data?.company_data);
        dispatch(setCompanyData(response?.data))

      }
    } catch (error: any) {
      toast.error("Something went wrong", error.message)
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg border border-[#D1D6DB]">

      {/* Header */}
      <StepTitle title="Company Information" subtitle="Provide details about the target company" />

      {/* Form - only wraps the input + submit button */}
      <form onSubmit={handleSubmit(onSubmit)}>

        {/* Company URL */}
        <div className='flex items-center gap-3'>
          <div className="mb-6 flex-1">
            <label className="block text-[16px] font-medium text-[#2D2D2D] mb-2">
              Company URL
            </label>
            <input
              type="text"
              {...register('company_url', {
                required: 'Company URL is required',
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: 'Please enter a valid URL starting with http:// or https://',
                },
              })}
              className="w-full px-4 py-2 text-[#636F85] text-sm border border-[#D1D6DB] rounded-lg focus:ring-2 focus:ring-[#6E51E0] focus:border-transparent outline-none"
              placeholder="https://"
            />
            {errors.company_url && (
              <p className="text-red-500 text-xs mt-1">{errors.company_url.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primaryBgColor text-white px-6 py-2 rounded-lg 
  flex items-center justify-center gap-2
  disabled:opacity-50 disabled:cursor-not-allowed -mb-1 cursor-pointer"
          >
            {isLoading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}

            {isLoading ? "Processing..." : "Submit"}
          </button>
        </div>

        {/* Company Size and Headquarters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-[#F9FAFB] border border-[#D1D6DB] rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="text-sm text-[#636F85] mb-1">Company Size</div>
            <div className="text-xl font-semibold text-[#2D2D2D]">
              {companyDataShow?.company_size || '320 Employees'}
            </div>
          </div>
          <div className="bg-[#F9FAFB] border border-[#D1D6DB] rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="text-sm text-[#636F85] mb-1">Headquarters</div>
            <div className="text-xl font-semibold text-[#2D2D2D]">
              {companyDataShow?.headquarters || 'San Francisco'}
            </div>
          </div>
          <div className="bg-[#F9FAFB] border border-[#D1D6DB] rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="text-sm text-[#636F85] mb-1">Revenue</div>
            <div className="text-xl font-semibold text-[#2D2D2D]">
              {companyDataShow?.revenue || '$55M'}
            </div>
          </div>
          <div className="bg-[#F9FAFB] border border-[#D1D6DB] rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="text-sm text-[#636F85] mb-1">Industry</div>
            <div className="text-xl font-semibold text-[#2D2D2D]">
              {companyDataShow?.industry || 'SaaS'}
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-6">
          <div className="text-sm font-medium text-[#2D2D2D] mb-3">Wappalyzer Tech Stack</div>
          <div className="flex flex-wrap gap-2">
            {(companyDataShow?.tech_stack || ['HubSpot', 'Salesforce', 'Snowflake', 'Slack', 'Zoom', 'React', 'AWS', 'Google Analytics']).map((tech: string) => (
              <span
                key={tech}
                className="px-6 py-2 bg-[#F3F4F6] text-[#2D2D2D] text-[16px] rounded-md"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Hiring Data and Customer Reviews */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#B9F8CF33] border border-[#B9F8CF] rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="text-xl font-semibold text-[#2D2D2D] mb-1">💼 Hiring Data</div>
            <div className="text-sm text-[#636F85]">
              {companyDataShow?.hiring_data || '45 open positions • Growing sales & engineering teams'}
            </div>
          </div>
          <div className="bg-[#E9D4FF33] border border-[#E9D4FF] rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="text-xl font-semibold text-[#2D2D2D] mb-1">⭐ Customer Reviews</div>
            <div className="text-sm text-[#636F85]">
              {companyDataShow?.customer_reviews || '4.5/5 on G2 • 328 reviews • "Great for scaling teams"'}
            </div>
          </div>
        </div>

        {/* Latest News */}
        <div className="mb-6">
          <div className="text-sm font-medium text-[#2D2D2D] mb-3">Latest News</div>
          <div className="bg-[#6E51E00D] border border-[#6E51E01A] rounded-lg p-4 hover:shadow-sm transition-shadow">
            <p className="text-sm text-[#2D2D2D]">
              {companyDataShow?.latest_news || 'FastGrowth Inc. announces Series B funding of $25M led by Sequoia Capital'}
            </p>
          </div>
        </div>

        {/* Financial Statements and Product Documentation */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#FFD6A733] border border-[#FFD6A7] rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="text-xl font-semibold text-[#2D2D2D] mb-1">📊 Financial Statements</div>
            <div className="text-[16px] text-[#636F85]">
              {companyDataShow?.financial_statements || 'YoY Growth: 85% • ARR: $42M • Burn Rate: Positive'}
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="text-xl font-semibold text-[#2D2D2D] mb-1">📄 Product Documentation</div>
            <div className="text-[16px] text-[#636F85]">
              {companyDataShow?.product_documentation || 'API docs available • Integration guides • Video tutorials'}
            </div>
          </div>
        </div>
      </form>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handlePrev}
          className="border border-[#D1D6DB] px-6 py-3 rounded-lg hover:bg-primaryBgColor hover:text-white transition-colors cursor-pointer">
          Back
        </button>
        <button
          onClick={handleNext}
          className="bg-primaryBgColor text-white px-6 py-3 rounded-lg hover:bg-primaryBgColor transition-colors cursor-pointer">
          Next Step
        </button>
      </div>
    </div>
  );
}