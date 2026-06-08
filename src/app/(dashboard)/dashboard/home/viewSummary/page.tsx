
// "use client"
// import { useConversationHistoryQuery } from '@/redux/api/myAccountApi/myAccountApi';
// import { ArrowRight, BarChart3, Calendar, Clock, Lightbulb, Play, User } from 'lucide-react';
// import { useSearchParams } from 'next/navigation';
// import { CiCircleCheck } from "react-icons/ci";
// import { format } from "date-fns";
// import Loading from '@/components/Others/Loading';
// import Link from 'next/link';

// function ViewSummary() {
//     const searchParams = useSearchParams();
//     const meetingId = searchParams.get("meetingId");
//     const sessionId = searchParams.get("sessionId");
//     // console.log(meetingId, sessionId);

//     const { data: getSummery, isLoading } = useConversationHistoryQuery({
//         session_id: sessionId,
//         meeting_id: meetingId,
//     })
//     // console.log(getSummery, "==========getSummery")
//     // MEDDIC part these 
//     const qualificationsMeddic = getSummery?.data?.analytics?.meddic || {};
//     // Convert to array of objects
//     const meddicArray = Object.entries(qualificationsMeddic).map(([key, value]) => ({
//         key,
//         value,
//     }));
//     const formattedQualifications = meddicArray.map((item, index) => ({
//         number: index + 1,
//         title: item.key
//             .replace(/_/g, " ")
//             .replace(/\b\w/g, (char) => char.toUpperCase()),
//         description: item.value,
//     }));

//     // key_points part these 
//     const keyPoints = getSummery?.data?.analytics?.key_points || []

//     // next step part these 
//     const nextStepsData = getSummery?.data?.analytics?.next_steps || []
//     const nextSteps = nextStepsData.map((item: any, index: number) => ({
//         number: index + 1,
//         title: `Step ${index + 1}`, // or customize if needed
//         subtitle: item,
//     }));

//     // console.log(getSummery?.data?.analytics?.next_steps, "==========getSummery")

//     if (isLoading) {
//         return (
//             <p>
//                 <Loading />
//             </p>
//         )
//     }
//     return (
//         <div>
//             {/* title part  */}
//             <div className="bg-white border border-[#6E51E0] rounded-[12px] p-6 my-6">
//                 <div className="flex items-center justify-between">
//                     <div className="flex-1">
//                         <h1 className="text-2xl font-medium text-[#2D2D2D] mb-4">
//                             Discovery Call with CMO
//                         </h1>

//                         <div className="flex items-center gap-6 text-sm text-gray-600">
//                             <div className="flex items-center gap-2">
//                                 <Calendar className="w-4 h-4 mb-1" />
//                                 <span className="text-[#636F85] text-sm">
//                                     {getSummery?.data?.created_at
//                                         ? format(new Date(getSummery.data.created_at), "dd MMM yyyy, hh:mm a")
//                                         : ""}
//                                 </span>
//                             </div>

//                             <div className="flex items-center gap-2">
//                                 <Clock className="w-4 h-4 mb-1" />
//                                 <span className='text-[#636F85] text-sm'>{getSummery?.data?.analytics?.total_duration} minutes</span>
//                             </div>

//                             {/* <div className="flex items-center gap-2">
//                                 <User className="w-4 h-4 mb-1" />
//                                 <span className='text-[#636F85] text-sm'>Sarah Miller</span>
//                             </div> */}
//                         </div>
//                     </div>

