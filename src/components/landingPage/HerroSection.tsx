
// "use client"
// import { useState } from "react"; // Modal state track korar jonyo change
// import Container from "@/lib/Container"
// import Link from "next/link"
// import { GoArrowRight } from "react-icons/go";
// import { MdSlowMotionVideo } from "react-icons/md";
// import { IoMdClose } from "react-icons/io"; // Modal close button-er icon

// function HerroSection() {
//     // Video modal open ache kina ta check korar state
//     const [isVideoOpen, setIsVideoOpen] = useState(false);

//     return (
//         <Container className="relative mb-12">
//             <div className="z-50">
//                 {/* Hero Section */}
//                 <main className="px-6">
//                     <div className="">
//                         {/* Top Banner */}
//                         <div className="flex items-center justify-center gap-2 mb-6 mt-16">
//                             <div
//                                 className="rounded-full px-2 md:px-2 py-2 border border-white flex items-center gap-2 whitespace-nowrap bg-gray-100"
//                                 style={{
//                                     boxShadow:
//                                         'inset 0 2px 8px rgba(2, 2, 2, 0.2), inset 0 -1px 2px rgba(255, 255, 255, 0.5)',
//                                 }}
//                             >
//                                 <div className="flex items-center justify-center gap-2 bg-white rounded-full p-1 md:p-2">
//                                     <img
//                                         src="/landingPage/heroSection/starIcon.png"
//                                         alt=""
//                                         className="w-4 md:w-5 h-4 md:h-5"
//                                     />
//                                     <span className="text-xs md:text-sm md:text-[16px] font-medium text-[#2D2D2D]">
//                                         Get Pro 15%
//                                     </span>
//                                 </div>

//                                 <span className="text-xs md:text-sm md:text-[16px] font-medium text-[#2D2D2D]">
//                                     Join the waitlist for an instant offer
//                                 </span>
//                             </div>
//                         </div>

//                         {/* Main Heading */}
//                         <h1 className="text-4xl md:text-6xl font-bold text-center text-[#2D2D2D] mb-5 leading-tight">
//                             Prepare for Every Sales Meeting<br />
//                             Like a Top 1% Sales Rep.
//                         </h1>

//                         {/* Subheading */}
//                         <p className="text-center text-[#636F85] text-[16px] mb-7 max-w-2xl mx-auto">
//                             AI-powered pre-call research, realistic meeting simulations, and instant coaching - so
//                             you walk into every conversation confident, informed, and ready to win.
//                         </p>

//                         {/* CTA Buttons */}
//                         <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
//                             <Link href="">
//                                 <div
//                                     className="bg-white px-6 py-3 font-medium transition flex items-center gap-2 hover:bg-primaryBgColor border-2
//                                          border-[#6E51E0] rounded-sm hover:text-white text-primaryBgColor text-[16px] cursor-pointer"
//                                 >
//                                     <span>
//                                         Prepare My Meeting
//                                     </span>
//                                     <GoArrowRight className="w-5 h-5" />
//                                 </div>
//                             </Link>

//                             {/* Button onClick add kora hoyeche */}
//                             <button 
//                                 onClick={() => setIsVideoOpen(true)}
//                                 className="bg-white px-6 py-3 font-medium transition flex items-center gap-2 hover:bg-primaryBgColor border-2
//                                          border-[#6E51E0] rounded-sm hover:text-white text-primaryBgColor text-[16px] cursor-pointer"
//                                 type="button"
//                             >
//                                 <span>
//                                     See How It Works
//                                 </span>
//                                 <MdSlowMotionVideo className="w-5 h-5" />
//                             </button>
//                         </div>
//                     </div>
//                 </main>
//             </div>

//             {/* Video Modal Component */}
//             {isVideoOpen && (
//                 <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4">
//                     <div className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden shadow-2xl">

//                         {/* Close Button */}
//                         <button 
//                             onClick={() => setIsVideoOpen(false)}
//                             className="absolute top-4 right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-80 p-2 rounded-full z-50 transition-all"
//                         >
//                             <IoMdClose className="w-6 h-6" />
//                         </button>

