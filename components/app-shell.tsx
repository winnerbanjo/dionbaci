"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { NewsletterSection } from "@/components/newsletter-section";
import { Footer } from "@/components/ui/Footer";
import { Navbar } from "@/components/ui/Navbar";
import { WhatsAppButton } from "@/components/whatsapp-button";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <main>{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <NewsletterSection />
      <Footer />
      <WhatsAppButton />
    </>
  );
}
