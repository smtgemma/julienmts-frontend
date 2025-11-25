"use client"
import Link from 'next/link';
import ActiveNavigation from './activeNavigation';
import HerroSection from '@/components/landingPage/HerroSection';
import { usePathname } from 'next/navigation';

const Navbar = () => {
    const pathName = usePathname()
    return (
        <div
            className='py-6'
        // style={{
        //     backgroundImage: "url('/navbar/navbarBackground.png')",
        //     backgroundSize: "cover",
        //     backgroundPosition: "center",
        //     backgroundRepeat: "no-repeat",
        // }}
        >
            <div className="max-w-[1200px] mx-auto bg-gradient-to-r from-[#F7F8FC] to-[#E6EEFF] border border-white rounded-2xl py-6 px-3 backdrop-blur-[2px] flex items-center justify-between">
                <Link href="/" className='text-xl text-[#000000]'>
                <img src="/navbar/logo.png" alt="" />
                </Link>
                {/* center Menu */}
                <ActiveNavigation />
                {/* Right Section */}
                <div className="flex items-center">
                    <Link href="/signIn" className="group">
                        <span
                            className="px-5 py-3 rounded-[6px] font-medium transition
                                         group-hover:bg-gradient-to-t group-hover:from-[#000000] group-hover:to-[#6E51E0] hover:text-white text-[#2D2D2D]"
                        >
                            Login
                        </span>
                    </Link>
                    <Link href="/signUp" className="group">
                        <span
                            className="px-5 py-3 rounded-[6px] font-medium transition
                                         group-hover:bg-gradient-to-t group-hover:from-[#000000] group-hover:to-[#6E51E0] hover:text-white text-[#2D2D2D]"
                        >
                            Get Start
                        </span>
                    </Link>
                </div>
            </div>
            {
                pathName === "/" && (
                    <HerroSection />
                )
            }
        </div>
    );
};

export default Navbar