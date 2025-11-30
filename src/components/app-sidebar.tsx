

"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GrHomeRounded } from "react-icons/gr";
import { RiIdCardLine } from "react-icons/ri";
import { MdManageAccounts } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { IoSettingsOutline } from "react-icons/io5";
import { TfiHelpAlt } from "react-icons/tfi";
import { IoIosLogOut } from "react-icons/io";

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent className="bg-white flex flex-col justify-between min-h-full p-4">
        {/* Top Section */}
        <div>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* Profile */}
                <div className="flex justify-center items-center mb-3">
                  <Link href="/" className="text-xl text-[#000000]">
                    <div className="flex items-center gap-2">
                      <img src="/navbar/logo.png" alt="logo" className='w-8 md:w-12 h-8 md:h-12' />
                      <h3 className='text-2xl text-[#6E51E0] font-semibold'>phora</h3>
                    </div>
                  </Link>
                </div>
                <div className="space-y-2">
                  {/* navigation  */}
                  <button
                    className={`flex items-center w-full gap-2 rounded-sm px-2 py-1.5 transition-colors bg-[#F5F6F7] text-[16px] text-[#636F85] hover:text-white ${pathname === "/"
                      ? "bg-[#F7F7F81A] text-white"
                      : "text-[#D5D6E2] hover:bg-primaryBgColor hover:text-white focus:bg-[#F7F7F81A] focus:text-white"
                      }`}
                  >
                    <Link href="/" className="flex items-center gap-1 w-full text-[#636F85] hover:text-white">
                      <GrHomeRounded size={16} />
                      <span className="text-[16px]">Home</span>
                    </Link>
                  </button>
                  <button
                    className={`flex items-center w-full gap-2 rounded-sm px-2 py-1.5 transition-colors bg-[#F5F6F7] text-[16px] text-[#636F85] hover:text-white ${pathname === "/"
                      ? "bg-[#F7F7F81A] text-white"
                      : "text-[#D5D6E2] hover:bg-primaryBgColor hover:text-white focus:bg-[#F7F7F81A] focus:text-white"
                      }`}
                  >
                    <Link href="/" className="flex items-center gap-1 w-full text-[#636F85] hover:text-white">
                      <RiIdCardLine size={20} />
                      <span className="text-[16px]">Start a New Meeting</span>
                    </Link>
                  </button>
                  <button
                    className={`flex items-center w-full gap-2 rounded-sm px-2 py-1.5 transition-colors bg-[#F5F6F7] text-[16px] text-[#636F85] hover:text-white ${pathname === "/"
                      ? "bg-[#F7F7F81A] text-white"
                      : "text-[#D5D6E2] hover:bg-primaryBgColor hover:text-white focus:bg-[#F7F7F81A] focus:text-white"
                      }`}
                  >
                    <Link href="/" className="flex items-center gap-1 w-full text-[#636F85] hover:text-white">
                      <MdManageAccounts size={22} />
                      <span className="text-[16px]">My Accounts</span>
                    </Link>
                  </button>
                  <button
                    className={`flex items-center w-full gap-2 rounded-sm px-2 py-1.5 transition-colors bg-[#F5F6F7] text-[16px] text-[#636F85] hover:text-white ${pathname === "/"
                      ? "bg-[#F7F7F81A] text-white"
                      : "text-[#D5D6E2] hover:bg-primaryBgColor hover:text-white focus:bg-[#F7F7F81A] focus:text-white"
                      }`}
                  >
                    <Link href="/" className="flex items-center gap-1 w-full text-[#636F85] hover:text-white">
                      <RxDashboard size={20} />
                      <span className="text-[16px]">Dashboard</span>
                    </Link>
                  </button>
                  <div className="my-3">
                    <Separator />
                  </div>

                  <button
                    className={`flex items-center w-full gap-2 rounded-sm px-2 py-1.5 transition-colors bg-[#F5F6F7] text-[16px] text-[#636F85] hover:text-white ${pathname === "/"
                      ? "bg-[#F7F7F81A] text-white"
                      : "text-[#D5D6E2] hover:bg-primaryBgColor hover:text-white focus:bg-[#F7F7F81A] focus:text-white"
                      }`}
                  >
                    <Link href="/" className="flex items-center gap-1 w-full text-[#636F85] hover:text-white">
                      <IoSettingsOutline size={20} />
                      <span className="text-[16px]">Setting</span>
                    </Link>
                  </button>
                  <button
                    className={`flex items-center w-full gap-2 rounded-sm px-2 py-1.5 transition-colors bg-[#F5F6F7] text-[16px] text-[#636F85] hover:text-white ${pathname === "/"
                      ? "bg-[#F7F7F81A] text-white"
                      : "text-[#D5D6E2] hover:bg-primaryBgColor hover:text-white focus:bg-[#F7F7F81A] focus:text-white"
                      }`}
                  >
                    <Link href="/" className="flex items-center gap-1 w-full text-[#636F85] hover:text-white">
                      <TfiHelpAlt size={18} />
                      <span className="text-[16px]">Help</span>
                    </Link>
                  </button>
                </div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
        <SidebarMenu>
          <div className="bg-[#FBE7E8] px-2 py-1.5 rounded-sm cursor-pointer mb-20">
            <button className="flex items-center gap-1 w-full text-[#D00E11]">
            <IoIosLogOut size={22} />
            <span className="text-[16px]">Logout</span>
          </button>
          </div>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar >
  );
}


