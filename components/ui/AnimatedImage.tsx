"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type AnimatedImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  aspect?: "portrait" | "landscape" | "hero";
  className?: string;
};

const FALLBACK_IMAGE = "/images/fallback.jpg";

const aspectClasses = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[5/4]",
  hero: "aspect-[4/5] min-h-[60vh] lg:min-h-[78vh]",
};

export function AnimatedImage({
  src,
  alt,
  priority = false,
  aspect = "portrait",
  className = "",
}: AnimatedImageProps) {
  const safeImage = src || FALLBACK_IMAGE;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.04 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.03 }}
      className={`group relative overflow-hidden bg-[#f7f7f5] ${aspectClasses[aspect]} ${className}`}
    >
      <Image
        src={safeImage}
        alt={alt}
        fill
        priority={priority}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        sizes={
          aspect === "hero"
            ? "(max-width: 1024px) 100vw, 58vw"
            : "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        }
      />
    </motion.div>
  );
}
