import Link from "next/link";

type ProductGridProps = {
  items: Array<{ title: string; category: string }>;
  ctaHref?: string;
  ctaLabel?: string;
};

export function ProductGrid({ items, ctaHref, ctaLabel }: ProductGridProps) {
  return (
    <div className="space-y-10">
      <div className="content-grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item, index) => (
          <article
            key={`${item.title}-${index}`}
            className="group flex min-h-[380px] flex-col justify-between p-8 sm:p-10"
          >
            <div className="space-y-16">
              <div className="h-56 border border-line bg-[#fafafa]" />
              <div>
                <p className="eyebrow">{item.category}</p>
                <h3 className="mt-4 text-2xl leading-tight">{item.title}</h3>
              </div>
            </div>
            <p className="mt-10 text-xs uppercase tracking-[0.24em] text-mist transition-colors group-hover:text-ink">
              View Edit
            </p>
          </article>
        ))}
      </div>
      {ctaHref && ctaLabel ? (
        <Link href={ctaHref} className="luxury-button">
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}
