"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { BrandLogo } from "@/components/brand-logo";

const mainNav = [
  { label: "Home", href: "/" },
  { label: "Bridal", href: "/bridal" },
  { label: "Collections", href: "/collections" },
  { label: "Shop", href: "/shop" },
  { label: "Atelier", href: "/atelier" },
  { label: "Book Consultation", href: "/book-consultation" },
];

const secondaryNav = [
  { label: "Accessories", href: "/accessories" },
  { label: "Baci", href: "/baci" },
  { label: "Beauty", href: "/beauty" },
  { label: "Home Goods (Coming Soon)", href: "/dion-baci-home" },
  { label: "Size Chart", href: "/size-chart" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur">
      <div className="page-shell flex h-20 items-center justify-between gap-6">
        <BrandLogo width={180} imageClassName="max-h-8 w-auto" priority />

        <nav className="hidden items-center gap-8 lg:flex">
          {mainNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[11px] uppercase tracking-[0.24em] ${
                  item.href === "/book-consultation"
                    ? "luxury-button px-5 py-3 text-paper"
                    : active
                      ? "text-ink"
                      : "text-mist hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <div
            className="relative"
            onMouseEnter={() => setMoreOpen(true)}
            onMouseLeave={() => setMoreOpen(false)}
          >
            <button
              type="button"
              className="text-[11px] uppercase tracking-[0.24em] text-mist hover:text-ink"
              onClick={() => setMoreOpen((value) => !value)}
            >
              More
            </button>
            {moreOpen ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="absolute right-0 top-full mt-4 w-64 border border-line bg-paper p-4 shadow-card"
              >
                <div className="flex flex-col gap-2">
                  {secondaryNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="px-3 py-3 text-xs uppercase tracking-[0.22em] text-mist hover:bg-[#fafafa] hover:text-ink"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </motion.div>
            ) : null}
          </div>
        </nav>

        <button
          type="button"
          className="text-xs uppercase tracking-[0.24em] lg:hidden"
          onClick={() => setMenuOpen((value) => !value)}
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
        >
          Menu
        </button>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/25" />
            <motion.nav
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="relative ml-auto flex min-h-screen w-full max-w-[88vw] flex-col justify-between border-l border-line bg-paper px-6 py-8"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div onClick={() => setMenuOpen(false)}>
                    <BrandLogo width={170} imageClassName="max-h-8 w-auto" />
                  </div>
                  <button
                    type="button"
                    className="text-xs uppercase tracking-[0.24em]"
                    onClick={() => setMenuOpen(false)}
                  >
                    Close
                  </button>
                </div>
                <div className="mt-14 grid gap-5">
                  {mainNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-3xl leading-tight"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="border-t border-line pt-6">
                <p className="eyebrow">More</p>
                <div className="mt-5 grid gap-4">
                  {secondaryNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-base text-mist"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
