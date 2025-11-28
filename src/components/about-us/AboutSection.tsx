"use client";

import Image, { StaticImageData } from "next/image";
import React from "react";
import GradientButton from "@/components/ui/GradientButton";
import Container from "@/lib/Container";

interface AboutSectionProps {
  title: string;
  subtitle: string;
  description: string;
  image: StaticImageData;
  buttonText?: string;
  reverse?: boolean;
}

const AboutSection: React.FC<AboutSectionProps> = ({
  title,
  subtitle,
  description,
  image,
  buttonText = "GET STARTED",
  reverse = false,
}) => {
  return (
    <div className=" w-full py-4 md:py-8 xl:py-12 z-10">
      <Container
        className={`flex flex-col ${
          reverse ? "md:flex-row-reverse" : "md:flex-row"
        } items-center gap-8 xl:gap-32`}
      >
        <div className="w-full md:w-1/2">
          <Image
            src={image}
            alt={title}
            width={600}
            height={400}
            className="w-full h-auto object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 text-center xl:text-left">
          <h6 className="text-[var(--Brand-Color-Primary,#6E51E0)] font-rubik text-sm sm:text-[16px] font-semibold leading-normal md:text-left text-center mb-2 sm:mb-3">
            {subtitle}
          </h6>
          <h5 className="text-[var(--Font-Colors-Tittle,#2D2D2D)] font-rubik text-2xl sm:text-[40px] font-medium leading-snug md:text-left text-center sm:leading-normal mb-2">
            {title}
          </h5>
          <p className="text-[var(--Font-Colors-Body,#636F85)] font-rubik text-sm sm:text-[16px] font-normal leading-6 md:text-left text-center sm:leading-[30px] mb-6">
            {description}
          </p>
          <GradientButton className="mx-auto xl:mx-0">
            {buttonText}
          </GradientButton>
        </div>
      </Container>
    </div>
  );
};

export default AboutSection;
