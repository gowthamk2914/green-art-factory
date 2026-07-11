"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import { FaInstagram, FaWhatsapp, FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoChevronDownOutline } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import FilterPanel from "./FilterPanel";

const Navbar = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

          <div className="hidden items-center gap-1 lg:flex">
            <span className="text-[18px] font-medium text-[#1A1A1A]">
              +91 1234567890
            </span>

            <IoChevronDownOutline size={14} className="mt-[2px] text-[#7A8C2F]" />
          </div>

          {/* Menu */}

          <nav className="hidden items-center gap-10 lg:flex">
            <Link
              href="/about"
              className="text-[16px] font-medium text-[#111] transition-all hover:text-[#0AA15B]"
            >
              About
            </Link>

            <Link
              href="/careers"
              className="text-[16px] font-medium text-[#111] transition-all hover:text-[#0AA15B]"
            >
              Careers
            </Link>

            <Link
              href="/categories"
              className="text-[16px] font-medium text-[#111] transition-all hover:text-[#0AA15B]"
            >
              Categories
            </Link>

            <Link
              href="/services"
              className="text-[16px] font-medium text-[#111] transition-all hover:text-[#0AA15B]"
            >
              Services
            </Link>

            <Link
              href="/contact"
              className="text-[16px] font-medium text-[#111] transition-all hover:text-[#0AA15B]"
            >
              Contact us
            </Link>
          </nav>

          <div className="navbar-icon-wrapper">
            <button className="hidden text-black transition-all hover:text-[#0AA15B] lg:block">
              <FiSearch size={24} />
            </button>

            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              aria-label="Open filters"
              className="hidden text-black transition-all hover:text-[#0AA15B] lg:block"
            >
              <RxHamburgerMenu size={24} />
            </button>
          </div>
        </div>
      </header>

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