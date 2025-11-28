
import React from 'react'

function DashboardSection() {
    return (
        <div className="max-w-[1425px] mx-auto lg:-mt-16 lg:-mb-14 relative">
            <img
                src="/landingPage/dashboardSection/dashboardImage.png"
                alt="Dashboard"
                className="w-full h-auto object-cover"
            />

            {/* Overlay Box */}
            <div
                className="
      absolute bottom-2 lg:bottom-14 left-1/2 -translate-x-1/2 
      bg-white
      w-full
      p-4 md:p-8 lg:p-11
      text-center
    "
            >
            </div>
        </div>
    )
}

export default DashboardSection