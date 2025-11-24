import Container from "@/lib/Container"


function FeatureSection() {
    return (
        <div className="w-full h-[1100px] pt-14 lg:bg-[url('/landingPage/FeatureSectionIamge.jpg')] lg:bg-cover lg:bg-no-repeat lg:bg-[position:100%_100%]"
        >
            {/* Header Section */}
            <div className="text-center">
                <p className="text-[#6E51E0] font-semibold text-[16px] mb-3">
                    Features
                </p>
                <h1 className="text-3xl md:text-4xl font-medium text-[#2D2D2D] mb-3">
                    Everything You Need to <br /> Prepare in Minutes
                </h1>
                <p className="text-[#636F85] text-[16px]">
                    Comprehensive insights powered by AI to help you win every meeting
                </p>
            </div>
            <Container className="mt-[60px] px-4 lg:px-0">
                <div className="flex items-center">
                    <div>
                        <div>
                            <div className="bg-white rounded-xl pt-8 pb-[60px] pl-4 pr-8 relative border border-[#EFEFEF] mb-[96px]">
                                <div className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#4C1D95] rounded-lg flex items-center justify-center z-10">
                                    <img src="/landingPage/featureIcon1.png" alt="" />
                                </div>

                                <h3 className="text-[18px] font-semibold text-[#101828] mb-2">
                                    Competitor Analysis
                                </h3>

                                <p className="text-[14px] text-[#636F85] leading-relaxed">
                                    Understand what competitors <br /> are doing right now.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl pt-8 pb-[60px] pl-4 pr-8 relative border border-[#EFEFEF]">
                                <div className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#4C1D95] rounded-lg flex items-center justify-center z-10">
                                    <img src="/landingPage/featureIcon1.png" alt="" />
                                </div>

                                <h3 className="text-[18px] font-semibold text-[#101828] mb-2">
                                    Competitor Analysis
                                </h3>

                                <p className="text-[14px] text-[#636F85] leading-relaxed">
                                    Understand what competitors <br /> are doing right now.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* <div className="flex-1 relative">
                        <div className="flex justify-center items-center gap-6 h-[275px]">
                            <div className="border border-l-transparent w-full h-full rounded-r-xl "></div>
                            <div className="absolute w-16 h-16 bg-[#4C1D95] rounded-full flex items-center justify-center">
                                <img src="/landingPage/featureIcon1.png" alt="" />
                            </div>
                            <div className="border border-r-transparent w-full h-full rounded-l-xl"></div>
                        </div>
                    </div> */}

                    <div className="flex-1 relative">
                        <div className="flex justify-center items-center gap-6 h-[275px]">
                            <div className="border-2 border-l-transparent w-full h-full rounded-r-xl border-[#6E51E0]"></div>
                            <div className="absolute w-16 h-16 bg-[#4C1D95] rounded-full flex items-center justify-center">
                                <img src="/landingPage/featureIcon1.png" alt="" />
                            </div>
                            <div className="border-2 border-r-transparent w-full h-full rounded-l-xl border-[#6E51E0]"></div>
                        </div>
                    </div>

                    <div>
                        <div className="bg-white rounded-xl pt-8 pb-[60px] pl-8 pr-6 relative border border-[#EFEFEF] mb-[96px]">
                            <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#4C1D95] rounded-lg flex items-center justify-center z-10">
                                <img src="/landingPage/featureIcon1.png" alt="" />
                            </div>

                            <h3 className="text-[18px] font-semibold text-[#101828] mb-2">
                                Competitor Analysis
                            </h3>

                            <p className="text-[14px] text-[#636F85] leading-relaxed">
                                Understand what competitors <br /> are doing right now.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl pt-8 pb-[60px] pl-8 pr-6 relative border border-[#EFEFEF]">
                            <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#4C1D95] rounded-lg flex items-center justify-center z-10">
                                <img src="/landingPage/featureIcon1.png" alt="" />
                            </div>

                            <h3 className="text-[18px] font-semibold text-[#101828] mb-2">
                                Competitor Analysis
                            </h3>

                            <p className="text-[14px] text-[#636F85] leading-relaxed">
                                Understand what competitors <br /> are doing right now.
                            </p>
                        </div>
                    </div>

                </div>
            </Container>
        </div>
    )
}

export default FeatureSection