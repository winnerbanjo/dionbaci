export const dynamic = "force-dynamic";
export const revalidate = 0;

import { BookingForm } from "@/components/booking-form";
import { LookPreview } from "@/components/look-preview";
import { PageHero } from "@/components/page-hero";
import { getLookBySlug } from "@/lib/looks";
import { getConsultationFees } from "@/lib/settings";

type BookConsultationPageProps = {
  searchParams?: Promise<{
    look?: string;
  }>;
};

export default async function BookConsultationPage({
  searchParams,
}: BookConsultationPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const fees = await getConsultationFees();
  const selectedLook = resolvedSearchParams.look
    ? (await getLookBySlug(resolvedSearchParams.look)) ?? undefined
    : undefined;

  return (
    <>
      <PageHero
        eyebrow="Consultation"
        title="A booking system designed with the same clarity as the atelier."
        description="Select an available Tuesday or Thursday, choose a preferred time, and reserve a virtual or physical appointment."
      />
      {selectedLook ? <LookPreview item={selectedLook} /> : null}
      <section className="section-space">
        <div className="page-shell">
          <BookingForm selectedLook={selectedLook} fees={fees} />
        </div>
      </section>
    </>
  );
}
