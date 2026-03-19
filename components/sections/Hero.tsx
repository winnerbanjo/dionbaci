"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { images } from "@/lib/images";

const slides = [
  {
    image: images.hero[0],
    eyebrow: "Bridal Atelier",
    title: "Couture shaped for ceremonies of meaning.",
  },
  {
    image: images.hero[1],
    eyebrow: "Collections",
    title: "Seasonless dressing with quiet authority.",
  },
  {
    image: images.hero[2],
    eyebrow: "Atelier",
    title: "Women and bespoke work, refined into one language.",
  },
];

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="min-h-[calc(100vh-5rem)] border-b border-line">
      <div className="page-shell grid min-h-[calc(100vh-5rem)] gap-8 py-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-12 lg:py-10">
        <motion.div
          key={`${slides[activeIndex].title}-copy`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="order-2 max-w-2xl space-y-8 lg:order-1"
        >
          <p className="eyebrow">{slides[activeIndex].eyebrow}</p>
          <h1 className="font-serif text-6xl tracking-[0.12em] sm:text-7xl lg:text-[6.75rem]">
            DION BACI
          </h1>
          <p className="max-w-lg text-xl leading-tight text-ink sm:text-2xl lg:text-3xl">
            {slides[activeIndex].title}
          </p>
          <p className="max-w-xl text-sm leading-8 text-mist">Designed for love, life and Us all.</p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Link href="/bridal" className="luxury-button min-h-12 min-w-[200px] justify-center">
              Discover Bridal
            </Link>
            <Link
              href="/book-consultation"
              className="luxury-button luxury-button--ghost min-h-12 min-w-[200px] justify-center"
            >
              Book Consultation
            </Link>
          </div>
          <div className="flex gap-2 pt-1">
            {slides.map((slide, index) => (
              <button
                key={slide.image}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-1.5 transition-all duration-500 ${
                  activeIndex === index ? "w-10 bg-ink" : "w-6 bg-ink/30"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
        <div className="relative order-1 min-h-[52vh] overflow-hidden bg-[#f7f7f5] sm:min-h-[60vh] lg:order-2 lg:min-h-[72vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={slides[activeIndex].image}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slides[activeIndex].image})` }}
            />
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
