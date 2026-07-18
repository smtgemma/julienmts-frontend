
"use client"

import SubscriptionPlan from "../dashboard/subscription/Subscription";

function BussinessSection() {
    return (
        <div className='max-w-[1040px] mx-auto'>
            <div className='pt-6 md:pt-14'>
                <div className="text-center px-3 md:px-0 mb-10">
                    <h3 className="text-3xl md:text-5xl font-medium text-[#2D2D2D]">
                        Our Plans scale
                    </h3>

                    <div className='flex items-center justify-center gap-2'>
                        <h3 className="text-3xl md:text-5xl font-medium text-[#2D2D2D] mb-3">
                            with your
                        </h3>

                        <button className='text-3xl md:text-5xl text-[#6E51E0] font-medium bg-[#FCF1FE] px-2 py-1 md:px-[10px] md:py-[14px] rounded-sm'>
                            Business
                        </button>

                        <img
                            src="/landingPage/bussinessSection/bussinessSectionImage.png"
                            alt=""
                            className='hidden md:flex'
                        />
                    </div>
                </div>
                
                {/* pass planType */}
                <SubscriptionPlan />
            </div>
        </div>
    );
}

export default BussinessSection;