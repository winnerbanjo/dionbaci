import { PageHero } from "@/components/page-hero";

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Visit or speak with the atelier."
        description="For appointments, bridal enquiries, bespoke requests, or general product questions, reach out through the details below."
        primaryCta={{ label: "Book Consultation", href: "/book-consultation" }}
      />
      <section className="section-space">
        <div className="page-shell grid gap-px bg-line lg:grid-cols-3">
          <div className="bg-paper p-8 sm:p-10">
            <p className="eyebrow">Phone</p>
            <a href="tel:+2347033947449" className="mt-6 block text-3xl leading-tight">
              +2347033947449
            </a>
          </div>
          <div className="bg-paper p-8 sm:p-10">
            <p className="eyebrow">Email</p>
            <a href="mailto:Dionbaci@gmail.com" className="mt-6 block text-3xl leading-tight">
              Dionbaci@gmail.com
            </a>
          </div>
          <div className="bg-paper p-8 sm:p-10">
            <p className="eyebrow">Address</p>
            <p className="mt-6 text-3xl leading-tight">
              House 8, Angle View Estate
              <br />
              Chevron Alternative Route
              <br />
              Lekki, Lagos, Nigeria
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
