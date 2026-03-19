import Link from "next/link";

import { legalLinks } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="page-shell grid gap-12 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.38em]">Dion Baci</p>
          <p className="max-w-sm text-sm leading-7 text-mist">
            Designed for love, life and Us all.
          </p>
        </div>
        <div className="space-y-4">
          <p className="eyebrow">Visit</p>
          <p className="text-sm leading-7 text-mist">
            House 8, Angle View Estate
            <br />
            Chevron Alternative Route
            <br />
            Lekki, Lagos, Nigeria
          </p>
        </div>
        <div className="space-y-4">
          <p className="eyebrow">Contact</p>
          <p className="text-sm leading-7 text-mist">
            <a href="tel:+2347033947449">+2347033947449</a>
            <br />
            <a href="mailto:Dionbaci@gmail.com">Dionbaci@gmail.com</a>
          </p>
        </div>
        <div className="space-y-4">
          <p className="eyebrow">Information</p>
          <div className="flex flex-col gap-3">
            {legalLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-mist hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
