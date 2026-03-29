

"use client";
import { useEffect, useState, useRef } from "react";
import { PiGlobeLight } from "react-icons/pi";

export function LanguageSwitcher() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setMounted(true);

    // localStorage থেকে সংরক্ষিত ভাষা পড়ুন
    const storedLang = localStorage.getItem("selectedLanguage") || "en";
    setSelectedLanguage(storedLang);

    // Google Translate এর জন্য cookie সেট করুন
    document.cookie = `googtrans=/en/${storedLang}; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/`;
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (newLang: string) => {
    if (!newLang || newLang === selectedLanguage) return;

    // নতুন ভাষা সংরক্ষণ করুন
    localStorage.setItem("selectedLanguage", newLang);
    setSelectedLanguage(newLang);

    // পুরানো Google Translate cookie মুছে ফেলুন
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;

    // নতুন cookie সেট করুন
    document.cookie = `googtrans=/en/${newLang}; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/`;

    // Page reload করুন - এটিই একমাত্র উপায় Google Translate এর জন্য
    window.location.reload();
  };

  const languageNames: Record<string, string> = {
    en: "English",
    es: "Español",
    fr: "Français",
    de: "Deutsch",
    ar: "العربية",
    pt: "Português",
    hi: "हिन्दी",
    bn: "বাংলা",
    iu: "ᐃᓄᒃᑦ",
  };

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-2 relative">
      <button
        ref={buttonRef}
        className="w-auto h-6 md:h-auto px-2 py-1 notranslate rounded-full border-none font-bold text-black/70 bg-white/30 hover:bg-white/50 flex items-center justify-between cursor-pointer transition-all duration-200 hover:shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <PiGlobeLight size={20} className="text-[#6B7280] mr-1" />
        {languageNames[selectedLanguage] || "Select a language"}
        <svg
          className={`ml-2 w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
            }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-10 right-0 mt-1 w-full min-w-[180px] bg-white rounded-md shadow-lg z-50 border border-gray-200 notranslate overflow-hidden"
        >
          <ul className="py-1 max-h-64 overflow-y-auto">
            {Object.entries(languageNames).map(([code, name]) => (
              <li key={code}>
                <button
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100
                      cursor-pointer notranslate transition-colors duration-150 ${selectedLanguage === code
                      ? "font-bold bg-gray-50 text-blue-600"
                      : "text-gray-700"
                    }`}
                  onClick={() => handleChange(code)}
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}