//                         {/* Video Player (Responsive) */}
//                         <div className="relative pt-[56.25%] w-full">
//                             {/* jodi YouTube video hoy tobe iframe use korbe, ar nijeder video hole <video> tag use korbe */}
//                             <iframe 
//                                 className="absolute inset-0 w-full h-full"
//                                 src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" // Ekhane tomar video link bosao (autoplay songe deya ache)
//                                 title="Product Demo Video"
//                                 frameBorder="0"
//                                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                                 allowFullScreen
//                             ></iframe>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </Container>
//     )
// }

// export default HerroSection




"use client"
import { useState } from "react"; // Modal state track korar jonyo change
import Container from "@/lib/Container"
import Link from "next/link"
import { GoArrowRight } from "react-icons/go";
import { MdSlowMotionVideo } from "react-icons/md";

function HerroSection() {
    return (
        <Container className="relative mb-12">
            <div className="z-50">
                {/* Hero Section */}
                <main className="px-6">
                    <div className="">
                        {/* Top Banner */}
                        <div className="flex items-center justify-center gap-2 mb-6 mt-16">
                            <div
                                className="rounded-full px-2 md:px-2 py-2 border border-white flex items-center gap-2 whitespace-nowrap bg-gray-100"
                                style={{
                                    boxShadow:
                                        'inset 0 2px 8px rgba(2, 2, 2, 0.2), inset 0 -1px 2px rgba(255, 255, 255, 0.5)',
                                }}
                            >
                                <div className="flex items-center justify-center gap-2 bg-white rounded-full p-1 md:p-2">
                                    <img
                                        src="/landingPage/heroSection/starIcon.png"
                                        alt=""
                                        className="w-4 md:w-5 h-4 md:h-5"
                                    />
                                    <span className="text-xs md:text-sm md:text-[16px] font-medium text-[#2D2D2D]">
                                        Get Pro 15%
                                    </span>
                                </div>

                                <span className="text-xs md:text-sm md:text-[16px] font-medium text-[#2D2D2D]">
                                    Join the waitlist for an instant offer
                                </span>
                            </div>
                        </div>


                        {/* Main Heading */}
                        <h1 className="text-4xl md:text-6xl font-bold text-center text-[#2D2D2D] mb-5 leading-tight">
                            Prepare for Every Sales Meeting<br />
                            Like a Top 1% Sales Rep.
                        </h1>

                        {/* Subheading */}
                        <p className="text-center text-[#636F85] text-[16px] mb-7 max-w-2xl mx-auto">
                            AI-powered pre-call research, realistic meeting simulations, and instant coaching - so
                            you walk into every conversation confident, informed, and ready to win.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
                            <Link href="">
                                <div
                                    className="bg-white px-6 py-3 font-medium transition flex items-center gap-2 hover:bg-primaryBgColor border-2
                                         border-[#6E51E0] rounded-sm hover:text-white text-primaryBgColor text-[16px]"
                                >
                                    <span className="">
                                        Prepare My Meeting
                                    </span>
                                    <GoArrowRight className="w-5 h-5" />
                                </div>
                            </Link>

                            <Link href="" className="">
                                <div
                                    className="bg-white px-6 py-3 font-medium transition flex items-center gap-2 hover:bg-primaryBgColor border-2
                                         border-[#6E51E0] rounded-sm hover:text-white text-primaryBgColor text-[16px]"
                                >
                                    <span className="">
                                        See How It Works
                                    </span>
                                    <MdSlowMotionVideo className="w-5 h-5" />
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


// "use client"
// import { useState } from "react"; // Modal state track korar jonyo change
// import Container from "@/lib/Container"
// import Link from "next/link"
// import { GoArrowRight } from "react-icons/go";
// import { MdSlowMotionVideo } from "react-icons/md";
// import { IoMdClose } from "react-icons/io"; // Modal close button-er icon

// function HerroSection() {
//     // Video modal open ache kina ta check korar state
//     const [isVideoOpen, setIsVideoOpen] = useState(false);

//     return (
//         <Container className="relative mb-12">
//             <div className="z-50">
//                 {/* Hero Section */}
//                 <main className="px-6">
//                     <div className="">
//                         {/* Top Banner */}
//                         <div className="flex items-center justify-center gap-2 mb-6 mt-16">
//                             <div
//                                 className="rounded-full px-2 md:px-2 py-2 border border-white flex items-center gap-2 whitespace-nowrap bg-gray-100"
//                                 style={{
//                                     boxShadow:
//                                         'inset 0 2px 8px rgba(2, 2, 2, 0.2), inset 0 -1px 2px rgba(255, 255, 255, 0.5)',
//                                 }}
//                             >
//                                 <div className="flex items-center justify-center gap-2 bg-white rounded-full p-1 md:p-2">
//                                     <img
//                                         src="/landingPage/heroSection/starIcon.png"
//                                         alt=""
//                                         className="w-4 md:w-5 h-4 md:h-5"
//                                     />
//                                     <span className="text-xs md:text-sm md:text-[16px] font-medium text-[#2D2D2D]">
//                                         Get Pro 15%
//                                     </span>
//                                 </div>

//                                 <span className="text-xs md:text-sm md:text-[16px] font-medium text-[#2D2D2D]">
//                                     Join the waitlist for an instant offer
//                                 </span>
//                             </div>
//                         </div>

//                         {/* Main Heading */}
//                         <h1 className="text-4xl md:text-6xl font-bold text-center text-[#2D2D2D] mb-5 leading-tight">
//                             Prepare for Every Sales Meeting<br />
//                             Like a Top 1% Sales Rep.
//                         </h1>

//                         {/* Subheading */}
//                         <p className="text-center text-[#636F85] text-[16px] mb-7 max-w-2xl mx-auto">
//                             AI-powered pre-call research, realistic meeting simulations, and instant coaching - so
//                             you walk into every conversation confident, informed, and ready to win.
//                         </p>

//                         {/* CTA Buttons */}
//                         <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
//                             <Link href="">
//                                 <div
//                                     className="bg-white px-6 py-3 font-medium transition flex items-center gap-2 hover:bg-primaryBgColor border-2
//                                          border-[#6E51E0] rounded-sm hover:text-white text-primaryBgColor text-[16px] cursor-pointer"
//                                 >
//                                     <span>
//                                         Prepare My Meeting
//                                     </span>
//                                     <GoArrowRight className="w-5 h-5" />
//                                 </div>
//                             </Link>

//                             {/* Button onClick add kora hoyeche */}
//                             <button 
//                                 onClick={() => setIsVideoOpen(true)}
//                                 className="bg-white px-6 py-3 font-medium transition flex items-center gap-2 hover:bg-primaryBgColor border-2
//                                          border-[#6E51E0] rounded-sm hover:text-white text-primaryBgColor text-[16px] cursor-pointer"
//                                 type="button"
//                             >
//                                 <span>
//                                     See How It Works
//                                 </span>
//                                 <MdSlowMotionVideo className="w-5 h-5" />
//                             </button>
//                         </div>
//                     </div>
//                 </main>
//             </div>

//             {/* Video Modal Component */}
//             {isVideoOpen && (
//                 <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4">
//                     <div className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden shadow-2xl">
                        
//                         {/* Close Button */}
//                         <button 
//                             onClick={() => setIsVideoOpen(false)}
//                             className="absolute top-4 right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-80 p-2 rounded-full z-50 transition-all"
//                         >
//                             <IoMdClose className="w-6 h-6" />
//                         </button>

//                         {/* Video Player (Responsive) */}
//                         <div className="relative pt-[56.25%] w-full">
//                             {/* jodi YouTube video hoy tobe iframe use korbe, ar nijeder video hole <video> tag use korbe */}
//                             <iframe 
//                                 className="absolute inset-0 w-full h-full"
//                                 src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" // Ekhane tomar video link bosao (autoplay songe deya ache)
//                                 title="Product Demo Video"
//                                 frameBorder="0"
//                                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                                 allowFullScreen
//                             ></iframe>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </Container>
//     )
// }

// export default HerroSection