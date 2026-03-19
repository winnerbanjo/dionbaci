import { AtelierSection } from "@/components/sections/Atelier";
import { BridalSection } from "@/components/sections/Bridal";
import { CollectionsSection } from "@/components/sections/Collections";
import { CTASection } from "@/components/sections/CTA";
import { Hero } from "@/components/sections/Hero";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BridalSection />
      <CollectionsSection />
      <AtelierSection />
      <CTASection />
    </>
  );
}
