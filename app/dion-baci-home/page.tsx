import { PageHero } from "@/components/page-hero";

export default function DionBaciHomePage() {
  return (
    <>
      <PageHero
        eyebrow="Home"
        title="Coming Soon"
        description="Dion Baci Home is being developed as a quieter extension of the brand universe."
        primaryCta={{ label: "Book Consultation", href: "/book-consultation" }}
      />
      <section className="section-space">
        <div className="page-shell flex min-h-[40vh] items-center justify-center">
          <div className="max-w-2xl text-center">
            <p className="text-4xl sm:text-5xl">Coming Soon</p>
          </div>
        </div>
      </section>
    </>
  );
}
