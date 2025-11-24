import Container from "@/lib/Container"
import Link from "next/link"
import { GoArrowRight, GoArrowUpRight } from "react-icons/go";

function HerroSection() {
    return (
        <Container>
            <div>
                {/* Hero Section */}
                <main className="px-6">
                    <div className="">
                        {/* Top Banner */}
                        <div className="flex items-center justify-center gap-2 mb-6 mt-16">
                            <div className="bg-gradient-to-r from-[#F7F8FC] to-[#E6EEFF] backdrop-blur-[2px] rounded-full px-2 md:px-4 py-2 border border-white flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full flex items-center justify-center">
                                    <img src="/heroSection/starIcon.png" alt="" />
                                </div>
                                <span className="text-sm md:text-[16px] font-medium text-[#2D2D2D]">Get Pro 15%</span>
                                <span className="text-sm md:text-[16px] font-medium text-[#2D2D2D]">Join the waitlist for an instant offer</span>
                            </div>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-4xl md:text-6xl font-bold text-center text-[#2D2D2D] mb-5 leading-tight">
                            Prepare for Every Sales Meeting<br />
                            Like a Top 1% Sales Rep.
                        </h1>

                        {/* Subheading */}
                        <p className="text-center text-[#636F85] text-[16px] mb-5 max-w-2xl mx-auto">
                            AI-powered pre-call research, realistic meeting simulations, and instant coaching — so
                            you walk into every conversation confident, informed, and ready to win.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
                            <Link href="" className="group">
                                <div className="p-[2px] rounded-lg bg-gradient-to-b from-[#6E51E0] to-[#000000]">
                                    <div
                                        className="bg-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 shadow-sm
                                        group-hover:bg-gradient-to-t group-hover:from-[#000000] group-hover:to-[#6E51E0]"
                                    >
                                        <span className="bg-gradient-to-b from-[#6E51E0] to-[#000000] text-transparent bg-clip-text group-hover:text-white">
                                            Prepare My Meeting
                                        </span>
                                        <GoArrowRight className="w-5 h-5 group-hover:text-white" />
                                    </div>
                                </div>
                            </Link>

                            <Link href="" className="group">
                                <div className="p-[2px] rounded-lg bg-gradient-to-b from-[#6E51E0] to-[#000000]">
                                    <div
                                        className="bg-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 shadow-sm
                                         group-hover:bg-gradient-to-t group-hover:from-[#000000] group-hover:to-[#6E51E0]"
                                    >
                                        <span className="bg-gradient-to-b from-[#6E51E0] to-[#000000] text-transparent bg-clip-text group-hover:text-white">
                                            See How It Works
                                        </span>
                                        <GoArrowUpRight className="w-5 h-5 group-hover:text-white" />
                                    </div>
                                </div>
                            </Link>

                        </div>
                    </div>
                </main>
            </div>
        </Container>
    )
}

export default HerroSection