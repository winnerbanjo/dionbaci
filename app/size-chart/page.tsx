import Image from "next/image";

import { PageHero } from "@/components/page-hero";

export default function SizeChartPage() {
  return (
    <>
      <PageHero
        eyebrow="Size Chart"
        title="Size Chart"
        description="Use the Dion Baci size guide below before placing a ready-to-wear or made-to-order request."
      />
      <section className="section-space">
        <div className="page-shell">
          <div className="mx-auto flex max-w-5xl justify-center border border-line bg-paper p-4 sm:p-6 lg:p-8">
            <div className="relative w-full">
              <Image
                src="/images/size guide.JPG.jpeg"
                alt="Dion Baci size chart"
                width={1600}
                height={2000}
                className="h-auto w-full object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
