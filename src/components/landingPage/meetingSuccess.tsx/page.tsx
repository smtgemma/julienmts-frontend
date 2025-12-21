import Container from '@/lib/Container'
import Link from 'next/link';
import React from 'react'
import { MdSlowMotionVideo } from "react-icons/md";

function MeetingSuccess() {
    return (
        <Container className=' mb-16'>
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
                        className="bg-white rounded-2xl p-8 transition-transform duration-300 shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:scale-105"
                    >
                        {/* Step Number */}
                        <div className="inline-block bg-[#F1EEFC] rounded-full px-3 py-2 mb-6">
                            <span className="text-xl text-primaryBgColor font-semibold">
                                01
                            </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-medium text-[#2D2D2D] mb-4 leading-tight">
                            Prepare Instantly with AI Research
                        </h3>

                        {/* Description */}
                        <p className="text-[#636F85] text-sm leading-relaxed">
                            Your meeting inputs (participants, company, product, goals) are transformed into a complete brief, with company insights, stakeholder profiles, and smart questions tailored to the sales methodology you use.
                        </p>
                    </div>
                    <div
                        className="bg-white rounded-2xl p-8 transition-transform duration-300 shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:scale-105"
                    >
                        {/* Step Number */}
                        <div className="inline-block bg-[#F1EEFC] rounded-full px-2.5 py-2 mb-6">
                            <span className="text-xl text-primaryBgColor font-semibold">
                                02
                            </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-medium text-[#2D2D2D] mb-4 leading-tight">
                            Start your meeting confidently
                        </h3>

                        {/* Description */}
                        <p className="text-[#636F85] text-sm leading-relaxed">
                            Run a live, voice-enabled simulation with one or more AI personas that reflect the real people you’ll meet. Practice your discovery, objections, and pitch in a safe, hyper-realistic environment.
                        </p>
                    </div>
                    <div
                        className="bg-white rounded-2xl p-8 transition-transform duration-300 shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:scale-105"
                    >
                        {/* Step Number */}
                        <div className="inline-block bg-[#F1EEFC] rounded-full px-2.5 py-2 mb-6">
                            <span className="text-xl text-primaryBgColor font-semibold">
                                03
                            </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-medium text-[#2D2D2D] mb-4 leading-tight">
                            Improve Fast with Instant Coaching
                        </h3>

                        {/* Description */}
                        <p className="text-[#636F85] text-sm leading-relaxed">
                            Right after the simulation, you get clear, actionable feedback on what worked, what to improve, the key questions you missed, and a CRM-ready call summary.
                        </p>
                    </div>
                </div>
            </div>
            {/* See How It Works Button */}
            <div className='flex justify-center items-center' >
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