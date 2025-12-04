
import { SectionCards } from "@/components/section-cards"
import RecentMeetings from "@/components/recent-mettings"

export default function Page() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards />
      <RecentMeetings />
    </div>
  )
}
