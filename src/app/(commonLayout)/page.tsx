import DashboardSection from "@/components/landingPage/dashboardSection";
import InfoCounter from "@/components/landingPage/InfoCounter";
import MarqueeSection from "@/components/landingPage/marqueeSection";

const page = () => {
  return (
    <div>
      <InfoCounter />
      <DashboardSection/>
      <MarqueeSection/>
    </div>
  );
};

export default page;