import DashboardSection from "@/components/landingPage/dashboardSection";
import InfoCounter from "@/components/landingPage/InfoCounter";

const page = () => {
  return (
    <div className="max-w-[1440px] mx-auto">
      <InfoCounter />
      <DashboardSection/>
    </div>
  );
};

export default page;