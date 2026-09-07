"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiSearch, FiX } from "react-icons/fi";
import { FaInstagram, FaWhatsapp, FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoChevronDownOutline } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import FilterPanel from "./FilterPanel";
import { switchToLanguage, getCurrentLanguage } from "./GoogleTranslate";

// Single source of truth for the nav links — used by both the desktop
// row and the mobile slide-in menu, so adding a link only means editing
// this array once.
const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/products-list", label: "Products" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blogs", label: "Blogs" },
  { href: "/services", label: "Services" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact us" },
];

const Navbar = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLang, setActiveLang] = useState("en");

  // Read the cookie after mount (avoids server/client mismatch, since
  // document.cookie isn't available during server rendering).
  useEffect(() => {
    setActiveLang(getCurrentLanguage());
  }, []);

  // Lock background scroll while the mobile menu is open, and let
  // Escape close it — standard behavior for a full-screen overlay menu.
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("mobileMenuLockScroll");
    } else {
      document.body.classList.remove("mobileMenuLockScroll");
    }

    function handleKeyDown(e) {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("mobileMenuLockScroll");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="header-wrapper sticky top-0 z-[999] shadow-md transition-all duration-300">
        <div className="container flex items-center justify-between">
          {/* Logo */}

          <Link href="/" className="shrink-0">
            <Image
              src="/images/logo.png"
              alt="Green Art Factory"
              width={110}
              height={80}
              priority
              className="h-auto w-[90px] xl:w-[110px]"
            />
          </Link>

          {/* Phone */}

          {/* <div className="hidden items-center gap-1 lg:flex">
            <span className="text-[18px] font-medium text-[#1A1A1A]">
              +91 1234567890
            </span>

            <IoChevronDownOutline size={14} className="mt-[2px] text-[#7A8C2F]" />
          </div> */}

          {/* Menu — desktop only, hidden below lg */}

          <nav className="hidden items-center gap-10 lg:flex">

            {/* <Link
              href="/"
              className="text-[16px] font-medium text-[#111] transition-all hover:text-[#0AA15B]"
            >
              Home
            </Link> */}

            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[16px] font-medium text-[#111] transition-all hover:text-[#0AA15B]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="navbar-icon-wrapper flex items-center gap-4">
            {/* <button className="hidden text-black transition-all hover:text-[#0AA15B] lg:block">
              <FiSearch size={24} />
            </button> */}

            {/* <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              aria-label="Open filters"
              className="hidden text-black transition-all hover:text-[#0AA15B] lg:block"
            >
              <RxHamburgerMenu size={24} />
            </button> */}

            {/* Language switcher — drives the Google Translate widget.
                "notranslate" keeps Google from translating EN/عربي themselves. */}
            <div className="notranslate flex items-center gap-1 rounded-full border border-[#7A8C2F]/30 p-1 text-[13px] font-medium">
              <button
                type="button"
                onClick={() => switchToLanguage("en")}
                disabled={activeLang === "en"}
                className={`rounded-full px-2.5 py-1 transition-all ${
                  activeLang === "en"
                    ? "bg-[#5E671F] text-white"
                    : "text-[#111] hover:text-[#0AA15B]"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => switchToLanguage("ar")}
                disabled={activeLang === "ar"}
                className={`rounded-full px-2.5 py-1 transition-all ${
                  activeLang === "ar"
                    ? "bg-[#5E671F] text-white"
                    : "text-[#111] hover:text-[#0AA15B]"
                }`}
              >
                عربي
              </button>
            </div>

            {/* Hamburger — mobile/tablet only, mirrors the desktop nav's
                `lg:flex` breakpoint with `lg:hidden` here */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
              className={`mobileMenuTrigger lg:hidden ${isMobileMenuOpen ? "mobileMenuTriggerOpen" : ""}`}
            >
              <span className="mobileMenuTriggerBar" />
              <span className="mobileMenuTriggerBar" />
              <span className="mobileMenuTriggerBar" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-in menu */}

      <div
        className={`mobileMenuBackdrop ${isMobileMenuOpen ? "mobileMenuBackdropOpen" : ""}`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden={!isMobileMenuOpen}
      />

      <div
        className={`mobileMenuPanel ${isMobileMenuOpen ? "mobileMenuPanelOpen" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
      >
        <div className="mobileMenuHeader">
          <Image
            src="/images/logo.png"
            alt="Green Art Factory"
            width={90}
            height={64}
            className="h-auto w-[80px]"
          />

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
            className="mobileMenuClose"
          >
            <FiX size={26} />
          </button>
        </div>

        <nav className="mobileMenuLinks">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="mobileMenuLink"
              style={{ transitionDelay: isMobileMenuOpen ? `${i * 40}ms` : "0ms" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mobileMenuFooter">
          <div className="notranslate mobileMenuLangSwitch">
            <button
              type="button"
              onClick={() => switchToLanguage("en")}
              disabled={activeLang === "en"}
              className={`mobileMenuLangBtn ${activeLang === "en" ? "mobileMenuLangBtnActive" : ""}`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => switchToLanguage("ar")}
              disabled={activeLang === "ar"}
              className={`mobileMenuLangBtn ${activeLang === "ar" ? "mobileMenuLangBtnActive" : ""}`}
            >
              عربي
            </button>
          </div>

          <div className="mobileMenuSocials">
            <a href="#" aria-label="Instagram" className="mobileMenuSocialIcon" style={{ background: "#E1306C" }}>
              <FaInstagram size={16} />
            </a>
            <a href="#" aria-label="WhatsApp" className="mobileMenuSocialIcon" style={{ background: "#25D366" }}>
              <FaWhatsapp size={16} />
            </a>
            <a href="#" aria-label="Facebook" className="mobileMenuSocialIcon" style={{ background: "#1877F2" }}>
              <FaFacebookF size={16} />
            </a>
            <a href="#" aria-label="X (Twitter)" className="mobileMenuSocialIcon" style={{ background: "#2A2A2A" }}>
              <FaXTwitter size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Portfolio filters overlay, toggled by the hamburger button above */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={(filters) => {
          // Wire this up to your portfolio query / router push / API call
          console.log("Applied filters:", filters);
        }}
      />

      {/* Floating Social Sidebar */}

      <div className="fixed right-0 top-[140px] z-50 overflow-hidden rounded-l-[35px] bg-[#5E671F] py-4">
        <div className="flex flex-col items-center gap-3 px-3 floating-social-bar-wrapper">
          <a
            href="#"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E1306C] text-white"
          >
            <FaInstagram size={18} />
          </a>

          <a
            href="#"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white"
          >
            <FaWhatsapp size={18} />
          </a>

          <a
            href="#"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2] text-white"
          >
            <FaFacebookF size={18} />
          </a>

          <a
            href="#"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2A2A2A] text-white"
          >
            <FaXTwitter size={16} />
          </a>
        </div>
      </div>
    </>
  );
};

export default Navbar;