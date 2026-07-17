import "./globals.css";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
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
    <html lang="en">
      <body className={poppins.className}>
        <Navbar />
        <Providers>
          {children}
        </Providers>
        <Footer />
      </body>
    </html>
  );
}