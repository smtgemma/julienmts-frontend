

import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
    {
      id: 4,
      title: 'Task completed',
      description: 'Design review task marked as done',
      time: '1 day ago',
      read: true,
    },
    {
      id: 4,
      title: 'Task completed',
      description: 'Design review task marked as done',
      time: '1 day ago',
      read: true,
    },
    {
      id: 4,
      title: 'Task completed',
      description: 'Design review task marked as done',
      time: '1 day ago',
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



