

"use client"
import AIInsights from "@/components/myAccount/aiInsights";
import FastGrowth from "@/components/myAccount/fastGrowth";
import MyAccountRecentMeeting from "@/components/myAccount/myAccountRecentMeeting";
import Loading from "@/components/Others/Loading";
import { useSingleAccountDetailsQuery } from "@/redux/api/myAccountApi/myAccountApi";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FiPlus } from "react-icons/fi";
function AccountDetails() {
  const { accountDetailsId } = useParams();
  const { data: singleData, isLoading } = useSingleAccountDetailsQuery(accountDetailsId as string);
  console.log(singleData, "singleData==============")

  if (isLoading) {
    return (
      <p>
        <Loading />
      </p>
    )
  }
  return (
    <div>
      {/* title part  */}
      <div className="bg-white border border-[#6E51E0] rounded-[12px] p-6 my-6">
        <div className="flex justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-medium text-[#2D2D2D] mb-4">
              Account Details
            </h1>
            <p className='text-[#4A5565] text-[16px]'>View comprehensive account information</p>
          </div>

          <div className="ml-6">
            <Link href={`/dashboard/startNewMeeting?step=4&id=${accountDetailsId}`}>
              <button className="flex items-center justify-center gap-3 bg-[#6E51E0] text-[16px] font-medium text-white px-4 py-2 rounded-[6px] cursor-pointer">
                <span><FiPlus size={24} /></span>
                <span>New Meeting</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
      {/* fast growth part  */}
      <FastGrowth />
      {/* recent meetings part  */}
      <div className="grid grid-cols-3 gap-6 py-6">
        <div className="col-span-2">
          <MyAccountRecentMeeting />
        </div>
        <div className="col-span-1 bg-white px-6 rounded-xl">
          <AIInsights />
        </div>
      </div>
    </div>
  )
}

export default AccountDetails