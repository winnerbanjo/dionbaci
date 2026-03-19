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

type SettingsForm = {
  bridal_fee: string;
  bespoke_fee: string;
  custom_fee: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [looks, setLooks] = useState<Look[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    image: "",
    category: "Bridal",
    type: "look" as "look" | "beauty",
  });
  const [settings, setSettings] = useState<SettingsForm>({
    bridal_fee: "80000",
    bespoke_fee: "50000",
    custom_fee: "35000",
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
      const [itemsResponse, settingsResponse] = await Promise.all([
        fetch("/api/admin/items", { cache: "no-store" }),
        fetch("/api/admin/settings", { cache: "no-store" }),
      ]);
      const itemsData = await itemsResponse.json();
      const settingsData = await settingsResponse.json();

      if (!itemsResponse.ok) {
        setError(itemsData.error ?? "Unable to load items");
        setLooks([]);
      } else {
        setError(null);
        setLooks(itemsData.items ?? []);
      }

      if (!settingsResponse.ok) {
        setSettingsError(settingsData.error ?? "Unable to load settings");
      } else {
        setSettingsError(null);
        setSettings(settingsData.settings ?? settings);
      }

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
      body: JSON.stringify({
        ...form,
        type: form.type.toLowerCase(),
      }),
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

  const handleSettingsSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSettingsSaving(true);

    const response = await fetch("/api/admin/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ settings }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setSettingsError(data?.error ?? "Unable to save settings");
      setSettingsSaving(false);
      return;
    }

    setSettings(data.settings ?? settings);
    setSettingsError(null);
    setSettingsSaving(false);
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

          <div className="space-y-8">
            <section className="border border-line bg-paper p-8 shadow-card sm:p-10">
              <p className="eyebrow">Consultation Fees</p>
              <h2 className="mt-3 text-3xl">Edit booking fees</h2>
              <form onSubmit={handleSettingsSubmit} className="mt-8 grid gap-5 sm:grid-cols-3">
                <label className="block">
                  <span className="mb-3 block text-xs uppercase tracking-[0.22em] text-mist">Bridal Fee</span>
                  <input
                    type="number"
                    value={settings.bridal_fee}
                    onChange={(event) =>
                      setSettings((current) => ({ ...current, bridal_fee: event.target.value }))
                    }
                    className="w-full border border-line px-4 py-4 outline-none focus:border-ink"
                  />
                </label>
                <label className="block">
                  <span className="mb-3 block text-xs uppercase tracking-[0.22em] text-mist">Bespoke Fee</span>
                  <input
                    type="number"
                    value={settings.bespoke_fee}
                    onChange={(event) =>
                      setSettings((current) => ({ ...current, bespoke_fee: event.target.value }))
                    }
                    className="w-full border border-line px-4 py-4 outline-none focus:border-ink"
                  />
                </label>
                <label className="block">
                  <span className="mb-3 block text-xs uppercase tracking-[0.22em] text-mist">Custom Fee</span>
                  <input
                    type="number"
                    value={settings.custom_fee}
                    onChange={(event) =>
                      setSettings((current) => ({ ...current, custom_fee: event.target.value }))
                    }
                    className="w-full border border-line px-4 py-4 outline-none focus:border-ink"
                  />
                </label>
                <div className="sm:col-span-3 flex flex-wrap items-center gap-4">
                  <button type="submit" className="luxury-button" disabled={settingsSaving}>
                    {settingsSaving ? "Saving..." : "Save Fees"}
                  </button>
                  {settingsError ? <p className="text-sm text-mist">{settingsError}</p> : null}
                </div>
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
    </div>
  );
}
