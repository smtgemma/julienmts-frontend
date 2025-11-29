// "use client"
// import Link from 'next/link';
// import ActiveNavigation from './activeNavigation';
// import HerroSection from '@/components/landingPage/HerroSection';
// import { usePathname } from 'next/navigation';

// const Navbar = () => {
//     const pathName = usePathname()
//     return (
//         <div
//             className='py-6 '
//         style={{
//             backgroundImage: "url('/navbar/navbarBackground.png')",
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//             backgroundRepeat: "no-repeat",
//             //  background: "linear-gradient(to right, #FBCFE8, #EDE9FE, #BFDBFE)",

//             //  background: "linear-gradient(to top, #FFFFFF, #FFFFFF, #FFFFFF, #EDE9FE, #FCF6FE)",
//     //          background: `
//     // radial-gradient(at top right, #DDE7FF 0%, transparent 80%),
//     // radial-gradient(at center, #FEFEFF 0%, transparent 70%),
//     // radial-gradient(at top left, #FAEAFE 0%, transparent 95%)
// //   `
//         }}
//         >
//             {/* <div className="bg-gradient-to-top from-[#FBCFE8] via-[#EDE9FE] to-[#BFDBFE] h-[300px] w-full"></div> */}
//             <div className="max-w-[1200px] mx-auto bg-gradient-to-r from-[#F7F8FC] to-[#E6EEFF] border border-white rounded-2xl py-6 px-3 backdrop-blur-[2px] flex items-center justify-between">
//                 <Link href="/" className='text-xl text-[#000000]'>
//                 <img src="/navbar/logo.png" alt="" />
//                 </Link>
//                 {/* center Menu */}
//                 <ActiveNavigation />
//                 {/* Right Section */}
//                 <div className="flex items-center">
//                     <Link href="/signIn" className="group">
//                         <span
//                             className="px-5 py-3 rounded-[6px] font-medium transition
//                                          group-hover:bg-gradient-to-t group-hover:from-[#000000] group-hover:to-[#6E51E0] hover:text-white text-[#2D2D2D]"
//                         >
//                             Login
//                         </span>
//                     </Link>
//                     <Link href="/signUp" className="group">
//                         <span
//                             className="px-5 py-3 rounded-[6px] font-medium transition
//                                          group-hover:bg-gradient-to-t group-hover:from-[#000000] group-hover:to-[#6E51E0] hover:text-white text-[#2D2D2D]"
//                         >
//                             Get Start
//                         </span>
//                     </Link>
//                 </div>
//             </div>
//             {/* {
//                 pathName === "/" && (
//                     <HerroSection />
//                 )
//             } */}
//         </div>
//     );
// };

// export default Navbar
















// "use client"
// import Container from '@/lib/Container';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';

// const Navbar = () => {
//     const pathName = usePathname()
//     return (
//         <div
//             // className='py-6 mb-30'
//             className='pt-6'
//             style={{
//                 backgroundImage: `
//                   linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0)),
//                   url('/navbar/navbarBackground.png')
//                 `,
//                 backgroundSize: "cover",
//                 backgroundPosition: "center",
//                 backgroundRepeat: "no-repeat",
//                 width: "100%"
//             }}
//         >
//             <div className="max-w-[1200px] mx-auto bg-gradient-to-r from-[#F7F8FC] to-[#E6EEFF] border border-white rounded-2xl py-2 px-3 backdrop-blur-[2px] flex items-center justify-between">
//                 <Link href="/" className='text-xl text-[#000000]'>
//                     <img src="/navbar/logo.png" alt="" />
//                 </Link>
//                 {/* center Menu */}
//                 <div>
//                     <div className="hidden md:flex items-center md:gap-6 lg:gap-12 text-[#000000] text-[16px] font-medium">
//                         <Link href="/" className={pathName === "/" ? "text-[#563FB1] font-semibold" : " "}>Home</Link>
//                         <Link href="/about" className={pathName === "/about" ? "text-[#563FB1] font-semibold" : " "}>About</Link>
//                         <Link href="/pricing" className={pathName === "/pricing" ? "text-[#563FB1] font-semibold" : " "}>Pricing</Link>
//                         <Link href="/contact" className={pathName === "/contact" ? "text-[#563FB1] font-semibold" : " "}>Contact</Link>
//                     </div>
//                 </div>
//                 {/* Right Section */}
//                 <div className="flex items-center">
//                     <Link href="/signIn" className="group">
//                         <span
//                             className="px-5 py-3 rounded-[6px] font-medium transition
//                                          group-hover:bg-gradient-to-t group-hover:from-[#000000] group-hover:to-[#6E51E0] hover:text-white text-[#2D2D2D]"
//                         >
//                             Login
//                         </span>
//                     </Link>
//                     <Link href="/signUp" className="group">
//                         <span
//                             className="px-5 py-3 rounded-[6px] font-medium transition
//                                          group-hover:bg-gradient-to-t group-hover:from-[#000000] group-hover:to-[#6E51E0] hover:text-white text-[#2D2D2D]"
//                         >
//                             Get Start
//                         </span>
//                     </Link>
//                 </div>
//             </div>
//             {/* Top Banner */}
//             {
//                 pathName === "/" && (
//                     <div className="flex items-center justify-center gap-2 mb-6 mt-16">
//                         <div className="bg-gradient-to-r from-[#F7F8FC] to-[#E6EEFF] backdrop-blur-[2px] rounded-full px-2 md:px-4 py-2 border border-white flex items-center gap-2">
//                             <div className="w-5 h-5 rounded-full flex items-center justify-center">
//                                 <img src="/landingPage/heroSection/starIcon.png" alt="" />
//                             </div>
//                             <span className="text-sm md:text-[16px] font-medium text-[#2D2D2D]">Get Pro 15%</span>
//                             <span className="text-sm md:text-[16px] font-medium text-[#2D2D2D]">Join the waitlist for an instant offer</span>
//                         </div>
//                     </div>
//                 )
//             }
//             {
//                 pathName === "/about" && (
//                     <div className='bg-white py-20 mt-6'>
//                         <Container>
//                         <div className='flex justify-between items-center'>
//                             <h3>About Us</h3>
//                             <Link href="/">Home/About Us</Link>
//                         </div>
//                     </Container>
//                     </div>
//                 )
//             }
//             {/* {
//                 pathName === "/" && (
//                     <HerroSection />
//                 )
//             } */}
//         </div>
//     );
// };

