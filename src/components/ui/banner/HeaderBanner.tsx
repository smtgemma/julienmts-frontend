"use client";

import Container from "@/lib/Container";
import React from "react";

interface HeaderBannerProps {
  title?: string;
  breadcrumb?: string;
}

const HeaderBanner: React.FC<HeaderBannerProps> = ({
  title = "About Us",
  breadcrumb = "Home / About Us",
}) => {
  return (
    <div className="bg-[rgba(255,255,255,0.6)] w-full md:mt-10  mt-4 z-10">
      <Container className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-8  py-10 sm:py-12">
        <h2 className="text-[var(--Font-Colors-Tittle,#2D2D2D)] font-rubik text-3xl sm:text-4xl md:text-5xl font-medium text-center sm:text-left leading-normal">
          {title}
        </h2>

        <p className="bg-gradient-to-b from-[#6E51E0] to-black bg-clip-text text-transparent font-rubik text-base sm:text-lg md:text-xl font-normal text-center sm:text-right leading-normal">
          {breadcrumb}
        </p>
      </Container>
    </div>
  );
};

export default HeaderBanner;
