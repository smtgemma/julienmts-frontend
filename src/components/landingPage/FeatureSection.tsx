import Container from "@/lib/Container"


function FeatureSection() {
    // mobile device 
    const steps = [
        {
            id: 1, icon: "/landingPage/featureSection/featureIcon1.png",
            title: "Competitor Analysis",
            description: "Understand what competitors are doing right now.", completed: true
        },
        {
            id: 2, icon: "/landingPage/featureSection/featureIcon2.png",
            title: "Competitor Analysis",
            description: "Understand what competitors are doing right now.", completed: true
        },
        {
            id: 3, icon: "/landingPage/featureSection/featureIcon3.png",
            title: "Competitor Analysis",
            description: "Understand what competitors are doing right now.", completed: true
        },
        {
            id: 4, icon: "/landingPage/featureSection/featureIcon4.png",
            title: "Competitor Analysis",
            description: "Understand what competitors are doing right now.", completed: false
        }
    ];
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
                    Features
                </p>
                <h1 className="text-3xl md:text-4xl font-medium text-[#2D2D2D] mb-3">
                    Everything You Need to <br /> Prepare in Minutes
                </h1>
                <p className="text-[#636F85] text-[16px]">
                    Comprehensive insights powered by AI to help you win every meeting
                </p>
            </div >
            <Container className="mt-[60px] px-4 lg:px-0">
                {/* large device  */}
                <div className="hidden md:flex items-center max-w-[1040px] mx-auto">
                    <div>
                        <div>
                            <div className="bg-white rounded-xl pt-8 pb-[60px] pl-4 pr-8 relative border border-[#EFEFEF] mb-[96px]">
                                <div className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-b from-[#6E51E0] to-[#000000] rounded-lg flex items-center justify-center z-10">
                                    <img src="/landingPage/featureSection/featureIcon1.png" alt="" />
                                </div>

                                <h3 className="text-[18px] font-semibold text-[#101828] mb-2">
                                    Competitor Analysis
                                </h3>

                                <p className="text-[14px] text-[#636F85] leading-relaxed">
                                    Understand what competitors <br /> are doing right now.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl pt-8 pb-[60px] pl-4 pr-8 relative border border-[#EFEFEF]">
                                <div className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-b from-[#6E51E0] to-[#000000] rounded-lg flex items-center justify-center z-10">
                                    <img src="/landingPage/featureSection/featureIcon2.png" alt="" />
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
                            <div className="absolute w-14 h-14 bg-gradient-to-b from-[#6E51E0] to-[#000000] rounded-full flex items-center justify-center p-3">
                                <img src="/landingPage/featureSection/featureIcon5.png" alt="" />
                            </div>
                            <div className="border-2 border-r-transparent w-full h-full rounded-l-xl border-[#6E51E0]"></div>
                        </div>
                    </div>

                    <div>
                        <div className="bg-white rounded-xl pt-8 pb-[60px] pl-8 pr-6 relative border border-[#EFEFEF] mb-[96px]">
                            <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-b from-[#6E51E0] to-[#000000] rounded-lg flex items-center justify-center z-10">
                                <img src="/landingPage/featureSection/featureIcon3.png" alt="" />
                            </div>

                            <h3 className="text-[18px] font-semibold text-[#101828] mb-2">
                                Competitor Analysis
                            </h3>

                            <p className="text-[14px] text-[#636F85] leading-relaxed">
                                Understand what competitors <br /> are doing right now.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl pt-8 pb-[60px] pl-8 pr-6 relative border border-[#EFEFEF]">
                            <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-b from-[#6E51E0] to-[#000000] rounded-lg flex items-center justify-center z-10">
                                <img src="/landingPage/featureSection/featureIcon4.png" alt="" />
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
                {/* mobile device */}
                <div className="flex items-center justify-center min-h-screen md:hidden">
                    <div className="flex flex-col items-start relative">

                        {steps.map((step, index) => (
                            <div key={step.id} className="relative flex items-start">

                                {/* Left Icon (Circle/Box) */}
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 bg-gradient-to-b from-[#6E51E0] to-[#000000] rounded-lg flex items-center justify-center">
                                        <img src={step.icon} alt="" className="w-6 h-6" />
                                    </div>

                                    {/* Connector Line */}
                                    {index < steps.length - 1 && (
                                        <div className="w-[2px] h-30 bg-gradient-to-b from-[#6E51E0] to-[#000000] my-2 rounded-full"></div>
                                    )}
                                </div>

                                {/* Right Content */}
                                <div className="ml-8 mt-5 bg-white rounded-xl pt-8 pb-[60px] pl-4 pr-8 border border-[#EFEFEF] max-w-[250px]">
                                    <h3 className="text-[18px] font-semibold text-[#101828] mb-1">
                                        {step.title}
                                    </h3>
                                    <p className="text-[14px] text-[#636F85] leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>

                            </div>
                        ))}

                    </div>
                </div>

            </Container>
        </div >
    )
}

export default FeatureSection