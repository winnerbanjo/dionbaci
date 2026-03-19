"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { BrandLogo } from "@/components/brand-logo";

type Look = {
  id: string;
  name: string;
  image: string;
  category: string;
  slug: string;
  type: "look" | "beauty";
};

export default function AdminPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [looks, setLooks] = useState<Look[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    image: "",
    category: "Bridal",
    type: "look" as "look" | "beauty",
  });

  useEffect(() => {
    const auth = localStorage.getItem("admin-auth");
    if (!auth) {
      router.push("/admin/login");
      return;
    }

    setAuthorized(true);
  }, [router]);

  useEffect(() => {
    if (!authorized) return;

    const loadLooks = async () => {
      const response = await fetch("/api/admin/items", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to load items");
        setLooks([]);
        setLoading(false);
        return;
      }

      setError(null);
      setLooks(data.items ?? []);
      setLoading(false);
    };

    loadLooks();
  }, [authorized]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch("/api/admin/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      alert(data?.error ?? "Unable to save item");
      return;
    }

    const data = await response.json();
    setLooks((current) => [data.item, ...current]);
    setForm({
      name: "",
      image: "",
      category: "Bridal",
      type: "look",
    });
  };

  const logout = () => {
    localStorage.removeItem("admin-auth");
    router.push("/admin/login");
  };

  if (!authorized) {
    return null;
  }

  return (
    <div className="page-shell py-10">
      <div className="space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-4 border border-line bg-paper p-10 shadow-card">
          <div className="space-y-4">
            <BrandLogo href="" width={240} imageClassName="max-h-10 w-auto" />
            <div>
              <h1 className="text-4xl">Admin Dashboard</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-mist">
                Add new looks, manage the shop presentation, and keep the consultation funnel current.
              </p>
            </div>
          </div>
          <button onClick={logout} className="luxury-button luxury-button--ghost">
            Logout
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <section className="border border-line bg-paper p-8 shadow-card sm:p-10">
            <p className="eyebrow">Add Item</p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="block">
                <span className="mb-3 block text-xs uppercase tracking-[0.22em] text-mist">Name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  className="w-full border border-line px-4 py-4 outline-none focus:border-ink"
                  placeholder="Ivory Ceremony Dress"
                />
              </label>
              <label className="block">
                <span className="mb-3 block text-xs uppercase tracking-[0.22em] text-mist">Image URL</span>
                <input
                  type="text"
                  value={form.image}
                  onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))}
                  className="w-full border border-line px-4 py-4 outline-none focus:border-ink"
                  placeholder="/images/IMG_4368.JPG.jpeg or https://..."
                />
              </label>
              <label className="block">
                <span className="mb-3 block text-xs uppercase tracking-[0.22em] text-mist">Category</span>
                <select
                  value={form.category}
                  onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                  className="w-full border border-line px-4 py-4 outline-none focus:border-ink"
                >
                  <option value="Bridal">Bridal</option>
                  <option value="Collection">Collection</option>
                  <option value="Atelier">Atelier</option>
                  <option value="Bespoke">Bespoke</option>
                  <option value="Custom Piece">Custom Piece</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-3 block text-xs uppercase tracking-[0.22em] text-mist">Type</span>
                <select
                  value={form.type}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, type: event.target.value as "look" | "beauty" }))
                  }
                  className="w-full border border-line px-4 py-4 outline-none focus:border-ink"
                >
                  <option value="look">Look</option>
                  <option value="beauty">Beauty</option>
                </select>
              </label>
              <button type="submit" className="luxury-button w-full">
                Add Item
              </button>
            </form>
          </section>

          <section className="border border-line bg-paper p-8 shadow-card sm:p-10">
            <p className="eyebrow">Stored Items</p>
            <h2 className="mt-3 text-3xl">Current shop and beauty inventory</h2>
            <div className="mt-8 grid gap-px bg-line sm:grid-cols-2 xl:grid-cols-3">
              {loading ? (
                <div className="bg-paper p-6 text-sm text-mist">Loading looks...</div>
              ) : error ? (
                <div className="bg-paper p-6 text-sm text-mist">{error}</div>
              ) : (
                looks.map((look) => (
                  <div key={look.id} className="bg-paper p-6">
                    <p className="eyebrow">{look.category}</p>
                    <h3 className="mt-4 text-2xl leading-tight">{look.name}</h3>
                    <p className="mt-3 text-xs uppercase tracking-[0.18em] text-ink">{look.type}</p>
                    <p className="mt-3 break-all text-sm leading-7 text-mist">{look.image}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.18em] text-mist">{look.slug}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
