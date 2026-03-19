import Image from "next/image";
import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { images } from "@/lib/images";

const navigationLinks = [
  { label: "Bridal", href: "/bridal" },
  { label: "Collections", href: "/collections" },
  { label: "Shop", href: "/shop" },
  { label: "Atelier", href: "/atelier" },
  { label: "Book Consultation", href: "/book-consultation" },
];

const supportLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Return Policy", href: "/return-policy" },
  { label: "Shipping Policy", href: "/shipping-policy" },
];

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
      <path d="M20 11.5C20 16.194 16.194 20 11.5 20C10.057 20 8.697 19.639 7.506 19.004L4 20L5.035 16.657C4.367 15.452 4 14.065 4 12.591C4 7.896 7.806 4.091 12.5 4.091C17.194 4.091 21 7.896 21 12.591" />
      <path d="M9 9.5C9.171 11.489 10.39 13.487 12.18 14.82C13.089 15.497 14.214 15.949 15.5 16" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="page-shell space-y-12 py-12 lg:py-14">
        <div className="space-y-5">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="eyebrow">Instagram</p>
              <h3 className="mt-3 text-3xl">Follow us on Instagram</h3>
            </div>
            <a
              href="https://www.instagram.com/dionbaciofficial/"
              target="_blank"
              rel="noreferrer"
              className="luxury-button"
            >
              Follow us on Instagram
            </a>
          </div>
          <div className="grid grid-cols-2 gap-px bg-line md:grid-cols-4 xl:grid-cols-6">
            {images.instagram.map((src, index) => (
              <a
                key={`${src}-${index}`}
                href="https://www.instagram.com/dionbaciofficial/"
                target="_blank"
                rel="noreferrer"
                className="relative aspect-square overflow-hidden bg-[#f7f7f5]"
              >
                <Image
                  src={src}
                  alt={`Instagram preview ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 16vw"
                  className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
                />
              </a>
            ))}
          </div>
        </div>

        <div className="grid gap-10 border-t border-line pt-12 md:grid-cols-2 xl:grid-cols-5">
          <div className="space-y-4">
            <BrandLogo width={240} imageClassName="max-h-11 w-auto" />
            <p className="max-w-sm text-sm leading-7 text-mist">
              Designed for love, life and Us all.
            </p>
          </div>

          <div className="space-y-4">
            <p className="eyebrow">Navigation</p>
            <div className="flex flex-col gap-3">
              {navigationLinks.map((item) => (
                <Link key={item.href} href={item.href} className="text-sm text-mist hover:text-ink">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="eyebrow">Support / Legal</p>
            <div className="flex flex-col gap-3">
              {supportLinks.map((item) => (
                <Link key={item.href} href={item.href} className="text-sm text-mist hover:text-ink">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="eyebrow">Contact</p>
            <div className="space-y-2 text-sm leading-7 text-mist">
              <p>
                <a href="tel:+2347033947449">+2347033947449</a>
              </p>
              <p>
                <a href="mailto:Dionbaci@gmail.com">Dionbaci@gmail.com</a>
              </p>
              <p>
                House 8, Angle View Estate
                <br />
                Chevron Alternative Route
                <br />
                Lekki, Lagos, Nigeria
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="eyebrow">Social</p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/dionbaciofficial/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink hover:opacity-70"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://wa.me/2347033947449"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink hover:opacity-70"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon />
              </a>
            </div>
            <Link href="/book-consultation" className="luxury-button">
              Book Consultation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
