import Container from '@/lib/Container'
import Link from 'next/link';
import React from 'react'
import { MdSlowMotionVideo } from "react-icons/md";

function MeetingSuccess() {
    return (
        <Container>
            {/* Header Section */}
            <div className="text-center mt-20 mb-3">
                <p className="text-[#6E51E0] font-semibold text-[16px] mb-3">
                    How It Works
                </p>
                <h1 className="text-3xl md:text-4xl font-medium text-[#2D2D2D] mb-3">
                    Three Simple Steps to Meeting <br /> Success
                </h1>
                <p className="text-[#636F85] text-[16px] mb-6">
                    Go from zero to fully prepared in minutes with our AI-powered platform
                </p>
            </div>
            <div className="flex items-center justify-center px-6 pt-6">
                {/* Steps Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div
                        className="bg-white rounded-2xl p-8 transition-shadow duration-300 shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                    >
                        {/* Step Number */}
                        <div className="inline-block bg-[#F1EEFC] rounded-full px-3 py-2 mb-6">
                            <span className="text-xl text-primaryBgColor font-semibold">
                                01
                            </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-medium text-[#2D2D2D] mb-4 leading-tight">
                            Paste the Company <br />
                            Name or URL
                        </h3>

                        {/* Description */}
                        <p className="text-[#636F85] text-sm leading-relaxed">
                            We work closely with talented ceramic artists to bring you exclusive and one-of-a-kind designs.
                        </p>
                    </div>
                    <div
                        className="bg-white rounded-2xl p-8 transition-shadow duration-300 shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                    >
                        {/* Step Number */}
                        <div className="inline-block bg-[#F1EEFC] rounded-full px-3 py-2 mb-6">
                            <span className="text-xl text-primaryBgColor font-semibold">
                                02
                            </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-medium text-[#2D2D2D] mb-4 leading-tight">
                            Get Instant Smart <br />
                            Insights
                        </h3>

                        {/* Description */}
                        <p className="text-[#636F85] text-sm leading-relaxed">
                            We work closely with talented ceramic artists to bring you exclusive and one-of-a-kind designs.
                        </p>
                    </div>
                    <div
                        className="bg-white rounded-2xl p-8 transition-shadow duration-300 shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                    >
                        {/* Step Number */}
                        <div className="inline-block bg-[#F1EEFC] rounded-full px-3 py-2 mb-6">
                            <span className="text-xl text-primaryBgColor font-semibold">
                                03
                            </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-medium text-[#2D2D2D] mb-4 leading-tight">
                            Start Your Meeting <br /> Confidently
                        </h3>

                        {/* Description */}
                        <p className="text-[#636F85] text-sm leading-relaxed">
                            We work closely with talented ceramic artists to bring you exclusive and one-of-a-kind designs.
                        </p>
                    </div>
                </div>
            </div>
            {/* See How It Works Button */}
            <div className='flex justify-center items-center mb-20' >
                <Link href="">
                    <button
                        className="bg-white px-6 py-3 font-medium transition flex items-center gap-2 hover:bg-primaryBgColor border-2
                                         border-[#6E51E0] rounded-sm hover:text-white text-primaryBgColor text-[16px]"
                    >
                        <span className="">
                            See How It Works
                        </span>
                        <MdSlowMotionVideo className="w-5 h-5" />
                    </button>
                </Link>
            </div>

        </Container>
    )
}

export default MeetingSuccess