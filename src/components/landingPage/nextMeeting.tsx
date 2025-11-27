import Container from '@/lib/Container'
import Link from "next/link"
import { GoArrowRight } from "react-icons/go";

function NextMeeting() {
  return (
    <div className='bg-[#F7F8FA] relative'>
      {/* content on top of background images */}
      <div className="relative z-20">
        <Container>
          <div className='text-center py-[60px] md:py-[126px]'>
            <h3 className='text-4xl font-semibold text-[#2D2D2D]'>
              Walk Into Your Next Meeting <br /> Fully Prepared.
            </h3>

            {/* buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">

              {/* button 1 */}
              <Link href="">
                <div className="group p-[2px] rounded-lg bg-gradient-to-b from-[#6E51E0] to-[#000000]">
                  <div
                    className="bg-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 shadow-sm
                                group-hover:bg-gradient-to-t group-hover:from-[#000000] group-hover:to-[#6E51E0]"
                  >
                    <span className="bg-gradient-to-b from-[#6E51E0] to-[#000000] text-transparent bg-clip-text group-hover:text-white">
                      Prepare My Meeting
                    </span>
                    <GoArrowRight className="w-5 h-5 group-hover:text-white" />
                  </div>
                </div>
              </Link>

              {/* button 2 */}
              <Link href="">
                <div className="group p-[2px] rounded-lg bg-gradient-to-b from-[#6E51E0] to-[#000000]">
                  <div
                    className="bg-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 shadow-sm
                                group-hover:bg-gradient-to-t group-hover:from-[#000000] group-hover:to-[#6E51E0]"
                  >
                    <span className="bg-gradient-to-b from-[#6E51E0] to-[#000000] text-transparent bg-clip-text group-hover:text-white">
                      Try it Free
                    </span>
                    <GoArrowRight className="w-5 h-5 group-hover:text-white" />
                  </div>
                </div>
              </Link>

            </div>
          </div>
        </Container>
      </div>

      {/* background images behind content */}
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
