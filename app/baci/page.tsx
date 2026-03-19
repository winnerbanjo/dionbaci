import { PageHero } from "@/components/page-hero";

export default function BaciPage() {
  return (
    <>
      <PageHero
        eyebrow="Baci"
        title="The Dion Baci diffusion line."
        description="Baci Baci is the diffusion line of Dion Baci, created to make elevated fashion more accessible while maintaining the signature elegance and identity of the brand."
      />
      <section className="section-space">
        <div className="page-shell grid gap-px bg-line md:grid-cols-3">
          {["Access", "Ease", "Identity"].map((item) => (
            <div key={item} className="min-h-[260px] bg-paper p-8 sm:p-10">
              <p className="eyebrow">{item}</p>
              <p className="mt-10 text-3xl leading-tight">
                {item === "Access" && "A more accessible entry into the brand universe."}
                {item === "Ease" && "Daily wear shaped with the same quiet sophistication."}
                {item === "Identity" && "Signature elegance held intact across every expression."}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