//                     <div className="ml-6">
//                         <div className="bg-[#6E51E0]/10 text-[#6E51E0] p-3 rounded-[8px] font-medium text-sm whitespace-nowrap">
//                             Overall Score: {getSummery?.data?.analytics?.overall_score}/100
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             {/* deal qualification part  */}
//             <div className="bg-white rounded-[12px] p-6 mb-6">
//                 <div className="flex items-center gap-2 mb-3">
//                     <Lightbulb className="w-6 h-6 text-[#D08700]" />
//                     {/* <h2 className="text-xl font-semibold text-[#2D2D2D]">Deal Qualification</h2> */}
//                     <h2 className="text-xl font-semibold text-[#2D2D2D]">MEDDIC </h2>
//                 </div>
//                 <div className="space-y-3">
//                     {formattedQualifications.map((item: any) => (
//                         <div key={item.number} className="bg-yellow-50 border border-yellow-100 rounded-[6px] p-4">
//                             <div className="flex gap-3">
//                                 <div className="flex-shrink-0 w-6 h-6 bg-[#FEF9C2] text-[#A65F00] rounded-full font-semibold text-[16px] flex items-center justify-center">
//                                     {item.number}
//                                 </div>
//                                 <div className="flex-1">
//                                     <h3 className="text-[#101010] text-[16px] font-medium mb-1">
//                                         {item.title}
//                                     </h3>
//                                     {/* <p className="text-sm text-[#636F85] leading-relaxed">
//                                         {item.description}
//                                     </p> */}
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//             {/* key points  */}
//             <div className="bg-white rounded-[12px] p-6 my-6">
//                 <div className="flex items-center gap-2 mb-3">
//                     <CiCircleCheck className="w-6 h-6 text-[#00A63E]" />
//                     <h2 className="text-xl font-semibold text-[#2D2D2D]">Key Points</h2>
//                 </div>

//                 <div className="space-y-3">
//                     {keyPoints?.map((item: any, index: number) => (
//                         <div
//                             key={index}
//                             className="bg-green-50 border-l-8 border-[#00A63E] py-6 px-2 rounded-l-[8px]"
//                         >
//                             <div className="flex gap-1.5">
//                                 <CiCircleCheck className="w-6 h-6 text-[#00A63E]" />
//                                 <p className="text-sm text-[#636F85]">
//                                     {item}
//                                 </p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//             {/* next steps  */}
//             <div className="bg-white rounded-[12px] border border-[#D1D6DB] p-6 mb-6">
//                 <div className="flex items-center gap-2 mb-3">
//                     <ArrowRight className="w-6 h-6 text-[#9810FA]" />
//                     <h2 className="text-xl font-semibold text-[#2D2D2D]">Next Steps</h2>
//                 </div>

//                 <div className="space-y-4">
//                     {nextSteps.map((step: any) => (
//                         <div key={step.number} className="bg-[#FAF5FF] p-4 rounded-sm">
//                             <div className="flex gap-4">
//                                 <div className="flex-shrink-0 w-6 h-6 bg-[#F3E8FF] text-[#9810FA] rounded-full font-semibold text-[16px] flex items-center justify-center">
//                                     {step.number}
//                                 </div>
//                                 <div className="flex-1">
//                                     <h3 className="text-[#101010] text-[16px] font-medium mb-1">
//                                         {step.title}
//                                     </h3>
//                                     <p className="text-sm text-[#636F85] leading-relaxed">
//                                         {step.subtitle}
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//             {/* button part  */}
//             <div className="flex gap-6 mb-6">
//                 <Link
//                     href={`/dashboard/home/replay?meetingId=${meetingId}&sessionId=${sessionId}`}
//                     className="flex-1"
//                 >
//                     <button className="w-full flex items-center justify-center gap-2 bg-white border border-[#D1D6DB] hover:border-[#6E51E0] text-[#0A0A0A] text-[16px] font-medium py-2.5 px-6 rounded-lg transition-colors cursor-pointer">
//                         <Play className="w-5 h-5" />
//                         Watch Replay
//                     </button>
//                 </Link>

//                 <Link
//                     href={`/dashboard/home/insights?meetingId=${meetingId}&sessionId=${sessionId}`}
//                     className="flex-1"
//                 >
//                     <button className="w-full flex items-center justify-center gap-2 bg-white border border-[#D1D6DB] hover:border-[#6E51E0] text-[#0A0A0A] text-[16px] font-medium py-2.5 px-6 rounded-lg transition-colors cursor-pointer">
//                         <BarChart3 className="w-5 h-5" />
//                         View Insights
//                     </button>
//                 </Link>
//             </div>
//         </div>
//     )
// }

// export default ViewSummary




