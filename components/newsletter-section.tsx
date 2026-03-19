"use client";

import { FormEvent, useState } from "react";

import { FadeIn } from "@/components/fade-in";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="section-space border-t border-line">
      <div className="page-shell">
        <FadeIn className="mx-auto max-w-3xl border border-line px-6 py-12 text-center sm:px-10 lg:px-16">
          <p className="eyebrow">Newsletter</p>
          <h2 className="mt-4 text-4xl leading-tight sm:text-5xl">Stay Connected</h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-mist sm:text-lg">
            Be the first to experience new collections and exclusive releases.
          </p>
          <form onSubmit={onSubmit} className="mx-auto mt-10 flex max-w-xl flex-col gap-4 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              className="min-h-14 flex-1 border border-line px-5 text-sm outline-none placeholder:text-mist focus:border-ink"
            />
            <button type="submit" className="luxury-button min-h-14 px-8">
              Subscribe
            </button>
          </form>
          {submitted ? (
            <p className="mt-4 text-sm text-mist">
              Thank you. You will be first to know when the next release arrives.
            </p>
          ) : null}
        </FadeIn>
      </div>
    </section>
  );
}
