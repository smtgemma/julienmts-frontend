import Link from 'next/link';
import React from 'react';

const Navbar = () => {
    return (
        <div
            className='pt-6'
            style={{
                backgroundImage: "url('/navbarImage/navbarBackground.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className="max-w-[1200px] mx-auto bg-gradient-to-r from-[#F7F8FC] to-[#E6EEFF] border border-white rounded-2xl py-6 px-3 backdrop-blur-[2px] flex items-center justify-between">
                <h3 className='text-xl text-[#000000] italic'>SalesMind</h3>
                {/* center Menu */}
                <div className="flex items-center gap-12 text-#000000 text-[16px] font-medium">
                    <Link href="/">Home</Link>
                    <Link href="/about">About</Link>
                    <Link href="/pricing">Pricing</Link>
                    <Link href="/contact">Contact</Link>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-6">
                    <Link href="/signIn" className='text-[18px] text-[#2D2D2D]'>Login</Link>
                    <Link href="signUp" className="px-5 py-2 bg-gradient-to-t from-[#000000] to-[#6E51E0] text-white font-semibold rounded-[6px]">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Navbar