"use client"
import React, { useEffect, useState } from 'react';
import { useConversationHistoryQuery } from '@/redux/api/myAccountApi/myAccountApi';
import { ArrowRight, BarChart3, Calendar, Clock, Lightbulb, Play, User } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { CiCircleCheck } from "react-icons/ci";
import { format } from "date-fns";
import Loading from '@/components/Others/Loading';
import Link from 'next/link';
import Cookies from 'js-cookie';

function ViewSummary() {
    const searchParams = useSearchParams();
    const meetingId = searchParams.get("meetingId");
    const sessionId = searchParams.get("sessionId");
    // console.log(meetingId, sessionId);

    const { data: getSummery, isLoading } = useConversationHistoryQuery({
        session_id: sessionId,
        meeting_id: meetingId,
    })

    // Methodology analysis state
    const [methodologyLoading, setMethodologyLoading] = useState(false);
    const [methodologyError, setMethodologyError] = useState<string | null>(null);
    const [methodologyData, setMethodologyData] = useState<any | null>(null);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api-julientmts.aiteamtwo.com/api/v1';

    useEffect(() => {
        const fetchMethodology = async () => {
            if (!meetingId || !sessionId) return;
            setMethodologyLoading(true);
            setMethodologyError(null);

            try {
                const token = Cookies.get('token');
                const res = await fetch(`${API_BASE}/conversation/${meetingId}/methodology-analysis?session_id=${sessionId}`, {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                });

                const json = await res.json();
                if (!res.ok || !json.success) {
                    throw new Error(json?.message || 'Failed to load methodology analysis');
                }

                setMethodologyData(json.data || null);
            } catch (err: any) {
                console.error('Methodology fetch error', err);
                setMethodologyError(err?.message || 'Unable to load methodology analysis');
            } finally {
                setMethodologyLoading(false);
            }
        };

        fetchMethodology();
    }, [meetingId, sessionId]);
    // console.log(getSummery, "==========getSummery")
    // MEDDIC part these 
    const qualificationsMeddic = getSummery?.data?.analytics?.meddic || {};
    // Convert to array of objects
    const meddicArray = Object.entries(qualificationsMeddic).map(([key, value]) => ({
        key,
        value,
    }));
    const formattedQualifications = meddicArray.map((item, index) => ({
        number: index + 1,
        title: item.key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase()),
        description: item.value,
    }));

    // key_points part these 
    const keyPoints = getSummery?.data?.analytics?.key_points || []

    // next step part these 
    const nextStepsData = getSummery?.data?.analytics?.next_steps || []
    const nextSteps = nextStepsData.map((item: any, index: number) => ({
        number: index + 1,
        title: `Step ${index + 1}`, // or customize if needed
        subtitle: item,
    }));

    // console.log(getSummery?.data?.analytics?.next_steps, "==========getSummery")

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
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h1 className="text-2xl font-medium text-[#2D2D2D] mb-4">
                            Discovery Call with CMO
                        </h1>

                        <div className="flex items-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 mb-1" />
                                <span className="text-[#636F85] text-sm">
                                    {getSummery?.data?.created_at
                                        ? format(new Date(getSummery.data.created_at), "dd MMM yyyy, hh:mm a")
                                        : ""}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 mb-1" />
                                <span className='text-[#636F85] text-sm'>{getSummery?.data?.analytics?.total_duration} minutes</span>
                            </div>

                            {/* <div className="flex items-center gap-2">
                                <User className="w-4 h-4 mb-1" />
                                <span className='text-[#636F85] text-sm'>Sarah Miller</span>
                            </div> */}
                        </div>
                    </div>

                    <div className="ml-6">
                        <div className="bg-[#6E51E0]/10 text-[#6E51E0] p-3 rounded-[8px] font-medium text-sm whitespace-nowrap">
                            Overall Score: {getSummery?.data?.analytics?.overall_score}/100
                        </div>
                    </div>
                </div>
            </div>
            {/* deal qualification part  */}
            <div className="bg-white rounded-[12px] p-6 mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-6 h-6 text-[#D08700]" />
                    <h2 className="text-xl font-semibold text-[#2D2D2D]">Deal Qualification</h2>
                </div>

                {methodologyLoading ? (
                    <div className="py-6">
                        <Loading />
                    </div>
                ) : methodologyError ? (
                    <div className="text-sm text-red-600">{methodologyError}</div>
                ) : methodologyData ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-lg font-semibold text-[#111827]">{methodologyData.methodology || '—'}</div>
                                <div className="text-sm text-[#6B7280] mt-1">Generated {methodologyData.generated_at ? new Date(methodologyData.generated_at).toLocaleString() : ''}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-[#636F85]">Coverage</div>
                                <div className={`text-2xl font-bold ${methodologyData.overall_coverage_score >= 50 ? 'text-green-600' : 'text-red-600'}`}>{methodologyData.overall_coverage_score}%</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {Array.isArray(methodologyData.fields_analyzed) && methodologyData.fields_analyzed.length > 0 ? (
                                methodologyData.fields_analyzed.map((f: any, idx: number) => (
                                    <div key={idx} className="p-4 rounded-lg border border-[#E6E7EB] bg-white">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h3 className="text-sm font-semibold text-[#111827]">{f.field}</h3>
                                                <p className="text-xs text-[#6B7280] mt-1">{f.definition}</p>
                                            </div>
                                            <div className="text-sm">
                                                {f.covered ? (
                                                    <span className="inline-flex items-center px-2 py-1 rounded bg-green-50 text-green-700 text-xs">Covered</span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-1 rounded bg-red-50 text-red-700 text-xs">Not covered</span>
                                                )}
                                            </div>
                                        </div>

                                        {f.coverage_notes ? <p className="text-sm text-[#4B5563] mt-3">{f.coverage_notes}</p> : null}

                                        {f.questions_asked && f.questions_asked.length > 0 && (
                                            <div className="mt-3">
                                                <div className="text-xs font-semibold text-[#374151] mb-1">Questions Asked</div>
                                                <ul className="list-disc list-inside text-sm text-[#6B7280]">
                                                    {f.questions_asked.map((q: string, i: number) => (
                                                        <li key={i}>{q}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {f.answers_received && f.answers_received.length > 0 && (
                                            <div className="mt-3">
                                                <div className="text-xs font-semibold text-[#374151] mb-1">Answers</div>
                                                <ul className="list-disc list-inside text-sm text-[#6B7280]">
                                                    {f.answers_received.map((a: string, i: number) => (
                                                        <li key={i}>{a}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-[#636F85]">No methodology fields analyzed for this session.</div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-sm text-[#636F85]">No methodology analysis available for this meeting.</div>
                )}
            </div>
            {/* next steps  */}
            <div className="bg-white rounded-[12px] border border-[#D1D6DB] p-6 mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <ArrowRight className="w-6 h-6 text-[#9810FA]" />
                    <h2 className="text-xl font-semibold text-[#2D2D2D]">Next Steps</h2>
                </div>

                <div className="space-y-4">
                    {nextSteps.map((step: any) => (
                        <div key={step.number} className="bg-[#FAF5FF] p-4 rounded-sm">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-6 h-6 bg-[#F3E8FF] text-[#9810FA] rounded-full font-semibold text-[16px] flex items-center justify-center">
                                    {step.number}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-[#101010] text-[16px] font-medium mb-1">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-[#636F85] leading-relaxed">
                                        {step.subtitle}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* button part  */}
            <div className="flex gap-6 mb-6">
                <Link
                    href={`/dashboard/home/replay?meetingId=${meetingId}&sessionId=${sessionId}`}
                    className="flex-1"
                >
                    <button className="w-full flex items-center justify-center gap-2 bg-white border border-[#D1D6DB] hover:border-[#6E51E0] text-[#0A0A0A] text-[16px] font-medium py-2.5 px-6 rounded-lg transition-colors cursor-pointer">
                        <Play className="w-5 h-5" />
                        Watch Replay
                    </button>
                </Link>

                <Link
                    href={`/dashboard/home/insights?meetingId=${meetingId}&sessionId=${sessionId}`}
                    className="flex-1"
                >
                    <button className="w-full flex items-center justify-center gap-2 bg-white border border-[#D1D6DB] hover:border-[#6E51E0] text-[#0A0A0A] text-[16px] font-medium py-2.5 px-6 rounded-lg transition-colors cursor-pointer">
                        <BarChart3 className="w-5 h-5" />
                        View Insights
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default ViewSummary