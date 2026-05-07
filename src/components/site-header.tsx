
// "use client"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { IoNotificationsOutline } from "react-icons/io5"
// import { SidebarTrigger } from "@/components/ui/sidebar"
// import Image from "next/image"
// import { usePathname } from "next/navigation";
// import { useGetAllNotificationsQuery, useGetMeQuery, useReadNotificationMutation } from "@/redux/api/getMe/getMeApi"
// import { Bell } from "lucide-react"

// export function SiteHeader() {
//   const pathname = usePathname();

//   const { data: getMe } = useGetMeQuery("")
//   const { data: getAllNotifications } = useGetAllNotificationsQuery("")
//   const notifications = getAllNotifications?.data || []

//   const [readNotification] = useReadNotificationMutation()
//   const handleNotification = async (id: any) => {
//     try {
//       const response = await readNotification(id).unwrap();
//       // console.log(response, "========")
//     } catch (error) {
//       // console.log(error, "error")
//     }
//   }
//   return (
//     <header className="py-10 flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
//       <div className="flex w-full items-center gap-1 px-6 py-6 lg:gap-2 lg:px-6">
//         <SidebarTrigger className="-ml-1" />
//         {
//           (pathname === "/dashboard" || pathname === "/dashboard/home") && (
//             <div>
//               <h1 className="text-xl font-bold text-primaryBgColor">
//                 Welcome back, {getMe?.data?.firstName || "N/A"} {getMe?.data?.lastName || "N/A"}
//               </h1>
//               <p className="sm text-[#636F85]">
//                 Here's your meeting activity and insights for today.
//               </p>
//             </div>
//           )
//         }
//         {
//           pathname === "/dashboard/startNewMeeting" && (
//             <div>
//               <h1 className="text-xl font-bold text-primaryBgColor">
//                 Start New Meeting
//               </h1>
//               <p className="sm text-[#636F85]">
//                 Configure your AI-powered meeting simulation
//               </p>
//             </div>
//           )
//         }
//         {
//           pathname === "/dashboard/myAccount" && (
//             <div>
//               <h1 className="text-xl font-bold text-primaryBgColor">
//                 My Accounts
//               </h1>
//               <p className="sm text-[#636F85]">
//                 Manage your active accounts and opportunities
//               </p>
//             </div>
//           )
//         }
//         {
//           pathname === "/dashboard/dashboard" && (
//             <div>
//               <h1 className="text-xl font-bold text-primaryBgColor">
//                 Analytics Dashboard
//               </h1>
//               <p className="sm text-[#636F85]">
//                 Track your performance and insights
//               </p>
//             </div>
//           )
//         }
//         {
//           pathname === "/dashboard/settingPage" && (
//             <div>
//               <h1 className="text-xl font-bold text-primaryBgColor">
//                 Settings
//               </h1>
//               <p className="sm text-[#636F85]">
//                 Manage your account settings and preferences
//               </p>
//             </div>
//           )
//         }
//         {
//           pathname === "/dashboard/help" && (
//             <div>
//               <h1 className="text-xl font-bold text-primaryBgColor">
//                 Help
//               </h1>
//               <p className="sm text-[#636F85]">
//                 Manage your help
//               </p>
//             </div>
//           )
//         }
//         <div className="ml-auto flex items-center gap-2">
//           <div>
//             <DropdownMenu>
//               <DropdownMenuTrigger className="focus:outline-none focus:ring-0">
//                 {/* Notification icon */}
//                 <div className="w-10 h-10 bg-[#F3F4F6] rounded-full flex items-center justify-center relative cursor-pointer transition focus:none">
//                   <IoNotificationsOutline size={20} className="text-[#2D2D2D]" />
//                   {/* Purple dot */}
//                   <span className="absolute top-3 right-3 w-2 h-2 bg-[#6E51E0] rounded-full" />
//                 </div>
//               </DropdownMenuTrigger>

//               <DropdownMenuContent className="w-96 h-95 border border-gray-50">
//                 {notifications.map((notification: any) => (
//                   <div
//                     key={notification.id}
//                     className="hover:bg-gray-100 transition-shadow px-4 py-3"
//                   >
//                     <button
//                       type="button"
//                       className="w-full text-left flex items-start gap-4"
//                     >
//                       <div className="flex-shrink-0">
//                         <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
//                           <Bell className="w-5 h-5 text-white" />
//                         </div>
//                       </div>

//                       <div
//                         className={`flex-1 min-w-0 text-sm ${notification.isRead ? "text-gray-500" : "text-gray-800 font-medium cursor-pointer"
//                           }`}
//                         onClick={() => handleNotification(notification?.id)}

//                       >
//                         {/* <h3 className="font-semibold text-gray-900 mb-1 text-base">
//                           {notification.title}
//                         </h3> */}
//                         <p>
//                           {notification.message}
//                         </p>
//                         <time>
//                           {new Date(notification.createdAt).toLocaleString()}
//                         </time>
//                       </div>
//                     </button>
//                   </div>
//                 ))}
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//           <div className="ml-auto flex items-center gap-2">
//             {/* Profile */}
//             <div className="flex items-center gap-2 bg-[#F3F4F6] rounded-full px-3 py-1.5">
//               <div className="w-7 h-7 rounded-full overflow-hidden bg-[#d2caf0]">
//                 <Image
//                   src={getMe?.data?.profileImage ? getMe?.data?.profileImage : "/dashboardImage/profileImage.svg"}
//                   width={28}
//                   height={28}
//                   alt="User"
//                   className="object-cover"
//                 />
//               </div>
//               <span className="text-sm font-medium text-[#2D2D2D]">
//                 {getMe?.data?.firstName || "N/A"} {getMe?.data?.lastName || "N/A"}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   )
// }





