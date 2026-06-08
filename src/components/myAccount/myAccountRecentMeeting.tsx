
// import React from 'react';
// import { Calendar, Clock, FileText, Play, TrendingUp, User } from 'lucide-react';
// import Link from 'next/link';
// import OpportunitiesSection from './OpportunitiesSection';
// import { format } from "date-fns";

// export default function RecentMeetings({ singleData } : { singleData: any }) {
//     const meetings = singleData?.data?.meetings || []

//     const opportunitiesData = singleData?.data?.ai_insights?.opportunities || []

//     const getScoreColor = (score: number) => {
//         if (score >= 80) return 'text-[#6E51E0] bg-[#6E51E01A]';
//         if (score >= 70) return 'text-[#6E51E0] bg-[#6E51E01A]';
//         return 'text-orange-600 bg-orange-50';
//     };

//     return (
//         <div>
//             <div className="w-full bg-white p-6 rounded-xl">
//                 {/* Header */}
//                 <div className="flex items-center justify-between mb-6">
//                     <div className="flex items-center gap-2">
//                         <Calendar className="w-5 h-5 text-gray-900" />
//                         <h2 className="text-lg font-semibold text-gray-900">Recent Meetings</h2>
//                     </div>
//                     <button className="text-sm font-medium text-gray-900 hover:text-gray-700">
//                         View All
//                     </button>
//                 </div>

//                 {/* Meeting Cards */}
//                 <div className="space-y-4">
//                     {meetings?.map((meeting: any) => (
//                         <div
//                             key={meeting.id}
//                             className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-sm transition-shadow"
//                         >
//                             {/* Meeting Header */}
//                             <div className="flex items-start justify-between mb-4">
//                                 <h3 className="text-base font-semibold text-gray-900">
//                                     {meeting?.meeting_goal}
//                                 </h3>
//                                 <span className={`px-2.5 py-1 rounded text-sm font-semibold bg ${getScoreColor(meeting.score)}`}>
//                                     {Math.round(meeting?.score || 0)}/100
//                                 </span>
//                             </div>

//                             {/* Meeting Details */}
//                             <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
//                                 <div className="flex items-center gap-1.5">
//                                     <Calendar className="w-4 h-4" />
//                                     <span>
//                                         {meeting?.created_at
//                                             ? format(new Date(meeting.created_at), "dd MMM yyyy, hh:mm a")
//                                             : ""}
//                                     </span>
//                                 </div>
//                                 <div className="flex items-center gap-1.5">
//                                     <Clock className="w-4 h-4" />
//                                     <span>{meeting?.analytics?.total_duration}</span>
//                                 </div>
//                                 {/* <div className="flex items-center gap-1.5">
//                                     <User className="w-4 h-4" />
//                                     <span>{meeting.attendee}</span>
//                                 </div> */}
//                             </div>

//                             {/* Action Buttons */}
//                             <div className="grid grid-cols-3 gap-3">
//                                 <Link href="/dashboard/home/viewSummary">
//                                     <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
//                                         <FileText className="w-4 h-4" />
//                                         Summary
//                                     </button>
//                                 </Link>

//                                 <Link href="/dashboard/home/replay">
//                                     <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
//                                         <Play className="w-4 h-4" />
//                                         Replay
//                                     </button>
//                                 </Link>

//                                 <Link href="/dashboard/home/insights">
//                                     <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
//                                         <TrendingUp className="w-4 h-4" />
//                                         Insights
//                                     </button>
//                                 </Link>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//             <OpportunitiesSection opportunitiesData={opportunitiesData} />
//         </div>
//     );
// }



"use client";

import React, { useState } from 'react';
import { Calendar, Clock, FileText, Play, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import OpportunitiesSection from './OpportunitiesSection';
import { format } from "date-fns";

export default function RecentMeetings({ singleData, accountDetailsId }: { singleData: any; accountDetailsId: any }) {
    const meetings = singleData?.data?.meetings || [];
    const opportunitiesData = singleData?.data?.ai_insights?.opportunities || [];

    const [showAll, setShowAll] = useState(false);

    // Sort newest first
    const sortedMeetings = [...meetings].sort(
        (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-[#6E51E0] bg-[#6E51E01A]';
        if (score >= 70) return 'text-[#6E51E0] bg-[#6E51E01A]';
        return 'text-orange-600 bg-orange-50';
    };

    const displayedMeetings = showAll ? sortedMeetings : sortedMeetings.slice(0, 2);

    return (
        <div>
            <div className="w-full bg-white p-6 rounded-xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-900" />
                        <h2 className="text-lg font-semibold text-gray-900">Recent Meetings</h2>
                    </div>
                    <button
                        className="text-sm font-medium text-gray-900 hover:text-gray-700 cursor-pointer"
                        onClick={() => setShowAll(!showAll)}
                    >
                        {showAll ? "Show Less" : "View All"}
                    </button>
                </div>

                {/* Meeting Cards */}
                <div className="space-y-4">
                    {displayedMeetings?.map((meeting: any) => (
                        <div
                            key={meeting.id}
                            className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-sm transition-shadow"
                        >
                            {/* Meeting Header */}
                            <div className="flex items-start justify-between mb-4">
                                <h3 className="text-base font-semibold text-gray-900">
                                    {meeting?.meeting_goal}
                                </h3>
                                <span className={`px-2.5 py-1 rounded text-sm font-semibold ${getScoreColor(meeting.score)}`}>
                                    {Math.round(meeting?.score || 0)}/100
                                </span>
                            </div>

                            {/* Meeting Details */}
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        {meeting?.created_at
                                            ? format(new Date(meeting.created_at), "dd MMM yyyy, hh:mm a")
                                            : ""}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    <span>{Math.round(meeting?.analytics?.total_duration || 0)}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-3 gap-3">
                                <Link href={`/dashboard/home/viewSummary?meetingId=${meeting?.meeting_id}&sessionId=${meeting?.session_id}`}>
                                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                                        <FileText className="w-4 h-4" />
                                        Summary
                                    </button>
                                </Link>

                                <Link href={`/dashboard/home/replay?meetingId=${meeting?.meeting_id}&sessionId=${meeting?.session_id}`}>
                                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                                        <Play className="w-4 h-4" />
                                        Replay
                                    </button>
                                </Link>

                                <Link href={`/dashboard/home/insights?meetingId=${meeting?.meeting_id}&sessionId=${meeting?.session_id}`}>
                                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                                        <TrendingUp className="w-4 h-4" />
                                        Insights
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Opportunities Section */}
            {/* <OpportunitiesSection opportunitiesData={opportunitiesData} /> */}
            <OpportunitiesSection accountDetailsId={accountDetailsId} />
        </div>
    );
}