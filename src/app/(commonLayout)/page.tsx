
import DashboardSection from "@/components/landingPage/BashboardSection";
import BussinessSection from "@/components/landingPage/bussinessSection";
import Faq from "@/components/landingPage/Faq";
import FeatureSection from "@/components/landingPage/FeatureSection";
import HerroSection from "@/components/landingPage/HerroSection";
import InfoCounter from "@/components/landingPage/InfoCounter";
import MarqueeSection from "@/components/landingPage/marqueeSection";
import MeetingSuccess from "@/components/landingPage/meetingSuccess.tsx/page";
import NextMeeting from "@/components/landingPage/nextMeeting";
import TestimonialSection from "@/components/landingPage/TestimonialSection";

const page = () => {
  return (
    <div>
      <HerroSection/>
      <InfoCounter />
      <DashboardSection />
      <MarqueeSection />
      <MeetingSuccess/>
      <FeatureSection />
      <BussinessSection />
      <TestimonialSection />
      <Faq/>
      <NextMeeting/>
    </div>
  );
};

export default page;