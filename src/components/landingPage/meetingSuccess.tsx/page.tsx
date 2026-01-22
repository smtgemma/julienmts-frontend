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
                    {/* Three Simple Steps to Meeting <br /> Success */}
                    Walk Into Every Meeting Fully <br /> Prepared - In Minutes
                </h1>
                <p className="text-[#636F85] text-[16px] mb-6">
                    {/* Go from zero to fully prepared in minutes with our AI-powered platform */}
                    Instant research, realistic practice, and AI coaching so you br show up <br /> confident and in control.
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
                        <h3 className="text-xl font-medium text-[#2D2D2D] mb-1 leading-tight">
                            {/* Prepare Instantly with AI Research */}
                            Know Your Buyer Before the Call Starts
                        </h3>
                        <p className='mb-4'> AI-powered research, done instantly.</p>

                        {/* Description */}
                        <p className="text-[#636F85] text-sm leading-relaxed">
                            Turn basic meeting details into a complete prep brief - company insights, stakeholder profiles, tailored questions, and sales-methodology–aligned talking points. No manual research. No guesswork.
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
                        <h3 className="text-xl font-medium text-[#2D2D2D] mb-1 leading-tight">
                            Practice the Real Conversation - Not a Script
                        </h3>
                        <p className='mb-4'> Live, voice-based AI simulations.</p>
                        {/* Description */}
                        <p className="text-[#636F85] text-sm leading-relaxed">
                            Run realistic meeting simulations with AI personas that mirror the people you’ll actually meet. Practice discovery, handle objections, and refine your pitch in a safe, hyper-realistic environment.
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
                        <h3 className="text-xl font-medium text-[#2D2D2D] mb-1 leading-tight">
                            Get Coached on What Actually Moves the Deal Forward
                        </h3>
                        <p className='mb-4'> Instant, actionable feedback.</p>

                        {/* Description */}
                        <p className="text-[#636F85] text-sm leading-relaxed">
                            Immediately after your simulation, receive clear coaching on what worked, what didn’t, the questions you missed, and a CRM-ready summary - so every meeting makes you better.
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