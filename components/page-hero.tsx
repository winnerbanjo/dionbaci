import Link from "next/link";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export function PageHero({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
}: PageHeroProps) {
  return (
    <section className="border-b border-line">
      <div className="page-shell section-space">
        <div className="max-w-4xl space-y-8">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="text-5xl leading-none sm:text-6xl lg:text-7xl">{title}</h1>
          <p className="max-w-2xl text-base leading-8 text-mist sm:text-lg">{description}</p>
          {primaryCta || secondaryCta ? (
            <div className="flex flex-wrap gap-4">
              {primaryCta ? (
                <Link href={primaryCta.href} className="luxury-button">
                  {primaryCta.label}
                </Link>
              ) : null}
              {secondaryCta ? (
                <Link href={secondaryCta.href} className="luxury-button luxury-button--ghost">
                  {secondaryCta.label}
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
