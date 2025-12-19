import Container from "@/lib/Container"
import { Layers, MessageSquareText, Target, TrendingUp } from "lucide-react"


function FeatureSection() {
    return (
        <div
            className="pt-6 pb-[50px] md:pt-14 md:pb-[140px]"
            style={{
                backgroundImage: "url('/landingPage/featureSection/FeatureSectionIamge.jpg')",
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Header Section */}
            < div className="text-center px-3 md:px-0" >
                <p className="text-[#6E51E0] font-semibold text-[16px] mb-3">
                    Benefits
                </p>
                <h1 className="text-3xl md:text-4xl font-medium text-[#2D2D2D] mb-3">
                    Why businesses love
                    using <br />
                    our platform
                </h1>
                <p className="text-[#636F85] text-[16px]">
                    More clarity. Less work. Smarter decisions.
                </p>
            </div >
            <Container className="mt-[60px] px-4 lg:px-0">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                    <div
                        className="bg-white rounded-2xl p-6 transition-transform duration-300 shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:scale-105"
                    >
                        {/* Step icon */}
                        <div className="inline-block bg-[#E0E0FC] rounded-lg px-3 py-3 mb-6">
                            <img src="/landingPage/featureSection/featureIcon1.svg" alt="" className="w-5 h-5" />
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-medium text-[#2D2D2D] mb-4 leading-tight">
                            Instant, accurate pre-call research
                        </h3>

                        {/* Description */}
                        <p className="text-[#636F85] text-sm leading-relaxed">
                            Get instant insights on every account and stakeholder - instantly.
                        </p>
                    </div>
                    <div
                        className="bg-white rounded-2xl p-6 transition-transform duration-300 shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:scale-105"
                    >
                        {/* Step icon */}
                        <div className="inline-block bg-[#E0E0FC] rounded-lg px-3 py-3 mb-6">
                            <img src="/landingPage/featureSection/featureIcon2.svg" alt="" className="w-5 h-5" />
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-medium text-[#2D2D2D] mb-4 leading-tight">
                            Hyper-realistic meeting simulations
                        </h3>

                        {/* Description */}
                        <p className="text-[#636F85] text-sm leading-relaxed">
                            Practice with AI personas that replicate the actual people you'll meet, not generic role-plays.
                        </p>
                    </div>
                    <div
                        className="bg-white rounded-2xl p-6 transition-transform duration-300 shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:scale-105"
                    >
                        {/* Step icon */}
                        <div className="inline-block bg-[#E0E0FC] rounded-lg px-3 py-3 mb-6">
                            <img src="/landingPage/featureSection/featureIcon3.svg" alt="" className="w-5 h-5" />
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-medium text-[#2D2D2D] mb-4 leading-tight">
                            Smarter discovery, every time
                        </h3>

                        {/* Description */}
                        <p className="text-[#636F85] text-sm leading-relaxed">
                            Ask better questions and uncover real buying signals.
                        </p>
                    </div>
                    <div
                        className="bg-white rounded-2xl p-6 transition-transform duration-300 shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:scale-105"
                    >
                        {/* Step icon */}
                        <div className="inline-block bg-[#E0E0FC] rounded-lg px-3 py-3 mb-6">
                            <img src="/landingPage/featureSection/featureIcon4.svg" alt="" className="w-5 h-5" />
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-medium text-[#2D2D2D] mb-4 leading-tight">
                            95% better-qualified pipelines
                        </h3>

                        {/* Description */}
                        <p className="text-[#636F85] text-sm leading-relaxed">
                            Live frameworks (MEDDIC, BANT, SPIN…) fill themselves in as you practice.
                        </p>
                    </div>

                    <div
                        className="bg-white rounded-2xl p-6 transition-transform duration-300 shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:scale-105"
                    >
                        {/* Step icon */}
                        <div className="inline-block bg-[#E0E0FC] rounded-lg px-3 py-3 mb-6">
                            {/* <img src="/landingPage/featureSection/featureIcon1.svg" alt="" className="w-5 h-5" /> */}
                            <MessageSquareText className="w-5 h-5 text-[#6E51E0]" />
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-medium text-[#2D2D2D] mb-4 leading-tight">
                            Coaching that drives immediate improvement
                        </h3>

                        {/* Description */}
                        <p className="text-[#636F85] text-sm leading-relaxed">
                            Fast, actionable feedback after every session.
                        </p>
                    </div>
                    <div
                        className="bg-white rounded-2xl p-6 transition-transform duration-300 shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:scale-105"
                    >
                        {/* Step icon */}
                        <div className="inline-block bg-[#E0E0FC] rounded-lg px-3 py-3 mb-6">
                            {/* <img src="/landingPage/featureSection/featureIcon2.svg" alt="" className="w-5 h-5" /> */}
                            <Layers className="w-5 h-5 text-[#6E51E0]" />
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-medium text-[#2D2D2D] mb-4 leading-tight">
                            All account intelligence in one place
                        </h3>

                        {/* Description */}
                        <p className="text-[#636F85] text-sm leading-relaxed">
                            All meetings, notes, insights, and deal context stay organized under each account.
                        </p>
                    </div>
                    <div
                        className="bg-white rounded-2xl p-6 transition-transform duration-300 shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:scale-105"
                    >
                        {/* Step icon */}
                        <div className="inline-block bg-[#E0E0FC] rounded-lg px-3 py-3 mb-6">
                            {/* <img src="/landingPage/featureSection/featureIcon3.svg" alt="" className="w-5 h-5" /> */}
                            <TrendingUp className="w-5 h-5 text-[#6E51E0]" />
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-medium text-[#2D2D2D] mb-4 leading-tight">
                            Sales excellence that scales
                        </h3>

                        {/* Description */}
                        <p className="text-[#636F85] text-sm leading-relaxed">
                            Enable every rep to perform like your top 1%.
                        </p>
                    </div>
                    <div
                        className="bg-white rounded-2xl p-6 transition-transform duration-300 shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:scale-105"
                    >
                        {/* Step icon */}
                        <div className="inline-block bg-[#E0E0FC] rounded-lg px-3 py-3 mb-6">
                            {/* <img src="/landingPage/featureSection/featureIcon4.svg" alt="" className="w-5 h-5" /> */}
                            <Target className="w-5 h-5 text-[#6E51E0]" />
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-medium text-[#2D2D2D] mb-4 leading-tight">
                            More wins with less prep time
                        </h3>

                        {/* Description */}
                        <p className="text-[#636F85] text-sm leading-relaxed">
                            Walk into real meetings confident, informed, and ready to close
                        </p>
                    </div>
                </div>
            </Container>
        </div >
    )
}

export default FeatureSection