// export default Navbar




"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import * as React from "react"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import Container from '@/lib/Container';

const Navbar = () => {
    const pathName = usePathname()

    return (
        <div className='pt-6 px-3 md:px-0'>
            <Container className="bg-[#F8F5FA] border-4 border-white rounded-2xl py-2 px-3 backdrop-blur-[2px] flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-xl text-[#000000]">
                    <div className="flex items-center gap-2">
                        <img src="/navbar/logo.png" alt="logo" className='w-8 md:w-12 h-8 md:h-12' />
                        <h3 className='text-2xl text-[#6E51E0] font-semibold'>phora</h3>
                    </div>
                </Link>
                {/* Center Menu */}
                <div className="hidden md:flex items-center md:gap-6 lg:gap-12 text-[#000000] text-[16px] font-medium">
                    <Link href="/" className={pathName === "/" ? "text-[#563FB1] font-semibold" : ""}>Home</Link>
                    <Link href="/about" className={pathName === "/about" ? "text-[#563FB1] font-semibold" : ""}>About</Link>
                    <Link href="/pricing" className={pathName === "/pricing" ? "text-[#563FB1] font-semibold" : ""}>Pricing</Link>
                    <Link href="/contact" className={pathName === "/contact" ? "text-[#563FB1] font-semibold" : ""}>Contact</Link>
                </div>

                {/* Right Section for large device */}
                <div className="hidden md:flex items-center gap-2 lg:gap-3">

                    <Link href="/signIn" className="group">
                        <span className="px-5 py-3 rounded-[6px] font-medium transition hover:bg-[#6E51E0] hover:text-white text-[#2D2D2D]">
                            Login
                        </span>
                    </Link>

                    <Link href="/signUp" className="group">
                        <span className="px-5 py-3 rounded-[6px] font-medium transition hover:bg-[#6E51E0] hover:text-white text-[#2D2D2D]">
                            Get Start
                        </span>
                    </Link>
                </div>

                {/* 🔽 Dropdown Menu Added for mobile device */}
                <div className="md:hidden">
                    <DropdownMenu>
                        <DropdownMenuTrigger >
                            <Button variant="outline">Menu</Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-56 md:hidden">
                            <DropdownMenuItem className='px-2 py-0.5 hover:text-[#563FB1]'>
                                <Link
                                    href="/"
                                    className={`${pathName === "/" ? "text-[#563FB1] font-semibold" : ""}`}
                                >
                                    Home
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem className='px-2 py-0.5 hover:text-[#563FB1]'>
                                <Link
                                    href="/about"
                                    className={`${pathName === "/about" ? "text-[#563FB1] font-semibold" : ""}`}
                                >
                                    About
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem className='px-2 py-0.5 hover:text-[#563FB1]'>
                                <Link
                                    href="/pricing"
                                    className={`${pathName === "/pricing" ? "text-[#563FB1] font-semibold" : ""}`}
                                >
                                    Pricing
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem className='px-2 py-0.5 hover:text-[#563FB1]'>
                                <Link
                                    href="/contact"
                                    className={`w-full ${pathName === "/contact" ? "text-[#563FB1] font-semibold" : ""}`}
                                >
                                    Contact
                                </Link>
                            </DropdownMenuItem>

                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

            </Container>
        </div>
    );
};

export default Navbar;
