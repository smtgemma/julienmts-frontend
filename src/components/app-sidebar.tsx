
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
import { GrHomeRounded } from "react-icons/gr";
import { RiIdCardLine } from "react-icons/ri";
import { MdManageAccounts } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { IoSettingsOutline } from "react-icons/io5";
import { TfiHelpAlt } from "react-icons/tfi";
import { IoIosLogOut } from "react-icons/io";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useLogoutMutation } from "@/redux/api/auth/authApi";
import { useRouter } from "next/navigation";
import { CreditCard } from "lucide-react";


export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter()

  const refreshToken = useSelector((state: RootState) => state.user.refreshToken);
  // console.log(refreshToken, "==============")

  const [logout, { isLoading: logoutLoging }] = useLogoutMutation()

  // logout 
  const handleLogout = async () => {
    const payload = {
      refreshToken: refreshToken
    }
    try {
      await logout(payload).unwrap();

      // dispatch(logoutAction());
      Cookies.remove("token");
      Cookies.remove("refreshToken");

      toast.success("Logout successfully");

      setTimeout(() => {
        router.replace("/signIn");
      }, 1000);
    } catch (error: any) {
      toast.error(error?.data?.message || "Logout failed");
    }
  };

  const menuItems = [
    { label: "Home", href: "/dashboard/home", icon: GrHomeRounded },
    {
      label: "Start a New Meeting",
      href: "/dashboard/startNewMeeting",
      icon: RiIdCardLine,
    },
    {
      label: "My Accounts",
      href: "/dashboard/myAccount",
      icon: MdManageAccounts,
    },
    { label: "Dashboard", href: "/dashboard/dashboard", icon: RxDashboard },
    { label: "Subscriptions", href: "/dashboard/subscriptions", icon: CreditCard },
    {
      label: "Setting",
      href: "/dashboard/settingPage",
      icon: IoSettingsOutline,
    },
    { label: "Help", href: "/dashboard/help", icon: TfiHelpAlt },
  ];

  return (
    <Sidebar>
      <SidebarContent className="bg-white flex flex-col justify-between min-h-full p-4">
        {/* Top Section */}
        <div>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* Logo */}
                <div className="flex justify-start items-center mb-10 mt-2">
                  <Link href="/" className="flex items-center gap-2 ml-4">
                    <img
                      src="/navbar/logo.png"
                      alt="logo"
                      className="w-14 h-14"
                    />
                    <h3 className="text-3xl text-[#6E51E0] font-semibold">
                      Phora
                    </h3>
                  </Link>
                </div>

                {/* Navigation */}
                <div className="space-y-2">
                  {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const isSettings = item.href === "/dashboard/settingPage";
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center rounded-md gap-2 px-4 py-3 text-[16px] transition-all
                          ${isActive
                            ? "bg-primaryBgColor text-white"
                            : "bg-[#F5F6F7]/60 text-[#636F85] hover:bg-primaryBgColor hover:text-white"
                          }
                          ${isActive && isSettings
                            ? "border-t-2 border-[#6E51E0]"
                            : ""
                          }
                        `}
                      >
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}

                  <Separator className="my-3" />
                </div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* Logout */}
        <SidebarMenu>
          <div className="bg-[#FBE7E8] px-4 py-3 cursor-pointer rounded-sm mb-6">
            <button className="flex items-center cursor-pointer gap-1 w-full text-[#D00E11]"
              onClick={handleLogout}
            >
              <IoIosLogOut size={22} />
              <span className="text-[16px]">Logout</span>
            </button>
          </div>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
