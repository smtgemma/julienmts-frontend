// "use client"
// import { SidebarTrigger } from "@/components/ui/sidebar"
// import { BellIcon } from "lucide-react";
// import { useState } from "react";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import Image from "next/image"

// export function SiteHeader() {
//   const initialNotifications = [
//     {
//       action: "requested review on",
//       id: 1,
//       image: "/dashboardImage/profileImage.svg",
//       target: "PR #42: Feature implementation",
//       timestamp: "15 minutes ago",
//       unread: true,
//       user: "Chris Tompson",
//     },
//     {
//       action: "shared",
//       id: 2,
//       image: "/dashboardImage/profileImage.svg",
//       target: "New component library",
//       timestamp: "45 minutes ago",
//       unread: true,
//       user: "Emma Davis",
//     },
//     {
//       action: "assigned you to",
//       id: 3,
//       image: "/dashboardImage/profileImage.svg",
//       target: "API integration task",
//       timestamp: "4 hours ago",
//       unread: true,
//       user: "James Wilson",
//     },
//     {
//       action: "replied to your comment in",
//       id: 4,
//       image: "/dashboardImage/profileImage.svg",
//       target: "Authentication flow",
//       timestamp: "12 hours ago",
//       unread: true,
//       user: "Alex Morgan",
//     },
//     {
//       action: "commented on",
//       id: 5,
//       image: "/dashboardImage/profileImage.svg",
//       target: "Dashboard redesign",
//       timestamp: "2 days ago",
//       unread: true,
//       user: "Sarah Chen",
//     },
//     {
//       action: "mentioned you in",
//       id: 6,
//       image: "/dashboardImage/profileImage.svg",
//       target: "coss.com open graph image",
//       timestamp: "2 weeks ago",
//       unread: true,
//       user: "Miky Derya",
//     },
//   ];

//   function Dot({ className }: { className?: string }) {
//     return (
//       <svg
//         aria-hidden="true"
//         className={className}
//         fill="currentColor"
//         height="6"
//         viewBox="0 0 6 6"
//         width="6"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <circle cx="3" cy="3" r="3" />
//       </svg>
//     );
//   }
//   const [notifications, setNotifications] = useState(initialNotifications);
//   const unreadCount = notifications.filter((n) => n.unread).length;
//   const handleMarkAllAsRead = () => {
//     setNotifications(
//       notifications.map((notification) => ({
//         ...notification,
//         unread: false,
//       })),
//     );
//   };

//   const handleNotificationClick = (id: number) => {
//     setNotifications(
//       notifications.map((notification) =>
//         notification.id === id
//           ? { ...notification, unread: false }
//           : notification,
//       ),
//     );
//   };

