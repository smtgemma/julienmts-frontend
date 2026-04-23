"use client"
import { SectionCards } from "@/components/section-cards"
import RecentMeetings from "@/components/recent-mettings"
import { Building2, ExternalLink, Lightbulb } from "lucide-react"
import HomeAiInsights from "@/components/home/HomeAiInsights"
import Link from "next/link"
import { useGetUserDashboardStatsQuery } from "@/redux/api/homeApi/homeApi"
import Loading from "@/components/Others/Loading"
import { useMyAccountListQuery } from "@/redux/api/myAccountApi/myAccountApi"

export default function Page() {
    const { data: getUserDashboardStats, isLoading } = useGetUserDashboardStatsQuery("")
    const { total, performanceGrowth, completed } = getUserDashboardStats?.data?.meetings || {}
    const recentMeetings = getUserDashboardStats?.data?.recentMeetings || []
    const { data: myAcount } = useMyAccountListQuery("");
    const myAccount = myAcount?.data || []

    // console.log(myAccount, "==================myAccount")

    if (isLoading) {
        return (
            <p>
                <Loading />
            </p>
        )
    }
    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards total={total} performanceGrowth={performanceGrowth} completed={completed} />
            <RecentMeetings recentMeetings={recentMeetings} />
            {/* active accounts  */}
            <div>
                <h3 className="text-[#2D2D2D] text-2xl font-medium mb-6">Active Accounts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myAccount?.length > 0 ? (
                        myAccount.map((account: any) => (
                            <div
                                key={account.id}
                                className="flex flex-col border border-[#D1D6DB] p-5 rounded-xl hover:shadow-sm bg-white"
                            >
                                {/* Avatar */}
                                <div className="w-12 h-12 rounded-[10px] bg-[#6E51E0] flex items-center justify-center text-white font-semibold">
                                    {account.companyName?.charAt(0)}
                                </div>

                                {/* Company Name */}
                                <h3 className="font-semibold text-[#2D2D2D] text-[18px] my-2">
                                    {account.companyName}
                                </h3>

                                {/* Info */}
                                <div className="flex flex-col gap-1 mb-6">
                                    <p className="text-sm text-[#636F85]">
                                        {account.description
                                            ? account.description.slice(0, 20) + (account.description.length > 20 ? "..." : "")
                                            : "N/A"}
                                    </p>
                                    <p className="text-sm text-[#636F85]">
                                        Last Interaction:{" "}
                                        {account.lastMeetingAt
                                            ? new Date(account.lastMeetingAt).toLocaleDateString()
                                            : "N/A"}
                                    </p>
                                </div>

                                {/* Button */}
                                <Link href={`/dashboard/myAccount/${account.aiCompanyId}`}>
                                    <button className="shadow-sm flex items-center justify-center gap-2 w-full py-2 border border-[#D1D6DB] rounded-md text-sm font-medium text-[#0A0A0A] hover:bg-[#6E51E0] hover:text-white transition-colors cursor-pointer">
                                        <ExternalLink size={14} />
                                        Open Account
                                    </button>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center border border-dashed border-[#D1D6DB] rounded-xl py-14 bg-white">

                            {/* Icon */}
                            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#F4F6FA] mb-4">
                                <Building2 className="w-6 h-6 text-[#6E51E0]" />
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-semibold text-[#2D2D2D] mb-2">
                                No Accounts Found
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-[#636F85] text-center max-w-xs mb-5">
                                You haven’t added any accounts yet. Start by creating a new account to manage your companies.
                            </p>

                            {/* CTA Button */}
                            <Link href="/dashboard/startNewMeeting">
                                <button className="px-5 py-2 bg-[#6E51E0] text-white rounded-md text-sm font-medium hover:bg-[#5a42c9] transition cursor-pointer">
                                    + Add New Account
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            {/* ai insights  */}
            <HomeAiInsights />
        </div>
    )
}
