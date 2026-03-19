"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { navItems } from "@/data/site";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur">
      <div className="page-shell flex h-20 items-center justify-between gap-6">
        <Link href="/" className="text-sm uppercase tracking-[0.38em]">
          Dion Baci
        </Link>
        <button
          className="text-xs uppercase tracking-[0.28em] lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          Menu
        </button>
        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className={`text-[11px] uppercase tracking-[0.22em] ${
                  active ? "text-ink" : "text-mist hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      {open ? (
        <nav className="page-shell flex flex-col gap-4 border-t border-line py-5 lg:hidden">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={`${item.href}-${item.label}-mobile`}
                href={item.href}
                className={`text-xs uppercase tracking-[0.24em] ${
                  active ? "text-ink" : "text-mist"
                }`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      ) : null}
    </header>
  );
}
