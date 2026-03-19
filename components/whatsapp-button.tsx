 "use client";

import { usePathname } from "next/navigation";

export function WhatsAppButton() {
  const pathname = usePathname();
  const href =
    "https://wa.me/2347033947449?text=Hello%2C%20I%E2%80%99d%20like%20to%20make%20an%20inquiry%20about%20a%20Dion%20Baci%20piece.";

  const hideOnSmallScreen = pathname === "/shop" || pathname.startsWith("/shop/");

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className={`fixed bottom-5 right-5 z-40 h-14 w-14 translate-y-0 items-center justify-center rounded-full bg-ink text-paper shadow-card transition-all duration-500 hover:-translate-y-1 hover:opacity-90 sm:bottom-8 sm:right-8 ${
        hideOnSmallScreen ? "hidden sm:flex" : "flex"
      }`}
    >
      <span className="text-xs uppercase tracking-[0.16em]">WA</span>
    </a>
  );
}
