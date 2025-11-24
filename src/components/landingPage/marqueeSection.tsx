import Marquee from "react-fast-marquee";

function MarqueeSection() {
    return (
        <div className='border-t border-b border-[#94A3B8]'>
            <div className="my-12"> 
                <h3 className='md:text-2xl text-xl font-semibold text-[#2D2D2D] text-center mb-8'>Over 32k+ software  businesses growing with SalesMind</h3>
            <Marquee speed={50} gradient={false} className="flex items-center space-x-8 px-4 sm:px-8 md:px-12">
                <img src="/landingPage/openZpp.png" alt="OpenZeppelin" className="px-12" />
                <img src="/landingPage/orac.png" alt="Oracle" className="px-12 h-8" />
                <img src="/landingPage/mor.png" alt="Morpheus" className="px-12 h-8" />
                <img src="/landingPage/samsun.png" alt="Samsung" className="px-12 h-8" />
                <img src="/landingPage/mond.png" alt="Monday" className="px-12 h-8" />
                <img src="/landingPage/segm.png" alt="Segment" className="px-12 h-8" />
                <img src="/landingPage/pro.png" alt="Protonet" className="px-12 h-8" />
            </Marquee>
            </div>
        </div>
    )
}

export default MarqueeSection