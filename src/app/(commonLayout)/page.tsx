import BussinessSection from "@/components/landingPage/bussinessSection";
import DashboardSection from "@/components/landingPage/dashboardSection";
import FeatureSection from "@/components/landingPage/FeatureSection";
import InfoCounter from "@/components/landingPage/InfoCounter";
import MarqueeSection from "@/components/landingPage/marqueeSection";
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
    </div>
  );
};

export default page;