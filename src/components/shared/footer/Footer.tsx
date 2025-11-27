import Container from "@/lib/Container";
import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-16 px-6">
      <Container className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo and Tagline */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Link href="/" className="text-xl">
                <img src="/navbar/logo.png" alt="dsfdsfd" />
              </Link>
            </div>
            <p className="text-[#9BA4B0] text-[16px] font-medium">
              Every Emirate. Every Plate. Always Premium.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#6E51E0] font-semibold text-[16px] mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-[#9BA4B0] hover:text-white transition-colors text-[16px] front-semibold"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#9BA4B0] hover:text-white transition-colors text-[16px] front-semibold"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#9BA4B0] hover:text-white transition-colors text-[16px] front-semibold"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#9BA4B0] hover:text-white transition-colors text-[16px] front-semibold"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-[#6E51E0] font-semibold text-[16px] mb-4">
              Contact us
            </h3>
            <ul className="space-y-2">
              <li className="text-[#9BA4B0] text-[16px]">+971123 456 789</li>
              <li className="text-[#9BA4B0] text-[16px]">support@p181ux.com</li>
            </ul>
          </div>

          {/* Stay Updated */}
          <div>
            <h3 className="text-[#6E51E0] font-semibold text-[16px] mb-4">
              Stay Updated
            </h3>
            <p className="text-[#9BA4B0] text-[16px] mb-4">
              Subscribe to our newsletter for the latest offer.
            </p>
            <div className="flex flex-col">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-white text-[#2D2D2D] rounded-l text-sm focus:outline-none"
              />
              <button className="bg-[#6E51E0] hover:bg-[#6E51E0] px-4 py-3 rounded-r text-sm font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#1E293B] pt-6 text-center">
          <p className="text-[#FFFFFF] text-[16px]">
            © 2025 SalesMind.com. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
