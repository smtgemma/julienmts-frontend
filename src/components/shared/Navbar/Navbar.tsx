
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// import {
//     Select,
//     SelectContent,
//     SelectGroup,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"

import * as React from "react"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import Container from '@/lib/Container';
import { PiGlobeLight } from "react-icons/pi";
import { IoIosMenu } from "react-icons/io";
import { useGetMeQuery } from "@/redux/api/getMe/getMeApi";
import { LanguageSwitcher } from "../googleTranslation/LanguageSwitcher";

const Navbar = () => {
    const { data: getMe } = useGetMeQuery("")
    const isLoggedIn = getMe;

    const pathName = usePathname()

    return (
        <div className='pt-6 px-3 md:px-0'>
            <Container className="bg-[#f5faf6] border border-white rounded-2xl py-2 px-3 backdrop-blur-[2px] flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-xl text-[#000000]">
                    <div className="flex items-center gap-2">
                        <img src="/navbar/logo.png" alt="logo" className='w-8 md:w-12 h-8 md:h-12' />
                        <h3 className='text-2xl text-[#6E51E0] font-semibold'>phora</h3>
                    </div>
                </Link>
                {/* Center Menu */}
                <div className="hidden lg:flex items-center md:gap-6 lg:gap-12 text-[#000000] text-[16px] font-medium">
                    <Link href="/" className={pathName === "/" ? "text-[#563FB1] font-semibold" : ""}>Home</Link>
                    <Link href="/about" className={pathName === "/about" ? "text-[#563FB1] font-semibold" : ""}>About</Link>
                    <Link href="/pricing" className={pathName === "/pricing" ? "text-[#563FB1] font-semibold" : ""}>Pricing</Link>
                    <Link href="/contact" className={pathName === "/contact" ? "text-[#563FB1] font-semibold" : ""}>Contact</Link>
                    {
                        isLoggedIn && (
                            <Link href="/dashboard/home" className={pathName === "/dashboard" ? "text-[#563FB1] font-semibold" : ""}>My Portal</Link>
                        )
                    }
                </div>

                {/* Right Section for large device */}
                <div className="hidden md:flex items-center gap-2 lg:gap-3">
                    {/* <Select>
                        <SelectTrigger className="flex items-center gap-2 border border-[#D1D6DB] px-1 lg:px-4 py-2 rounded-sm text-[#2D2D2D] focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-[#D1D6DB]
                      focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"> */}

                    {/* Globe icon on left */}
                    {/* <PiGlobeLight size={20} className="text-[#6B7280]" /> */}

                    {/* Placeholder with black color */}
                    {/* <SelectValue placeholder="Eng" className="text-black" />

                        </SelectTrigger> */}

                    {/* <SelectContent>
                            <SelectGroup>
                                <SelectItem value="English">Eng</SelectItem>
                                <SelectItem value="Bangla">Bang</SelectItem>
                                <SelectItem value="Arabic">Ara</SelectItem>
                                <SelectItem value="Hindi">Hin</SelectItem>
                                <SelectItem value="French">Fren</SelectItem>
                                <SelectItem value="Spanish">Span</SelectItem>
                                <SelectItem value="Italian">Itali</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select> */}


                    {/* <div className="flex items-center border border-[#D1D6DB] px-2 py-1 rounded-sm text-[#2D2D2D] focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-[#D1D6DB]
                          focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0">
                        <style dangerouslySetInnerHTML={{
                            __html: `
                            .goog-te-banner-frame,
                            .goog-te-top-frame,
                            .goog-te-float-frame,
                            [class*="VIpgJd"],
                            iframe[src*="translate"],
                            .skiptranslate {
                              display: none !important;
                            }
                          `}} /> */}
                    {/* <PiGlobeLight size={20} className="text-[#6B7280]" /> */}
                    {/* <LanguageSwitcher />
                    </div> */}

                    <Link href="/signIn" className="group">
                        <span className="px-4 lg:px-5 py-3 rounded-[6px] font-medium transition hover:bg-[#6E51E0] hover:text-white text-[#2D2D2D]">
                            Login
                        </span>
                    </Link>

                    <Link href="/signUp" className="group">
                        <span className="px-4 lg:px-5 py-3 rounded-[6px] font-medium transition bg-[#6E51E0] text-white">
                            Get Started
                        </span>
                    </Link>
                </div>

                {/* 🔽 Dropdown Menu Added for mobile device */}
                <div className="md:hidden">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant="outline">
                                <IoIosMenu />
                            </Button>
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
                            {
                                isLoggedIn && (
                                    <DropdownMenuItem className='px-2 py-0.5 hover:text-[#563FB1]'>
                                        <Link
                                            href="/dashboard/home"
                                            className={`w-full ${pathName === "/dashboard" ? "text-[#563FB1] font-semibold" : ""}`}
                                        >
                                            My Portal
                                        </Link>
                                    </DropdownMenuItem>
                                )
                            }
                            <DropdownMenuItem className='px-2 py-0.5 hover:text-[#563FB1]'>
                                <Link
                                    href="/signIn"
                                    className={`w-full ${pathName === "/login" ? "text-[#563FB1] font-semibold" : ""}`}
                                >
                                    Login
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className='px-2 py-0.5 hover:text-[#563FB1]'>
                                <Link
                                    href="/signUp"
                                    className={`w-full ${pathName === "/signUp" ? "text-[#563FB1] font-semibold" : ""}`}
                                >
                                    Get Started
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
