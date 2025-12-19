// import Marquee from "react-fast-marquee";

// function MarqueeSection() {
//     return (
//         <div className='border-t border-b border-gray-200 bg-white'>
//             <div className="my-12"> 
//                 <h3 className='md:text-2xl text-xl font-semibold text-[#2D2D2D] text-center mb-8'>Over 32k+ software  businesses growing with SalesMind</h3>
//             <Marquee speed={50} gradient={false} className="flex items-center space-x-8 px-4 sm:px-8 md:px-12">
//                 <img src="/landingPage/marqueeSection/openZpp.png" alt="OpenZeppelin" className="px-12 h-11" />
//                 <img src="/landingPage/marqueeSection/orac.png" alt="Oracle" className="px-12 h-8" />
//                 <img src="/landingPage/marqueeSection/mor.png" alt="Morpheus" className="px-12 h-16" />
//                 <img src="/landingPage/marqueeSection/samsun.png" alt="Samsung" className="px-12 h-8" />
//                 <img src="/landingPage/marqueeSection/mond.png" alt="Monday" className="px-12 h-12" />
//                 <img src="/landingPage/marqueeSection/segm.png" alt="Segment" className="px-12 h-12" />
//                 <img src="/landingPage/marqueeSection/pro.png" alt="Protonet" className="px-12 h-12" />
//             </Marquee>
//             </div>
//         </div>
//     )
// }

// export default MarqueeSection



"use client";

import Marquee from "react-fast-marquee";
import Image from "next/image";

type User = {
    id: number;
    name: string;
    image: string;
    linkedin: string;
};

const users: User[] = [
    {
        id: 1,
        name: "John Doe",
        image: "/dashboardImage/profileImage.svg",
        linkedin: "https://www.linkedin.com/in/johndoe",
    },
    {
        id: 2,
        name: "Jane Smith",
        image: "/dashboardImage/profileImage.svg",
        linkedin: "https://www.linkedin.com/in/janesmith",
    },
    {
        id: 3,
        name: "Alex Brown",
        image: "/dashboardImage/profileImage.svg",
        linkedin: "https://www.linkedin.com/in/alexbrown",
    },
    {
        id: 4,
        name: "Emily Clark",
        image: "/dashboardImage/profileImage.svg",
        linkedin: "https://www.linkedin.com/in/emilyclark",
    },
];

export default function MarqueeSection() {
    return (
        <section className='border-t border-b border-gray-200 bg-white my-24'>
            <h2 className="text-2xl font-semibold text-center pt-6">
                Meet Our Professionals
            </h2>

            {/* <Marquee pauseOnHover speed={40} gradient={false}> */}
            <div className="flex flex-wrap gap-12 justify-center items-center">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="mx-6 cursor-pointer py-6"
                        onClick={() => window.open(user.linkedin, "_blank")}
                    >
                        <div className="w-24 h-24 rounded-full overflow-hidden border hover:scale-105 transition-transform">
                            <Image
                                src={user.image}
                                alt={user.name}
                                width={96}
                                height={96}
                                className="object-cover"
                            />
                        </div>

                        <p className="text-sm text-center mt-2">{user.name}</p>
                    </div>
                ))}
            </div>
            {/* </Marquee> */}
        </section>
    );
}
