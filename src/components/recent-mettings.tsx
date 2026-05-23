// import React from "react";
// import { Building2, FileText, Play, TrendingUp } from "lucide-react";
// import Link from "next/link";

// export default function RecentMeetings({ recentMeetings }: { recentMeetings: any }) {
//   // console.log(recentMeetings, "=============")
//   const meetings = [
//     {
//       title: "Discovery Call with CMO",
//       company: "FastGrowth Inc.",
//       date: "Jan 23",
//       duration: "42 min",
//       score: 76,
//     },
//     {
//       title: "Demo Preparation – VP Sales",
//       company: "BlueWave Retail",
//       date: "Jan 22",
//       duration: "35 min",
//       score: 85,
//     },
//   ];

//   // const getScoreColor = (score: any) => {
//   //   console.log(score);
//   //   if (score >= 80) return "text-green-600 bg-green-50";
//   //   if (score >= 70) return "text-purple-600 bg-purple-50";
//   //   return "text-orange-600 bg-orange-50";
//   // };

//   return (
//     <div>
//       <div>
//         <h1 className="text-3xl font-bold text-gray-900 mb-8">
//           Recent Meetings
//         </h1>
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {recentMeetings.map((meeting: any, index: number) => (
//             <div
//               key={index}
//               className=" rounded-xl border border-[#D1D6DB] p-6 hover:shadow-sm transition-shadow duration-200"
//             >
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex-1">
//                   <h2 className="text-xl font-semibold text-gray-900 mb-3">
//                     {meeting.meetingGoal}
//                   </h2>

//                   <div className="flex items-center gap-2 text-gray-600 mb-2">
//                     <Building2 className="w-4 h-4" />
//                     <span className="text-sm">{meeting.companyName}</span>
//                   </div>

//                   <div className="text-sm text-gray-500">
//                     {new Date(meeting.createdAt).toLocaleDateString("en-US", {
//                       month: "short",
//                       day: "numeric",
//                     })} — {meeting.durationMinutes} min
//                   </div>
//                 </div>

//                 {/* <div
//                   className={`px-3 py-1 rounded-sm font-semibold text-sm ${getScoreColor(
//                     meeting.score
//                   )}`}
//                 >
//                   {meeting.score}/100
//                 </div> */}
//               </div>

//               {/* Action Buttons */}
//               <div className="grid grid-cols-3 gap-3">
//                 <Link href={`/dashboard/home/viewSummary?meetingId=${meeting?.meetingId}&sessionId=${meeting?.sessionId}`}>
//                   <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
//                     <FileText className="w-4 h-4" />
//                     Summary
//                   </button>
//                 </Link>

//                 <Link href={`/dashboard/home/replay?meetingId=${meeting?.meetingId}&sessionId=${meeting?.sessionId}`}>
//                   <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
//                     <Play className="w-4 h-4" />
//                     Replay
//                   </button>
//                 </Link>

//                 <Link href={`/dashboard/home/insights?meetingId=${meeting?.meetingId}&sessionId=${meeting?.sessionId}`}>
//                   <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
//                     <TrendingUp className="w-4 h-4" />
//                     Insights
//                   </button>
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }



import React from "react";
import { Building2, FileText, Play, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function RecentMeetings({ recentMeetings }: { recentMeetings: any }) {
  // Sort newest first
  const sortedMeetings = [...(recentMeetings || [])].sort(
    (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Recent Meetings
      </h1>

      {sortedMeetings.length === 0 ? (
        // ✅ Empty State UI
        <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl py-16">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#F4F6FA] mb-4">
            <Building2 className="w-6 h-6 text-[#6E51E0]" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            No meetings yet
          </h2>
          <p className="text-sm text-gray-500 mb-4 text-center max-w-sm">
            You haven't created any meetings yet. Start a new meeting to see it appear here.
          </p>

          <Link href="/dashboard/startNewMeeting">
            <button className="px-5 py-2 bg-[#6E51E0] text-white rounded-md text-sm font-medium hover:bg-[#5a42c9] transition cursor-pointer">
              Start Meeting
            </button>
          </Link>
        </div>
      ) : (
        // ✅ Existing Grid
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recentMeetings.map((meeting: any, index: number) => (
            <div
              key={index}
              className="rounded-xl border border-[#D1D6DB] p-6 hover:shadow-sm transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    {meeting.meetingGoal}
                  </h2>

                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm">{meeting.companyName}</span>
                  </div>

                  <div className="text-sm text-gray-500">
                    {new Date(meeting.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })} — {meeting.durationMinutes} min
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Link href={`/dashboard/home/viewSummary?meetingId=${meeting?.meetingId}&sessionId=${meeting?.sessionId}`}>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <FileText className="w-4 h-4" />
                    Summary
                  </button>
                </Link>

                <Link href={`/dashboard/home/replay?meetingId=${meeting?.meetingId}&sessionId=${meeting?.sessionId}`}>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <Play className="w-4 h-4" />
                    Replay
                  </button>
                </Link>

                <Link href={`/dashboard/home/insights?meetingId=${meeting?.meetingId}&sessionId=${meeting?.sessionId}`}>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <TrendingUp className="w-4 h-4" />
                    Insights
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}