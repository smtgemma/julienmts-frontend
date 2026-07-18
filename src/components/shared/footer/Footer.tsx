
"use client";

import Container from "@/lib/Container";
import { usePostNewsletterSubscribeMutation } from "@/redux/api/landingPageApi/LandingPageApi";
import Link from "next/link";
import { useState } from "react";
import { FaFacebookF, FaInstagram, FaSpinner, FaTwitter } from "react-icons/fa6";
import { toast } from "sonner";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const [postNewsletterSubscribe, { isLoading }] =
    usePostNewsletterSubscribeMutation();

  // simple email validation
  const isValidEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubscribe = async () => {
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      const res = await postNewsletterSubscribe({ email }).unwrap();

      toast.success(res?.message || "Subscribed successfully");
      setEmail("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Subscription failed");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubscribe();
    }
  };

  return (
    <footer className="py-16 px-6">
      <Container className="max-w-7xl mx-auto">

        {/* Logo */}
        <div className="flex justify-between items-center mb-10">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/navbar/logo.png"
              alt="logo"
              className="w-8 md:w-12 h-8 md:h-12"
            />
            <h3 className="text-2xl text-primaryBgColor font-semibold">
              Dilico
            </h3>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">

          {/* About */}
          <div>
            <p className="text-[#2D2D2D] text-[16px] font-medium">
              Every Emirate. Every Plate. Always Premium.
            </p>

            <div className="flex items-center gap-4 py-6">
              <a href="#" className="p-2 border rounded-full">
                <FaTwitter />
              </a>
              <a href="#" className="p-2 border rounded-full">
                <FaFacebookF />
              </a>
              <a href="#" className="p-2 border rounded-full">
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-primaryBgColor font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-[#636F85]">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/benefits">Benefits</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
              {/* <li><Link href="/faq">FAQ</Link></li> */}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-primaryBgColor font-semibold mb-4">
              Contact us
            </h3>
            <ul className="space-y-2 text-[#636F85]">
              <li>+971123 456 789</li>
              <li>contact@dilico.ai</li>
            </ul>
          </div>

          {/* Newsletter */}
          {/* <div>
            <h3 className="text-primaryBgColor font-semibold mb-4">
              Stay Updated
            </h3>

            <p className="text-[#636F85] text-[14px] mb-4">
              Subscribe to our newsletter for the latest offer.
            </p>

            <div className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(""); 
                }}
                onKeyDown={handleKeyDown}
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 border border-[#D1D6DB] rounded-l outline-none"
              />

              <button
                onClick={handleSubscribe}
                disabled={isLoading}
                className="bg-primaryBgColor text-white px-4 py-2 rounded-r hover:bg-[#6E51E0] flex items-center justify-center min-w-[110px]"
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  "Subscribe"
                )}
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div> */}
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-[#D1D6DB] pt-6 text-center">
          <p className="text-[#9BA4B0] text-[16px]">
            © 2026 DILICO.AI. All rights reserved.
          </p>
        </div>

      </Container>
    </footer>
  );
}