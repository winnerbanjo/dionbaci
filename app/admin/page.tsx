"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { BrandLogo } from "@/components/brand-logo";

type Item = {
  id: string;
  name: string;
  image: string;
  category: string;
  slug: string;
  type: "look" | "beauty";
};

type SettingsForm = {
  bridal_bespoke_fee: string;
  bridal_customization_fee: string;
  eveningwear_bespoke_fee: string;
  custom_fee: string;
};

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getUpcomingConsultationDates() {
  const dates: string[] = [];
  const cursor = new Date();

  while (dates.length < 6) {
    const day = cursor.getDay();
    if (day === 2 || day === 4) {
      dates.push(`${dayNames[day]}, ${monthNames[cursor.getMonth()]} ${cursor.getDate()}`);
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

function formatNaira(value: string) {
  const amount = Number(value);

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export default function AdminPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [itemSavingId, setItemSavingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    image: "",
    category: "Bridal",
    type: "look" as "look" | "beauty",
  });
  const [settings, setSettings] = useState<SettingsForm>({
    bridal_bespoke_fee: "500000",
    bridal_customization_fee: "400000",
    eveningwear_bespoke_fee: "200000",
    custom_fee: "120000",
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

    const loadDashboard = async () => {
      const [itemsResponse, settingsResponse] = await Promise.all([
        fetch("/api/admin/items", { cache: "no-store" }),
        fetch("/api/admin/settings", { cache: "no-store" }),
      ]);

      const itemsData = await itemsResponse.json();
      const settingsData = await settingsResponse.json();

      if (!itemsResponse.ok) {
        setError(itemsData.error ?? "Unable to load items");
        setItems([]);
      } else {
        setError(null);
        setItems(itemsData.items ?? []);
      }

      if (!settingsResponse.ok) {
        setSettingsError(settingsData.error ?? "Unable to load settings");
      } else {
        setSettingsError(null);
        setSettings(settingsData.settings ?? settings);
      }

      setLoading(false);
    };

    loadDashboard();
  }, [authorized]);

  const upcomingDates = useMemo(() => getUpcomingConsultationDates(), []);
  const beautyCount = items.filter((item) => item.type === "beauty").length;
  const lookCount = items.filter((item) => item.type === "look").length;

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
    if (data.item) {
      setItems((current) => [data.item, ...current]);
    }
    setForm({
      name: "",
      image: "",
      category: "Bridal",
      type: "look",
    });
  };

  const handleItemUpdate = async (item: Item) => {
    setItemSavingId(item.id);

    const response = await fetch(`/api/admin/items/${item.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      alert(data?.error ?? "Unable to update item");
      setItemSavingId(null);
      return;
    }

    setEditingId(null);
    setItemSavingId(null);
  };

  const handleItemDelete = async (id: string) => {
    const response = await fetch(`/api/admin/items/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      alert(data?.error ?? "Unable to delete item");
      return;
    }

    setItems((current) => current.filter((item) => item.id !== id));
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

  const logout = () => {
    localStorage.removeItem("admin-auth");
    router.push("/admin/login");
  };

  if (!authorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f5f1ea] text-black">
      <div className="mx-auto grid min-h-screen max-w-[1800px] lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-black/10 bg-white px-6 py-8 lg:px-8">
          <div className="space-y-8">
            <BrandLogo href="" width={210} imageClassName="max-h-10 w-auto" />
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#6a6a6a]">Studio Dashboard</p>
              <h1 className="font-serif text-3xl leading-tight">Dion Baci Admin</h1>
              <p className="text-sm leading-7 text-[#6a6a6a]">
                Manage products, consultation fees, and the weekly booking rhythm from one place.
              </p>
            </div>

            <div className="grid gap-px border border-black/10 bg-black/10">
              {[
                { label: "Total Products", value: String(items.length) },
                { label: "Beauty Products", value: String(beautyCount) },
                { label: "Fashion Looks", value: String(lookCount) },
                { label: "Consultation Days", value: "Tue / Thu" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white p-5">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#6a6a6a]">{stat.label}</p>
                  <p className="mt-3 font-serif text-3xl">{stat.value}</p>
                </div>
              ))}
            </div>

            <button onClick={logout} className="luxury-button w-full justify-center">
              Logout
            </button>
          </div>
        </aside>

        <div className="space-y-8 px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="border border-black/10 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)] sm:p-8">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#6a6a6a]">Overview</p>
              <h2 className="mt-3 font-serif text-4xl leading-tight">Today’s studio view</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6a6a6a]">
                Keep beauty products, fashion pieces, and consultation pricing aligned across the brand.
              </p>
              <div className="mt-8 grid gap-px border border-black/10 bg-black/10 sm:grid-cols-2">
                {upcomingDates.map((date) => (
                  <div key={date} className="bg-white p-5">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#6a6a6a]">Consultation Date</p>
                    <p className="mt-3 text-lg">{date}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#6a6a6a]">12 PM / 2 PM / 4 PM</p>
                  </div>
                ))}
              </div>
            </div>

            <section className="border border-black/10 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)] sm:p-8">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#6a6a6a]">Consultation Fees</p>
              <h2 className="mt-3 font-serif text-3xl">Pricing control</h2>
              <form onSubmit={handleSettingsSubmit} className="mt-8 grid gap-5">
                {[
                  ["bridal_bespoke_fee", "Bridal Bespoke"],
                  ["bridal_customization_fee", "Bridal Customization"],
                  ["eveningwear_bespoke_fee", "Eveningwear Bespoke"],
                  ["custom_fee", "Custom / Made-to-order"],
                ].map(([key, label]) => (
                  <label key={key} className="block">
                    <span className="mb-3 block text-xs uppercase tracking-[0.22em] text-[#6a6a6a]">{label}</span>
                    <input
                      type="number"
                      value={settings[key as keyof SettingsForm]}
                      onChange={(event) =>
                        setSettings((current) => ({ ...current, [key]: event.target.value }))
                      }
                      className="w-full border border-black/10 px-4 py-4 outline-none focus:border-black"
                    />
                    <span className="mt-2 block text-xs text-[#6a6a6a]">
                      {formatNaira(settings[key as keyof SettingsForm])}
                    </span>
                  </label>
                ))}
                <div className="flex flex-wrap items-center gap-4">
                  <button type="submit" className="luxury-button" disabled={settingsSaving}>
                    {settingsSaving ? "Saving..." : "Save Fees"}
                  </button>
                  {settingsError ? <p className="text-sm text-[#6a6a6a]">{settingsError}</p> : null}
                </div>
              </form>
            </section>
          </section>

          <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
            <section className="border border-black/10 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)] sm:p-8">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#6a6a6a]">Add Product</p>
              <h2 className="mt-3 font-serif text-3xl">Create a new item</h2>
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <label className="block">
                  <span className="mb-3 block text-xs uppercase tracking-[0.22em] text-[#6a6a6a]">Name</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    className="w-full border border-black/10 px-4 py-4 outline-none focus:border-black"
                    placeholder="Leave-in Creme Conditioner 300ML"
                  />
                </label>
                <label className="block">
                  <span className="mb-3 block text-xs uppercase tracking-[0.22em] text-[#6a6a6a]">Image URL</span>
                  <input
                    type="text"
                    value={form.image}
                    onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))}
                    className="w-full border border-black/10 px-4 py-4 outline-none focus:border-black"
                    placeholder="/images/beauty/leave-in-creme-conditioner-300ml-tube.PNG"
                  />
                </label>
                <label className="block">
                  <span className="mb-3 block text-xs uppercase tracking-[0.22em] text-[#6a6a6a]">Category</span>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                    className="w-full border border-black/10 px-4 py-4 outline-none focus:border-black"
                  />
                </label>
                <label className="block">
                  <span className="mb-3 block text-xs uppercase tracking-[0.22em] text-[#6a6a6a]">Type</span>
                  <select
                    value={form.type}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, type: event.target.value as "look" | "beauty" }))
                    }
                    className="w-full border border-black/10 px-4 py-4 outline-none focus:border-black"
                  >
                    <option value="look">Look</option>
                    <option value="beauty">Beauty</option>
                  </select>
                </label>
                <button type="submit" className="luxury-button w-full justify-center">
                  Add Item
                </button>
              </form>
            </section>

            <section className="border border-black/10 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)] sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#6a6a6a]">Products</p>
                  <h2 className="mt-3 font-serif text-3xl">Edit or delete items</h2>
                </div>
                {error ? <p className="text-sm text-[#6a6a6a]">{error}</p> : null}
              </div>
              <div className="mt-8 grid gap-px border border-black/10 bg-black/10 sm:grid-cols-2 xl:grid-cols-3">
                {loading ? (
                  <div className="bg-white p-6 text-sm text-[#6a6a6a]">Loading items...</div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="bg-white p-6">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#6a6a6a]">{item.category}</p>
                      {editingId === item.id ? (
                        <div className="mt-4 space-y-3">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(event) =>
                              setItems((current) =>
                                current.map((entry) =>
                                  entry.id === item.id ? { ...entry, name: event.target.value } : entry
                                )
                              )
                            }
                            className="w-full border border-black/10 px-3 py-3 outline-none focus:border-black"
                          />
                          <input
                            type="text"
                            value={item.image}
                            onChange={(event) =>
                              setItems((current) =>
                                current.map((entry) =>
                                  entry.id === item.id ? { ...entry, image: event.target.value } : entry
                                )
                              )
                            }
                            className="w-full border border-black/10 px-3 py-3 outline-none focus:border-black"
                          />
                          <input
                            type="text"
                            value={item.category}
                            onChange={(event) =>
                              setItems((current) =>
                                current.map((entry) =>
                                  entry.id === item.id ? { ...entry, category: event.target.value } : entry
                                )
                              )
                            }
                            className="w-full border border-black/10 px-3 py-3 outline-none focus:border-black"
                          />
                          <select
                            value={item.type}
                            onChange={(event) =>
                              setItems((current) =>
                                current.map((entry) =>
                                  entry.id === item.id
                                    ? { ...entry, type: event.target.value as "look" | "beauty" }
                                    : entry
                                )
                              )
                            }
                            className="w-full border border-black/10 px-3 py-3 outline-none focus:border-black"
                          >
                            <option value="look">Look</option>
                            <option value="beauty">Beauty</option>
                          </select>
                        </div>
                      ) : (
                        <>
                          <h3 className="mt-4 text-2xl leading-tight">{item.name}</h3>
                          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-black">{item.type}</p>
                          <p className="mt-3 break-all text-sm leading-7 text-[#6a6a6a]">{item.image}</p>
                          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[#6a6a6a]">{item.slug}</p>
                        </>
                      )}
                      <div className="mt-4 flex flex-wrap gap-3">
                        {editingId === item.id ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleItemUpdate(item)}
                              className="luxury-button px-4 py-2"
                              disabled={itemSavingId === item.id}
                            >
                              {itemSavingId === item.id ? "Saving..." : "Save"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="luxury-button luxury-button--ghost px-4 py-2"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => setEditingId(item.id)}
                              className="luxury-button luxury-button--ghost px-4 py-2"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleItemDelete(item.id)}
                              className="luxury-button px-4 py-2"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </section>
        </div>
      </div>
    </div>
  );
}
