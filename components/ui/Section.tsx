import { ReactNode } from "react";

import { FadeIn } from "@/components/fade-in";

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  border?: boolean;
  align?: "left" | "center";
};

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  border = true,
  align = "left",
}: SectionProps) {
  return (
    <section id={id} className={border ? "section-space border-b border-line" : "section-space"}>
      <div className="page-shell space-y-12 lg:space-y-16">
        <FadeIn>
          <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <h2 className="mt-4 text-4xl leading-tight sm:text-5xl lg:text-6xl">{title}</h2>
            {description ? (
              <div className="mt-6 space-y-4 text-base leading-8 text-mist sm:text-lg">{description}</div>
            ) : null}
          </div>
        </FadeIn>
        {children}
      </div>
    </section>
  );
}
