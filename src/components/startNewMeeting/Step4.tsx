

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
import { useCreateMeetingIdMutation } from '@/redux/api/startMettingApi/startMettingApi';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import DashboardButton from '../shared/dashboardButton/DashboardButton';
import { toast } from 'sonner';
import Cookies from "js-cookie";
import { useActiveSubscriptionQuery } from '@/redux/api/subscriptionApi/subscriptionApi';

export default function MeetingPrepForm(
  { handleNext, handlePrev }: { handleNext: () => void; handlePrev: () => void }
) {

  // active subscription 
  const { data: activeSubcripiton } = useActiveSubscriptionQuery("")
  const status = activeSubcripiton?.data?.plan?.status;
  const meetingMode = activeSubcripiton?.data?.plan?.meetingMode;
  console.log(status, meetingMode, "================activesubscritpio");

  // take data from redux 
  const allData = useSelector((state: RootState) => state.startMeeting);
  // console.log(allData, "============")
  const representatives = allData?.participants;
  // console.log(representatives, "============representatives")
  const salesperson_id = allData?.product?.salesperson_id;
  const companyId = allData?.companyData?.company_id;

  // console.log(salesperson_id, companyId)

  const [createMeetingId, { isLoading }] = useCreateMeetingIdMutation();

  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      meetingGoal: 'Discovery',
      questions: [
        { value: 'What are your current biggest challenges?' },
        { value: 'How do you measure success?' },
        { value: 'What is your timeline for implementation?' },
        { value: 'Who else is involved in the decision?' },
        { value: 'What is your budget allocated for this?' }
      ],
      personality: 'nice',
      difficulty: 'intermediate',
      sales_methodology: "MEDDIC",
      duration: '5 minutes'
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions'
  });

  const onSubmit = async (data: any) => {
    console.log('Form Data:', data);

    const payload = {
      salesperson_id: salesperson_id,
      company_id: companyId,
      // meeting_mode: meetingMode,
      meeting_mode: "1-on-1",
      status: status,
      representatives: representatives,
      sales_methodology: data?.sales_methodology, // FIXED
      meeting_goal: data?.meetingGoal || "",
      personality: data?.personality,
      duration_minutes: Number(data?.duration) > 0 ? Number(data.duration) : 15,
      difficulty: data?.difficulty,
    };
    console.log(payload, "payload================")

    try {
      const response = await createMeetingId(payload).unwrap()
      if (response?.success) {
        Cookies.set("meetingId", response.data.meeting_id);
        toast.success(response.message)
        handleNext();
      }
    } catch (error: any) {
      toast.error("Something went wrong", error.message)
    }
  };

  const handleBack = () => {
    console.log('Back clicked');
    // Handle back navigation
    handlePrev();
  };

  return (
    <div className="bg-white rounded-lg w-full p-6 border border-[#D1D6DB]">
      {/* header  */}
      <StepTitle title="Meeting Objective" subtitle="Define your goals and strategy" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-6'>
          <label className="block text-sm font-medium text-[#2D2D2D] mb-2.5">
            Meeting Goal
          </label>
          <Controller
            name="meetingGoal"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-[#2D2D2D] mb-2.5">
              Sales Methodology
            </label>
            <Controller
              name="sales_methodology"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="MEDDIC" />
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
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2D2D2D] mb-2.5">
              Meeting Duration
            </label>
            <Controller
              name="duration"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="5 minutes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5 minutes">5 minutes</SelectItem>
                    <SelectItem value="10 minutes">10 minutes</SelectItem>
                    <SelectItem value="15 minutes">15 minutes</SelectItem>
                    <SelectItem value="20 minutes">20 minutes</SelectItem>
                    <SelectItem value="25 minutes">25 minutes</SelectItem>
                    <SelectItem value="30 minutes">30 minutes</SelectItem>
                    <SelectItem value="35 minutes">35 minutes</SelectItem>
                    <SelectItem value="40 minutes">40 minutes</SelectItem>
                    <SelectItem value="45 minutes">45 minutes</SelectItem>
                    <SelectItem value="50 minutes">50 minutes</SelectItem>
                    <SelectItem value="55 minutes">55 minutes</SelectItem>
                    <SelectItem value="60 minutes">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="border border-[#D1D6DB] px-6 py-3 rounded-lg hover:bg-primaryBgColor hover:text-white transition-colors cursor-pointer"
          >
            Back
          </button>
          <DashboardButton
            text="Next Step"
            onClick={handleSubmit(onSubmit)}
            isLoading={isLoading} // RTK mutation loading state
          />
        </div>
      </form>
    </div>
  );
}