import Link from "next/link";

import { FadeIn } from "@/components/fade-in";

export function BridalSection() {
  return (
    <section id="bridal" className="border-b border-line">
      <div className="text-center mx-auto max-w-xl px-6 py-24">
        <FadeIn>
          <h2 className="text-3xl font-semibold tracking-wide md:text-4xl">Bridal</h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="mt-4 text-sm leading-relaxed text-gray-600 md:text-base">
            For moments that demand precision.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-gray-600 md:text-base">
            Each piece is shaped with intention — refined silhouettes, controlled detail, and a quiet
            confidence that lets the bride lead the story.
          </p>
        </FadeIn>
        <FadeIn delay={0.3} className="mt-8 flex justify-center">
          <Link
            href="/bridal"
            className="inline-flex items-center justify-center border border-black px-6 py-3 text-sm tracking-wide transition-all duration-300 hover:bg-black hover:text-white"
          >
            DISCOVER BRIDAL
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
