

"use client";

import Image from "next/image";
import Container from "@/lib/Container";
import relationship from "@/assets/about_us/relationship.svg";
import idea from "@/assets/about_us/idea.svg";
import vision from "@/assets/about_us/vision.svg";
import { Heart, Users } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="w-full py-10 sm:py-16 xl:py-24 px-3 lg:px-0">
      <Container className="space-y-6 xl:space-y-12">

        {/* ================= WHY WE BUILT ================= */}
        <section className="group flex flex-col md:flex-row items-center gap-10 lg:gap-16 xl:gap-28">
          <div className="w-full md:w-1/2 overflow-hidden rounded-2xl">
            <Image
              src={relationship}
              alt="Why we built DILICO"
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div className="w-full md:w-1/2 text-center md:text-left">
            <h6 className="text-[#6E51E0] font-rubik text-sm sm:text-base font-semibold mb-3">
              Why We Built DILICO
            </h6>

            <h2 className="text-[#2D2D2D] text-[16px] mb-4">
              Most sales tools focus on during or after the call.
              But world-class sellers know:
              <span>the real difference is made before the meeting even begins</span> - when you understand the buyer, the company, the context, the challenges, and the right questions to ask.
            </h2>

            <div className="space-y-3 text-[#2D2D2D] text-sm sm:text-base flex flex-col">
              <p className="text-[16px] font-bold">DILICO was built to solve three major gaps:</p>
              <span className="text-[#2D2D2D] text-[16px]">1. Too much time spent researching accounts manually</span>
              <span className="text-[#2D2D2D] text-[16px]">2. Generic role-plays that don’t reflect real buyer conversations</span>
              <span className="text-[#2D2D2D] text-[16px]">3. Feedback that comes too late to make a difference</span>
            </div>
            <p className="text-[#2D2D2D] text-[16px] mt-3">We built a new category: the <span className="">Pre-Call Intelligence Layer</span> between your CRM and your first discovery call.</p>
          </div>
        </section>

        {/* ================= MISSION ================= */}
        <section className="group flex flex-col md:flex-row-reverse items-center gap-10 lg:gap-16 xl:gap-28">
          <div className="w-full md:w-1/2 overflow-hidden rounded-2xl">
            <Image
              src={idea}
              alt="Our mission"
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div className="w-full md:w-1/2 text-center md:text-left">
            <h6 className="text-[#6E51E0] font-rubik text-sm sm:text-base font-semibold mb-3">
              Our Mission
            </h6>

            <p className="text-[#2D2D2D] text-[16px] mb-4">
              To help every sales professional walk into every meeting <span className="text-[#2D2D2D] text-[16px]">confident, informed, and ready to win</span> -
              by combining AI research, realistic simulations, and instant coaching in one seamless platform.
            </p>

            <p className="text-[#2D2D2D] text-[16px]">
              We exist to make <span className="text-[#2D2D2D] text-[16px]">preparation</span> a competitive advantage, not a burden.
            </p>
          </div>
        </section>

        {/* ================= VISION ================= */}
        <section className="group flex flex-col md:flex-row items-center gap-10 lg:gap-16 xl:gap-28">
          <div className="w-full md:w-1/2 rounded-2xl">
            <Image
              src={vision}
              alt="Our vision"
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div className="w-full md:w-1/2 text-center md:text-left">
            <h6 className="text-[#6E51E0] font-rubik text-sm sm:text-base font-semibold mb-3">
              Our Vision
            </h6>

            <p className="text-[#2D2D2D] text-[16px] mb-4">
              To become the go-to <span className="text-[#2D2D2D] text-[16px]">Sales Copilot</span> that elevates every sales professional to top-performer level - not by replacing the human, but by empowering them with intelligence, clarity, and confidence before every call.

            </p>

            <div className="space-y-3 text-[#2D2D2D] text-[16px] flex flex-col">
              <p className="text-[#2D2D2D] text-[16px] font-bold">We imagine a world where:</p>
              <span>. reps never walk into meetings unprepared</span>
              <span>. every discovery call is structured and high-value</span>
              <span>. companies build consistent, repeatable sales excellence</span>
              <span>. AI helps humans communicate better - not less</span>
            </div>
            <p className="mt-3">DILICO is built to make that vision real.</p>
          </div>
        </section>

        {/* ================= WHAT WE DO ================= */}
        <section className="text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            What We Do
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground mb-12">
            DILICO equips sellers with:
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Instant account & stakeholder research",
              "Realistic AI meeting simulations",
              "Smart question recommendations based on methodology",
              "Real-time qualification (MEDDIC, BANT, SPIN, etc.)",
              "Actionable coaching & CRM-ready summaries",
              "Centralized account + opportunity intelligence",
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-xl border bg-card p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <p className="font-medium">{item}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[16px] text-[#636F85]">Our platform is used by B2B teams who want to shorten ramp time, increase qualification accuracy, and standardize elite sales practices at scale.</p>
        </section>

        {/* ================= WHO WE SERVE ================= */}
        <section className="rounded-2xl p-8 lg:p-6 text-center">
          <Users className="mx-auto mb-4 h-8 w-8 text-[#6E51E0]" />
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Who We Serve
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground mb-12">
            We help:
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {[
              "Account Executives",
              "SDR / BDR Teams",
              "Sales leaders & enablement teams",
              "Revenue operations",
              "Founders leading sales cycles",
            ].map((role, i) => (
              <div
                key={i}
                className="rounded-xl border bg-card py-4 font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {role}
              </div>
            ))}
          </div>

          <p className="mt-6 text-[16px] text-[#636F85]">
            Our customers operate in SaaS, tech, professional services, cybersecurity, marketing, AI, and many more industries.
          </p>
          <p className="mt-3 text-[16px] text-[#636F85]">
            DILICO currently supports <span className="font-bold text-[#2D2D2D]">English, French, Spanish, and Italian,</span> with more languages coming soon.
          </p>
        </section>

        {/* ================= WHY IT MATTERS ================= */}
        <section className="text-center max-w-3xl mx-auto">
          <Heart className="mx-auto mb-6 h-10 w-10 text-[#6E51E0]" />
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Why It Matters
          </h2>

          <p className="text-[16px] text-[#636F85] mb-6">
            Because great conversations build trust.
            Great preparation builds confidence.
            And great salespeople are made - not born.
          </p>

          <p className="text-[#2D2D2D] text-lg font-bold">
            We’re here to support them every step of the way.
          </p>
        </section>

      </Container>
    </section>
  );
}




