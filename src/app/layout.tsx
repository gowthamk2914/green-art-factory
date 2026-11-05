import "./globals.css";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import GoogleTranslate from "../components/common/GoogleTranslate";
import ContentProtection from "../components/common/ContentProtection";
import { ReactNode } from "react";
import type { Metadata } from "next";
import favicon from "@/public/images/gaf_favicon.png";
import Providers from "./providers";

import { Poppins } from "next/font/google";

export const metadata: Metadata = {
  title: "Green Art Factory",
  description: "Green Art Factory",
  icons: {
    icon: favicon.src,
    shortcut: favicon.src,
    apple: favicon.src,
  },
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    // suppressHydrationWarning: browser extensions and Google Translate add
    // attributes to <html>/<body> before React loads. This ignores only those
    // two tags' attributes (not their children), so real mismatches elsewhere
    // are still reported.
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className} suppressHydrationWarning>
        <ContentProtection />
        <GoogleTranslate />
        <Navbar />
        <Providers>{children}</Providers>
        <Footer />
      </body>
    </html>
  );
}