import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FadeIn } from "@/components/fade-in";
import { getLookBySlug } from "@/lib/looks";

type LookDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function LookDetailPage({ params }: LookDetailPageProps) {
  const { slug } = await params;
  const look = await getLookBySlug(slug);

  if (!look) {
    notFound();
  }

  const safeImage = look.image || "/images/fallback.jpg";

  return (
    <section className="section-space">
      <div className="page-shell grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <FadeIn>
          <div className="relative aspect-[4/5] overflow-hidden bg-[#f7f7f5]">
            <Image src={safeImage} alt={look.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 56vw" />
          </div>
        </FadeIn>
        <FadeIn className="max-w-2xl space-y-6 lg:pt-8">
          <p className="eyebrow">{look.category}</p>
          <h1 className="text-5xl leading-tight sm:text-6xl">{look.name}</h1>
          <p className="text-base leading-8 text-mist sm:text-lg">
            This look is available through private consultation. Share your preferred fit, finish, and occasion during your appointment.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href={`/book-consultation?look=${look.slug}`} className="luxury-button">
              Proceed to Book Consultation
            </Link>
            <Link href="/shop" className="luxury-button luxury-button--ghost">
              Back to Shop
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
