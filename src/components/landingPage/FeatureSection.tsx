import Container from "@/lib/Container"


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
                        className="bg-white rounded-2xl p-6 transition-shadow duration-300 shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                    >
                        {/* Step icon */}
                        <div className="inline-block bg-[#E0E0FC] rounded-lg px-3 py-3 mb-6">
                            <img src="/landingPage/featureSection/featureIcon1.png" alt="" className="w-5 h-5" />
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-medium text-[#2D2D2D] mb-4 leading-tight">
                            Instantly understand
                            your business
                        </h3>

                        {/* Description */}
                        <p className="text-[#636F85] text-sm leading-relaxed">
                            Make faster, smarter
                            decisions with Al-powered
                            insights that give you a full
                            cockpit view of your
                            business.
                        </p>
                    </div>
                    <div
                        className="bg-white rounded-2xl p-6 transition-shadow duration-300 shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                    >
                        {/* Step icon */}
                        <div className="inline-block bg-[#E0E0FC] rounded-lg px-3 py-3 mb-6">
                            <img src="/landingPage/featureSection/featureIcon2.png" alt="" className="w-5 h-5" />
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-medium text-[#2D2D2D] mb-4 leading-tight">
                            Save hours with
                            automatic analysis
                        </h3>

                        {/* Description */}
                        <p className="text-[#636F85] text-sm leading-relaxed">
                            No more spreadsheets. Your data is analyzed
                            automatically—so you can
                            focus on growth, not admin
                            tasks.
                        </p>
                    </div>
                    <div
                        className="bg-white rounded-2xl p-6 transition-shadow duration-300 shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                    >
                        {/* Step icon */}
                        <div className="inline-block bg-[#E0E0FC] rounded-lg px-3 py-3 mb-6">
                            <img src="/landingPage/featureSection/featureIcon3.png" alt="" className="w-5 h-5" />
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-medium text-[#2D2D2D] mb-4 leading-tight">
                            Predict problems <br />
                            before they happen
                        </h3>

                        {/* Description */}
                        <p className="text-[#636F85] text-sm leading-relaxed">
                            Spot trends and risks early with real—time Al alerts
                            before they impact your
                            business.

                        </p>
                    </div>
                    <div
                        className="bg-white rounded-2xl p-6 transition-shadow duration-300 shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                    >
                        {/* Step icon */}
                        <div className="inline-block bg-[#E0E0FC] rounded-lg px-3 py-3 mb-6">
                            <img src="/landingPage/featureSection/featureIcon4.png" alt="" className="w-5 h-5" />
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-medium text-[#2D2D2D] mb-4 leading-tight">
                            Actionable Al tips for <br /> growth
                        </h3>

                        {/* Description */}
                        <p className="text-[#636F85] text-sm leading-relaxed">
                            Get clear, actionable suggestions from Al to boost performance every single
                            day.

                        </p>
                    </div>
                    <div
                        className="bg-white rounded-2xl p-6 transition-shadow duration-300 shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                    >
                        {/* Step icon */}
                        <div className="inline-block bg-[#E0E0FC] rounded-lg px-3 py-3 mb-6">
                            <img src="/landingPage/featureSection/featureIcon1.png" alt="" className="w-5 h-5" />
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-medium text-[#2D2D2D] mb-4 leading-tight">
                            Instantly understand
                            your business
                        </h3>

                        {/* Description */}
                        <p className="text-[#636F85] text-sm leading-relaxed">
                            Make faster, smarter
                            decisions with Al-powered
                            insights that give you a full
                            cockpit view of your
                            business.
                        </p>
                    </div>
                    <div
                        className="bg-white rounded-2xl p-6 transition-shadow duration-300 shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                    >
                        {/* Step icon */}
                        <div className="inline-block bg-[#E0E0FC] rounded-lg px-3 py-3 mb-6">
                            <img src="/landingPage/featureSection/featureIcon2.png" alt="" className="w-5 h-5" />
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-medium text-[#2D2D2D] mb-4 leading-tight">
                            Save hours with
                            automatic analysis
                        </h3>

                        {/* Description */}
                        <p className="text-[#636F85] text-sm leading-relaxed">
                            No more spreadsheets. Your data is analyzed
                            automatically—so you can
                            focus on growth, not admin
                            tasks.
                        </p>
                    </div>
                    <div
                        className="bg-white rounded-2xl p-6 transition-shadow duration-300 shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                    >
                        {/* Step icon */}
                        <div className="inline-block bg-[#E0E0FC] rounded-lg px-3 py-3 mb-6">
                            <img src="/landingPage/featureSection/featureIcon3.png" alt="" className="w-5 h-5" />
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-medium text-[#2D2D2D] mb-4 leading-tight">
                            Predict problems <br />
                            before they happen
                        </h3>

                        {/* Description */}
                        <p className="text-[#636F85] text-sm leading-relaxed">
                            Spot trends and risks early with real—time Al alerts
                            before they impact your
                            business.

                        </p>
                    </div>
                    <div
                        className="bg-white rounded-2xl p-6 transition-shadow duration-300 shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                    >
                        {/* Step icon */}
                        <div className="inline-block bg-[#E0E0FC] rounded-lg px-3 py-3 mb-6">
                            <img src="/landingPage/featureSection/featureIcon4.png" alt="" className="w-5 h-5" />
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-medium text-[#2D2D2D] mb-4 leading-tight">
                            Actionable Al tips for <br /> growth
                        </h3>

                        {/* Description */}
                        <p className="text-[#636F85] text-sm leading-relaxed">
                            Get clear, actionable suggestions from Al to boost performance every single
                            day.

                        </p>
                    </div>
                </div>
            </Container>
        </div >
    )
}

export default FeatureSection