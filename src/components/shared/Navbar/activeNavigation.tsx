"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

function ActiveNavigation() {
    const pathName = usePathname()
    return (
        <div>
            <div className="flex items-center gap-12 text-#000000 text-[16px] font-medium">
                <Link href="/" className={pathName === "/" ? "text-[#563FB1] font-semibold" : " "}>Home</Link>
                <Link href="/about" className={pathName === "/about" ? "text-[#563FB1] font-semibold" : " "}>About</Link>
                <Link href="/pricing" className={pathName === "/pricing" ? "text-[#563FB1] font-semibold" : " "}>Pricing</Link>
                <Link href="/contact" className={pathName === "/contact" ? "text-[#563FB1] font-semibold" : " "}>Contact</Link>
            </div>
        </div>
    )
}

export default ActiveNavigation