"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IoNotificationsOutline } from "react-icons/io5"
import { SidebarTrigger } from "@/components/ui/sidebar"
import Image from "next/image"
import { usePathname } from "next/navigation";
import { useGetAllNotificationsQuery, useGetMeQuery, useReadNotificationMutation } from "@/redux/api/getMe/getMeApi"
import { Bell } from "lucide-react"

export function SiteHeader() {
  const pathname = usePathname();

  const { data: getMe } = useGetMeQuery("")
  const { data: getAllNotifications } = useGetAllNotificationsQuery("")
  const notifications = getAllNotifications?.data || []
  console.log(notifications, "===================notifications")

  const [readNotification] = useReadNotificationMutation()
  const handleNotification = async (id: any) => {
    try {
      const response = await readNotification(id).unwrap();
      // console.log(response, "========")
    } catch (error) {
      // console.log(error, "error")
    }
  }
  return (
    <header className="py-10 flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-6 py-6 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        {
          (pathname === "/dashboard" || pathname === "/dashboard/home") && (
            <div>
              <h1 className="text-xl font-bold text-primaryBgColor">
                Welcome back, {getMe?.data?.firstName || "N/A"} {getMe?.data?.lastName || "N/A"}
              </h1>
              <p className="sm text-[#636F85]">
                Here's your meeting activity and insights for today.
              </p>
            </div>
          )
        }
        {
          pathname === "/dashboard/startNewMeeting" && (
            <div>
              <h1 className="text-xl font-bold text-primaryBgColor">
                Start New Meeting
              </h1>
              <p className="sm text-[#636F85]">
                Configure your AI-powered meeting simulation
              </p>
            </div>
          )
        }
        {
          pathname === "/dashboard/myAccount" && (
            <div>
              <h1 className="text-xl font-bold text-primaryBgColor">
                My Accounts
              </h1>
              <p className="sm text-[#636F85]">
                Manage your active accounts and opportunities
              </p>
            </div>
          )
        }
        {
          pathname === "/dashboard/dashboard" && (
            <div>
              <h1 className="text-xl font-bold text-primaryBgColor">
                Analytics Dashboard
              </h1>
              <p className="sm text-[#636F85]">
                Track your performance and insights
              </p>
            </div>
          )
        }
        {
          pathname === "/dashboard/settingPage" && (
            <div>
              <h1 className="text-xl font-bold text-primaryBgColor">
                Settings
              </h1>
              <p className="sm text-[#636F85]">
                Manage your account settings and preferences
              </p>
            </div>
          )
        }
        {
          pathname === "/dashboard/help" && (
            <div>
              <h1 className="text-xl font-bold text-primaryBgColor">
                Help
              </h1>
              <p className="sm text-[#636F85]">
                Manage your help
              </p>
            </div>
          )
        }
        <div className="ml-auto flex items-center gap-2">
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none focus:ring-0">
                {/* Notification icon */}
                <div className="w-10 h-10 bg-[#F3F4F6] rounded-full flex items-center justify-center relative cursor-pointer transition focus:none">
                  <IoNotificationsOutline size={20} className="text-[#2D2D2D]" />
                  {/* Purple dot */}
                  <span className="absolute top-3 right-3 w-2 h-2 bg-[#6E51E0] rounded-full" />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-96 max-h-96 overflow-y-auto border border-gray-50">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 text-gray-400">
                    <Bell className="w-6 h-6 mb-2" />
                    <p className="text-sm">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notification: any) => (
                    <div
                      key={notification.id}
                      className="hover:bg-gray-100 transition-shadow px-4 py-3"
                    >
                      <button
                        type="button"
                        className="w-full text-left flex items-start gap-4"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                            <Bell className="w-5 h-5 text-white" />
                          </div>
                        </div>

                        <div
                          className={`flex-1 min-w-0 text-sm ${notification.isRead
                              ? "text-gray-500"
                              : "text-gray-800 font-medium cursor-pointer"
                            }`}
                          onClick={() => handleNotification(notification?.id)}
                        >
                          <p className="text-sm">{notification.title}</p>
                          <p className="text-xs">{notification.message}</p>
                          <time>
                            {new Date(notification.createdAt).toLocaleString()}
                          </time>
                        </div>
                      </button>
                    </div>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {/* Profile */}
            <div className="flex items-center gap-2 bg-[#F3F4F6] rounded-full px-3 py-1.5">
              <div className="w-7 h-7 rounded-full overflow-hidden bg-[#d2caf0]">
                <Image
                  src={getMe?.data?.profileImage ? getMe?.data?.profileImage : "/dashboardImage/profileImage.svg"}
                  width={28}
                  height={28}
                  alt="User"
                  className="object-cover"
                />
              </div>
              <span className="text-sm font-medium text-[#2D2D2D]">
                {getMe?.data?.firstName || "N/A"} {getMe?.data?.lastName || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}




