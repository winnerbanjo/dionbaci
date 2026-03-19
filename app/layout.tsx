import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

import { NewsletterSection } from "@/components/newsletter-section";
import { Footer } from "@/components/ui/Footer";
import { Navbar } from "@/components/ui/Navbar";
import { WhatsAppButton } from "@/components/whatsapp-button";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Dion Baci",
  description: "Luxury fashion, bridal, beauty, home, and consultations by Dion Baci.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-white font-[var(--font-inter)] text-black antialiased">
        <Navbar />
        <main>{children}</main>
        <NewsletterSection />
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
