import Link from 'next/link';
import ActiveNavigation from './activeNavigation';

const Navbar = () => {
    return (
        <div
            className='py-6'
            style={{
                backgroundImage: "url('/navbarIamge/navbarBackground.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className="max-w-[1200px] mx-auto bg-gradient-to-r from-[#F7F8FC] to-[#E6EEFF] border border-white rounded-2xl py-6 px-3 backdrop-blur-[2px] flex items-center justify-between">
                <Link href="/" className='text-xl text-[#000000] italic'>SalesMind</Link>
                {/* center Menu */}
                <ActiveNavigation/>
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