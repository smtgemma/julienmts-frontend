
import ralationship from "@/assets/about_us/relationship.png";
import idea from "@/assets/about_us/idea.png";
import React from "react";
import AboutSection from "@/components/about-us/AboutSection";
import HeaderBanner from "@/components/ui/banner/HeaderBanner";
import StatsSection from "@/components/about-us/StatsSection";
import TestimonialSection from "@/components/landingPage/TestimonialSection";
import NextMeeting from "@/components/landingPage/nextMeeting";
import MarqueeSection from "@/components/landingPage/marqueeSection";

function About() {
  return (
    <div className="relative">
      <section>
        <HeaderBanner title="About Our Company" breadcrumb="Home / About Us" />
        <AboutSection
          title="Management"
          subtitle="About"
          description="Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web."
          image={ralationship}
          showButton={true}
        />
        <AboutSection
          title="Mission and Vision"
          subtitle="Our Company"
          description="It is popularised in the 1960s with the release of Letraset
            sheets containing Lorem Ipsum passages, and more recently
            with desktop publishing software like"
          image={idea}
          reverse={true}
          showButton={false}
        />
        <StatsSection />
        <TestimonialSection/>
        <NextMeeting/>
        <div className="py-20">
          <MarqueeSection/>
        </div>
      </section>
    </div>
  );
}

export default About;