//   return (
//     <header className="py-10 flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
//       <div className="flex w-full items-center gap-1 px-6 py-6 lg:gap-2 lg:px-6">
//         <SidebarTrigger className="-ml-1" />
//         <div>
//           <h1 className="text-xl font-bold text-primaryBgColor">Welcome back, Md Shakil</h1>
//           <p className="sm text-[#636F85]">Here's your meeting activity and insights for today.</p>
//         </div>
//         <div className="ml-auto flex items-center gap-2">
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button
//                 aria-label="Open notifications"
//                 className="relative"
//                 size="icon"
//                 variant="outline"
//               >
//                 <BellIcon aria-hidden="true" size={16} />
//                 {unreadCount > 0 && (
//                   <Badge className="-top-2 -translate-x-1/2 absolute left-full min-w-5 px-1">
//                     {unreadCount > 99 ? "99+" : unreadCount}
//                   </Badge>
//                 )}
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-80 p-1">
//               <div className="flex items-baseline justify-between gap-4 px-3 py-2">
//                 <div className="font-semibold text-sm">Notifications</div>
//                 {unreadCount > 0 && (
//                   <button
//                     className="font-medium text-xs hover:underline"
//                     onClick={handleMarkAllAsRead}
//                     type="button"
//                   >
//                     Mark all as read
//                   </button>
//                 )}
//               </div>
//               <div
//                 aria-orientation="horizontal"
//                 className="-mx-1 my-1 h-px bg-border"
//                 role="separator"
//                 tabIndex={-1}
//               />
//               {notifications.map((notification) => (
//                 <div
//                   className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
//                   key={notification.id}
//                 >
//                   <div className="relative flex items-start gap-3 pe-3">
//                     <img
//                       alt={notification.user}
//                       className="size-9 rounded-full"
//                       height={32}
//                       src={notification.image}
//                       width={32}
//                     />
//                     <div className="flex-1 space-y-1">
//                       <button
//                         className="text-left text-foreground/80 after:absolute after:inset-0"
//                         onClick={() => handleNotificationClick(notification.id)}
//                         type="button"
//                       >
//                         <span className="font-medium text-foreground hover:underline">
//                           {notification.user}
//                         </span>{" "}
//                         {notification.action}{" "}
//                         <span className="font-medium text-foreground hover:underline">
//                           {notification.target}
//                         </span>
//                         .
//                       </button>
//                       <div className="text-muted-foreground text-xs">
//                         {notification.timestamp}
//                       </div>
//                     </div>
//                     {notification.unread && (
//                       <div className="absolute end-0 self-center">
//                         <Dot />
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </PopoverContent>
//           </Popover>

//           {/* Profile */}
//           <div className="flex items-center gap-2 bg-[#F3F4F6] rounded-full px-3 py-1.5">
//             <div className="w-7 h-7 rounded-full overflow-hidden bg-[#d2caf0]">
//               <Image
//                 src="/dashboardImage/profileImage.svg"
//                 width={28}
//                 height={28}
//                 alt="User"
//                 className="object-cover"
//               />
//             </div>
//             <span className="text-sm font-medium text-[#2D2D2D]">
//               Md Shakil
//             </span>
//           </div>
//         </div>
//       </div>
//     </header>
//   )
// }





import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import Image from "next/image"
import { IoNotificationsOutline } from "react-icons/io5"

export function SiteHeader() {
  const notifications = [
    {
      id: 1,
      title: 'New message received',
      description: 'John sent you a message',
      time: '5 min ago',
      read: false,
    },
    {
      id: 2,
      title: 'Project update',
      description: 'Your project has been approved',
      time: '1 hour ago',
      read: false,
    },
    {
      id: 3,
      title: 'Meeting reminder',
      description: 'Team meeting starts in 30 minutes',
      time: '2 hours ago',
      read: true,
    },
    {
      id: 4,
      title: 'Task completed',
      description: 'Design review task marked as done',
      time: '1 day ago',
      read: true,
    },
  ];

  return (
    <header className="py-10 flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-6 py-6 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <div>
          <h1 className="text-xl font-bold text-primaryBgColor">Welcome back, Md Shakil</h1>
          <p className="sm text-[#636F85]">Here's your meeting activity and insights for today.</p>
        </div>
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

              <DropdownMenuContent className="w-96 border border-gray-50 p-5">
                {notifications?.map((notification) => (
                  <div
                    className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
                    key={notification.id}
                  >
                    <div className="relative flex items-start gap-3 pe-3">
                      <div className="flex-1 space-y-1">
                        <button
                          className="text-left text-foreground/80 after:absolute after:inset-0"
                          type="button"
                        >
                          <span className="font-medium text-foreground hover:underline">
                            {notification.title}
                          </span>{" "}
                          {notification.description}{" "}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Profile */}
          <div className="flex items-center gap-2 bg-[#F3F4F6] rounded-full px-3 py-1.5">
            <div className="w-7 h-7 rounded-full overflow-hidden bg-[#d2caf0]">
              <Image
                src="/dashboardImage/profileImage.svg"
                width={28}
                height={28}
                alt="User"
                className="object-cover"
              />
            </div>
            <span className="text-sm font-medium text-[#2D2D2D]">
              Md Shakil
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}



