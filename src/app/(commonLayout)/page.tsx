
import DashboardSection from "@/components/landingPage/BashboardSection";
import BussinessSection from "@/components/landingPage/BussinessSection";
import Faq from "@/components/landingPage/Faq";
import FeatureSection from "@/components/landingPage/FeatureSection";
import InfoCounter from "@/components/landingPage/InfoCounter";
import MarqueeSection from "@/components/landingPage/marqueeSection";
import TestimonialSection from "@/components/landingPage/TestimonialSection";
import ThreeStep from "@/components/landingPage/threeStep";

const page = () => {
  return (
    <div>
      <InfoCounter />
      <DashboardSection />
      <MarqueeSection />
      <ThreeStep />
      <FeatureSection />
      <BussinessSection />
      <TestimonialSection />
      <Faq/>
    </div>
  );
};

export default page;