import Container from "@/lib/Container";
import ralationship from "@/assets/about_us/relationship.png";
import idea from "@/assets/about_us/idea.png";
import React from "react";
import AboutSection from "@/components/about-us/AboutSection";
import HeaderBanner from "@/components/ui/banner/HeaderBanner";
import { IoMdTime } from "react-icons/io";
import StatsSection from "@/components/about-us/StatsSection";

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
        />
        <AboutSection
          title="Mission and Vision"
          subtitle="Our Company"
          description="It is popularised in the 1960s with the release of Letraset
            sheets containing Lorem Ipsum passages, and more recently
            with desktop publishing software like"
          image={idea}
          reverse={true}
        />
        <StatsSection />
      </section>
    </div>
  );
}

export default About;
