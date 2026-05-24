"use client"
import Container from '@/lib/Container'
import { GoArrowRight } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
import { LuLogIn } from "react-icons/lu";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

function NextMeeting() {
  const router = useRouter();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  const handlePrepareMeeting = () => {
    const token = Cookies.get("token");
    if (token) {
      router.push("/dashboard/startNewMeeting");
    } else {
      setIsSignInModalOpen(true);
    }
  };

  const handleGoToLogin = () => {
    setIsSignInModalOpen(false);
    router.push(`/signIn?redirect=/dashboard/startNewMeeting`);
  };

  return (
    <div className='bg-[#F7F8FA] relative'>

      {/* Sign In Required Modal */}
      {isSignInModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setIsSignInModalOpen(false)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsSignInModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition cursor-pointer"
            >
              <IoMdClose className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 rounded-full bg-[#6E51E0] flex items-center justify-center mb-5">
              <LuLogIn className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#2D2D2D] mb-3">Sign In Required</h2>
            <p className="text-center text-[#636F85] text-sm mb-7 leading-relaxed">
              You need to be signed in to prepare your meeting.<br />
              Please log in or create an account to continue.
            </p>
            <button
              onClick={handleGoToLogin}
              className="w-full flex items-center justify-center gap-2 bg-[#6E51E0] hover:bg-[#5a3fd4] text-white font-medium py-3.5 rounded-full transition cursor-pointer mb-3"
            >
              <LuLogIn className="w-5 h-5" />
              Go to Login
            </button>
            <button
              onClick={() => setIsSignInModalOpen(false)}
              className="w-full flex items-center justify-center bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#2D2D2D] font-medium py-3.5 rounded-full transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* content on top of background images */}
      <div className="relative z-20">
        <Container>
          <div className='text-center py-[60px] md:py-[126px]'>
            <h3 className='text-4xl font-semibold text-[#2D2D2D]'>
              Walk Into Your Next Meeting <br /> Fully Prepared.
            </h3>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-10 mb-12">
              <button
                onClick={handlePrepareMeeting}
                className="bg-white px-6 py-3 font-medium transition flex items-center gap-2 hover:bg-primaryBgColor border-2
                  border-[#6E51E0] rounded-sm hover:text-white text-primaryBgColor text-[16px] cursor-pointer"
              >
                <span>Prepare My Meeting</span>
                <GoArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* background images */}
      <div className='absolute inset-0 z-0'>
        <img
          src="/landingPage/NextMeeting/nextMeetingImageTop.png"
          alt=""
          className='absolute top-0 left-0 right-0 w-full h-auto'
        />
        <img
          src="/landingPage/NextMeeting/nextMeetingImageBottom.png"
          alt=""
          className='absolute bottom-0 left-0 right-0 w-full h-auto'
        />
      </div>
    </div>
  )
}

export default NextMeeting
