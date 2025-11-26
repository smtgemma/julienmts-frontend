import Container from '@/lib/Container'
import { MdOutlineStar } from "react-icons/md";

function TestimonialSection() {
    return (
        <Container className='my-20'>
            {/* Header Section */}
            < div className="text-center px-3 md:px-0 mb-12" >
                <p className="text-[#6E51E0] font-semibold text-[16px] mb-3">
                    Testimonials
                </p>
                <h1 className="text-3xl md:text-4xl font-medium text-[#2D2D2D] mb-3">
                    Check what our clients are saying
                </h1>
            </div >
            <div className='flex justify-between items-center gap-20'>
                <div className='flex-1'>one</div>
                <div className='flex-1'>
                    <img src="/landingPage/testimonialSection/QuoteIcon.png" alt="" className='mb-5' />
                    <div className='flex items-center mb-5'>
                        <MdOutlineStar className='text-yellow-500 w-6 h-6' />
                        <MdOutlineStar className='text-yellow-500 w-6 h-6' />
                        <MdOutlineStar className='text-yellow-500 w-6 h-6' />
                        <MdOutlineStar className='text-yellow-500 w-6 h-6' />
                        <MdOutlineStar className='text-yellow-500 w-6 h-6' />
                        <MdOutlineStar className='text-yellow-500 w-6 h-6' />
                    </div>
                    <p className='text-2xl text-[#2D2D2D]'>Is be upon sang fond must shew. Really boy law county
                        she unable her sister. Feet you off its like like six. Among sex are leave law built now.</p>
                        <div className='flex justify-between items-center mt-10'>
                            <div>
                                <h4 className='text-xl font-bold text-[#2D2D2D]'>AR Shakir</h4>
                                <p className='text-[16px] text-[#636F85]'>CEO GetNextDesign</p>
                            </div>
                            <div>
                                <img src="landingPage/testimonialSection/segmaTextImage.png" alt="" />
                            </div>
                        </div>
                </div>
            </div>
        </Container>
    )
}

export default TestimonialSection