"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useEffect, useState } from "react";

export function EmailPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const subscribed = window.localStorage.getItem("subscribed");
    if (subscribed) {
      return;
    }

    const timer = window.setTimeout(() => {
      setOpen(true);
    }, 1400);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closePopup = () => {
    window.localStorage.setItem("subscribed", "true");
    setOpen(false);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "Unable to subscribe right now");
      }

      window.localStorage.setItem("subscribed", "true");
      setSubmitted(true);
      window.setTimeout(() => {
        setOpen(false);
      }, 900);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to subscribe right now");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: "easeInOut" }}
          className="fixed inset-0 z-[70] flex items-center justify-center px-4"
        >
          <button
            type="button"
            aria-label="Close email popup"
            className="absolute inset-0 bg-black/40"
            onClick={closePopup}
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-xl border border-line bg-white px-6 py-10 text-center shadow-[0_30px_100px_rgba(0,0,0,0.18)] sm:px-10"
          >
            <p className="eyebrow">Private Access</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">Join the Dion Baci World</h2>
            <p className="mx-auto mt-5 max-w-lg text-base leading-8 text-mist">
              Be the first to experience new collections and exclusive releases.
            </p>

            <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address"
                className="min-h-14 flex-1 border border-line px-5 text-sm outline-none placeholder:text-mist focus:border-ink"
              />
              <button type="submit" className="luxury-button min-h-14 px-8" disabled={submitting}>
                {submitting ? "Subscribing..." : "Subscribe"}
              </button>
            </form>

            <button
              type="button"
              onClick={closePopup}
              className="mt-4 text-xs uppercase tracking-[0.22em] text-mist transition hover:text-ink"
            >
              Continue to site
            </button>

            {submitted ? (
              <p className="mt-4 text-sm text-mist">
                Thank you. You are now part of the Dion Baci world.
              </p>
            ) : null}
            {error ? <p className="mt-4 text-sm text-mist">{error}</p> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
