import { PageHero } from "@/components/page-hero";
import { SizeChartTabs } from "@/components/size-chart-tabs";

export default function SizeChartPage() {
  return (
    <>
      <PageHero
        eyebrow="Size Chart"
        title="Men and women size references."
        description="Use the chart below as a guide before placing a ready-to-wear or made-to-order request."
      />
      <section className="section-space">
        <div className="page-shell">
          <SizeChartTabs />
        </div>
      </section>
    </>
  );
}
