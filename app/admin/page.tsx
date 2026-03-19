"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { BrandLogo } from "@/components/brand-logo";

type ItemType = "look" | "beauty";
type AdminView = "dashboard" | "products" | "beauty" | "bookings" | "subscribers" | "settings";

type Item = {
  id: string;
  name: string;
  image: string;
  category: string;
  slug: string;
  type: ItemType;
};

type ItemForm = {
  name: string;
  category: string;
  slug: string;
  type: ItemType;
};

type Booking = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  type: string;
  notes: string | null;
  paymentProof: string | null;
  status: string;
  createdAt: string;
};

type Subscriber = {
  id: string;
  email: string;
  createdAt: string;
};

type SettingsForm = {
  bridal_bespoke_fee: string;
  bridal_customization_fee: string;
  eveningwear_bespoke_fee: string;
  custom_fee: string;
};

const defaultItemForm: ItemForm = {
  name: "",
  category: "Bridal",
  slug: "",
  type: "look",
};

const defaultSettings: SettingsForm = {
  bridal_bespoke_fee: "500000",
  bridal_customization_fee: "400000",
  eveningwear_bespoke_fee: "200000",
  custom_fee: "120000",
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

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

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

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
}

async function uploadImage(file: File, type: ItemType) {
  const base64 = await readFileAsDataUrl(file);
  const response = await fetch("/api/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      file: base64,
      type,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.secure_url) {
    throw new Error(data?.error ?? "Unable to upload image");
  }

  return String(data.secure_url);
}

function SectionCard({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="border border-black/10 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)] sm:p-8">
      <p className="text-[11px] uppercase tracking-[0.24em] text-[#6a6a6a]">{eyebrow}</p>
      <h2 className="mt-3 font-serif text-3xl leading-tight">{title}</h2>
      {description ? <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6a6a6a]">{description}</p> : null}
      <div className="mt-8">{children}</div>
    </section>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [subscriberError, setSubscriberError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [itemSavingId, setItemSavingId] = useState<string | null>(null);
  const [uploadingForId, setUploadingForId] = useState<string | null>(null);
  const [bookingSavingId, setBookingSavingId] = useState<string | null>(null);
  const [creatingItem, setCreatingItem] = useState(false);
  const [form, setForm] = useState<ItemForm>(defaultItemForm);
  const [newItemFile, setNewItemFile] = useState<File | null>(null);
  const [editFiles, setEditFiles] = useState<Record<string, File | null>>({});
  const [settings, setSettings] = useState<SettingsForm>(defaultSettings);
  const [currentView, setCurrentView] = useState<AdminView>("dashboard");

  useEffect(() => {
    const auth = localStorage.getItem("admin-auth");
    if (!auth) {
      router.push("/admin/login");
      return;
    }

    setAuthorized(true);
  }, [router]);

  const loadDashboard = async () => {
    setLoading(true);

    try {
      const [itemsResponse, settingsResponse, bookingsResponse, subscribersResponse] = await Promise.all([
        fetch("/api/admin/items", { cache: "no-store" }),
        fetch("/api/admin/settings", { cache: "no-store" }),
        fetch("/api/admin/bookings", { cache: "no-store" }),
        fetch("/api/admin/subscribers", { cache: "no-store" }),
      ]);

      const itemsData = await itemsResponse.json().catch(() => null);
      const settingsData = await settingsResponse.json().catch(() => null);
      const bookingsData = await bookingsResponse.json().catch(() => null);
      const subscribersData = await subscribersResponse.json().catch(() => null);

      if (!itemsResponse.ok) {
        setError(itemsData?.error ?? "Unable to load items");
        setItems([]);
      } else {
        setError(null);
        setItems(itemsData?.items ?? []);
      }

      if (!settingsResponse.ok) {
        setSettingsError(settingsData?.error ?? "Unable to load settings");
      } else {
        setSettingsError(null);
        setSettings(settingsData?.settings ?? defaultSettings);
      }

      if (!bookingsResponse.ok) {
        setBookingError(bookingsData?.error ?? "Unable to load bookings");
        setBookings([]);
      } else {
        setBookingError(null);
        setBookings(bookingsData?.bookings ?? []);
      }

      if (!subscribersResponse.ok) {
        setSubscriberError(subscribersData?.error ?? "Unable to load subscribers");
        setSubscribers([]);
      } else {
        setSubscriberError(null);
        setSubscribers(subscribersData?.subscribers ?? []);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authorized) {
      return;
    }

    void loadDashboard();
  }, [authorized]);

  const upcomingDates = useMemo(() => getUpcomingConsultationDates(), []);
  const looks = useMemo(() => items.filter((item) => item.type === "look"), [items]);
  const beautyProducts = useMemo(() => items.filter((item) => item.type === "beauty"), [items]);
  const pendingBookings = useMemo(
    () => bookings.filter((booking) => booking.status.toLowerCase() === "pending"),
    [bookings]
  );
  const recentSubscribers = useMemo(() => subscribers.slice(0, 6), [subscribers]);
  const viewLabels: Record<AdminView, string> = {
    dashboard: "Dashboard",
    products: "Products",
    beauty: "Beauty Products",
    bookings: "Bookings",
    subscribers: "Subscribers",
    settings: "Settings",
  };
  const visibleProductSections =
    currentView === "products"
      ? [
          {
            id: "looks",
            eyebrow: "Products",
            title: "Fashion looks",
            description: "Edit, replace imagery, or remove atelier pieces without leaving the dashboard.",
            list: looks,
            empty: "No looks added yet.",
          },
        ]
      : currentView === "beauty"
        ? [
            {
              id: "beauty",
              eyebrow: "Beauty Products",
              title: "Beauty catalog",
              description: "Keep the beauty edit clean, direct, and ready for order.",
              list: beautyProducts,
              empty: "No beauty products added yet.",
            },
          ]
        : [];

  const stats = [
    { label: "Total Products", value: String(items.length) },
    { label: "Consultations", value: String(bookings.length) },
    { label: "Subscribers", value: String(subscribers.length) },
    { label: "Beauty Products", value: String(beautyProducts.length) },
    { label: "Pending", value: String(pendingBookings.length) },
    { label: "Fashion Looks", value: String(looks.length) },
  ];

  const handleCreateItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newItemFile) {
      setFormError("Select an image to upload");
      return;
    }

    setCreatingItem(true);
    setFormError(null);

    try {
      const image = await uploadImage(newItemFile, form.type);

      const response = await fetch("/api/admin/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          image,
          slug: form.slug || createSlug(form.name),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.item) {
        throw new Error(data?.error ?? "Unable to create item");
      }

      setItems((current) => [data.item, ...current]);
      setForm(defaultItemForm);
      setNewItemFile(null);
    } catch (uploadError) {
      setFormError(uploadError instanceof Error ? uploadError.message : "Unable to create item");
    } finally {
      setCreatingItem(false);
    }
  };

  const handleItemUpdate = async (item: Item) => {
    setItemSavingId(item.id);

    try {
      let image = item.image;
      const selectedFile = editFiles[item.id];

      if (selectedFile) {
        setUploadingForId(item.id);
        image = await uploadImage(selectedFile, item.type);
      }

      const response = await fetch(`/api/admin/items/${item.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...item,
          image,
          slug: item.slug || createSlug(item.name),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error ?? "Unable to update item");
      }

      setItems((current) =>
        current.map((entry) => (entry.id === item.id ? { ...item, image, slug: item.slug || createSlug(item.name) } : entry))
      );
      setEditFiles((current) => ({ ...current, [item.id]: null }));
      setEditingId(null);
    } catch (updateError) {
      alert(updateError instanceof Error ? updateError.message : "Unable to update item");
    } finally {
      setUploadingForId(null);
      setItemSavingId(null);
    }
  };

  const handleItemDelete = async (id: string) => {
    const response = await fetch(`/api/admin/items/${id}`, {
      method: "DELETE",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
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

    setSettings(data?.settings ?? settings);
    setSettingsError(null);
    setSettingsSaving(false);
  };

  const handleBookingStatus = async (booking: Booking, status: "confirmed" | "pending") => {
    setBookingSavingId(booking.id);

    const response = await fetch(`/api/admin/bookings/${booking.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setBookingError(data?.error ?? "Unable to update booking");
      setBookingSavingId(null);
      return;
    }

    setBookings((current) =>
      current.map((entry) => (entry.id === booking.id ? { ...entry, status } : entry))
    );
    setBookingSavingId(null);
  };

  const handleBookingDelete = async (id: string) => {
    setBookingSavingId(id);

    const response = await fetch(`/api/admin/bookings/${id}`, {
      method: "DELETE",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setBookingError(data?.error ?? "Unable to delete booking");
      setBookingSavingId(null);
      return;
    }

    setBookings((current) => current.filter((booking) => booking.id !== id));
    setBookingSavingId(null);
  };

  const handleSubscriberDelete = async (id: string) => {
    const response = await fetch(`/api/admin/subscribers/${id}`, {
      method: "DELETE",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setSubscriberError(data?.error ?? "Unable to delete subscriber");
      return;
    }

    setSubscribers((current) => current.filter((subscriber) => subscriber.id !== id));
  };

  const logout = () => {
    localStorage.removeItem("admin-auth");
    router.push("/admin/login");
  };

  if (!authorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f4efe6] text-black">
      <div className="mx-auto grid min-h-screen max-w-[1800px] lg:grid-cols-[300px_1fr]">
        <aside className="border-r border-black/10 bg-[#111111] px-6 py-8 text-white lg:px-8">
          <div className="space-y-8">
            <BrandLogo href="" width={210} imageClassName="max-h-10 w-auto brightness-0 invert" />
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.24em] text-white/60">Admin Studio</p>
              <h1 className="font-serif text-3xl leading-tight">Dion Baci Control Room</h1>
              <p className="text-sm leading-7 text-white/70">
                Oversee products, pricing, and the consultation funnel with a cleaner operating view.
              </p>
            </div>

            <nav className="grid gap-2 text-sm text-white/70">
              {(Object.keys(viewLabels) as AdminView[]).map((view) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => setCurrentView(view)}
                  className={`rounded-full border px-4 py-3 text-left transition ${
                    currentView === view
                      ? "border-white bg-white text-black"
                      : "border-white/10 hover:border-white/40 hover:text-white"
                  }`}
                >
                  {viewLabels[view]}
                </button>
              ))}
            </nav>

            <div className="grid gap-px border border-white/10 bg-white/10">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-[#151515] p-5">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-white/50">{stat.label}</p>
                  <p className="mt-3 font-serif text-3xl text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            <button onClick={logout} className="luxury-button w-full justify-center border-white text-white hover:bg-white hover:text-black">
              Logout
            </button>
          </div>
        </aside>

        <div className="space-y-8 px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
          <div className="flex items-end justify-between gap-4 border-b border-black/10 pb-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#6a6a6a]">Admin Workspace</p>
              <h2 className="mt-3 font-serif text-4xl">{viewLabels[currentView]}</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[#6a6a6a]">
              A cleaner operations view for products, subscribers, bookings, and consultation settings.
            </p>
          </div>

          {currentView === "dashboard" ? (
          <section id="dashboard" className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <SectionCard
              eyebrow="Dashboard Overview"
              title="Today’s studio view"
              description="A premium operational view of inventory, pricing, and the weekly consultation rhythm."
            >
              <div className="grid gap-px border border-black/10 bg-black/10 sm:grid-cols-2">
                {upcomingDates.map((date) => (
                  <div key={date} className="bg-white p-5">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#6a6a6a]">Consultation Date</p>
                    <p className="mt-3 text-lg">{date}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#6a6a6a]">12 PM / 2 PM / 4 PM</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              eyebrow="Live Signals"
              title="Audience and booking pulse"
              description="A compact view of current consultation demand and subscriber growth."
            >
              <div className="grid gap-px border border-black/10 bg-black/10 sm:grid-cols-2">
                <div className="bg-white p-5">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#6a6a6a]">Recent Subscribers</p>
                  <p className="mt-3 font-serif text-3xl">{subscribers.length}</p>
                  <div className="mt-4 space-y-2 text-sm leading-6 text-[#6a6a6a]">
                    {recentSubscribers.length ? recentSubscribers.map((subscriber) => (
                      <p key={subscriber.id} className="truncate">{subscriber.email}</p>
                    )) : <p>No subscribers yet.</p>}
                  </div>
                </div>
                <div className="bg-white p-5">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#6a6a6a]">Pending Consultations</p>
                  <p className="mt-3 font-serif text-3xl">{pendingBookings.length}</p>
                  <div className="mt-4 space-y-2 text-sm leading-6 text-[#6a6a6a]">
                    {pendingBookings.slice(0, 4).length ? pendingBookings.slice(0, 4).map((booking) => (
                      <p key={booking.id}>{booking.name} • {booking.date}</p>
                    )) : <p>No pending requests.</p>}
                  </div>
                </div>
              </div>
            </SectionCard>
          </section>
          ) : null}

          {currentView === "products" || currentView === "beauty" || currentView === "settings" ? (
          <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            {currentView === "products" || currentView === "beauty" ? (
            <SectionCard
              eyebrow="Products"
              title="Add a new product"
              description="Upload the asset, define the product type, and send it straight into the live catalog."
            >
              <form onSubmit={handleCreateItem} className="grid gap-4">
                <label className="block">
                  <span className="mb-3 block text-xs uppercase tracking-[0.22em] text-[#6a6a6a]">Name</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        name: event.target.value,
                        slug: current.slug ? current.slug : createSlug(event.target.value),
                      }))
                    }
                    className="w-full border border-black/10 px-4 py-4 outline-none transition focus:border-black"
                    placeholder="Ivory Ceremony Dress"
                  />
                </label>

                <label className="block">
                  <span className="mb-3 block text-xs uppercase tracking-[0.22em] text-[#6a6a6a]">Category</span>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                    className="w-full border border-black/10 px-4 py-4 outline-none transition focus:border-black"
                    placeholder="Bridal"
                  />
                </label>

                <label className="block">
                  <span className="mb-3 block text-xs uppercase tracking-[0.22em] text-[#6a6a6a]">Slug</span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(event) => setForm((current) => ({ ...current, slug: createSlug(event.target.value) }))}
                    className="w-full border border-black/10 px-4 py-4 outline-none transition focus:border-black"
                    placeholder="ivory-ceremony-dress"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-3 block text-xs uppercase tracking-[0.22em] text-[#6a6a6a]">Type</span>
                    <select
                      value={form.type}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, type: event.target.value as ItemType }))
                      }
                      className="w-full border border-black/10 px-4 py-4 outline-none transition focus:border-black"
                    >
                      <option value="look">Look</option>
                      <option value="beauty">Beauty</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-3 block text-xs uppercase tracking-[0.22em] text-[#6a6a6a]">Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => setNewItemFile(event.target.files?.[0] ?? null)}
                      className="w-full border border-black/10 px-4 py-[0.95rem] text-sm outline-none file:mr-4 file:border-0 file:bg-black file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-[0.18em] file:text-white"
                    />
                  </label>
                </div>

                {formError ? <p className="text-sm text-[#6a6a6a]">{formError}</p> : null}

                <button type="submit" className="luxury-button w-full justify-center" disabled={creatingItem}>
                  {creatingItem ? "Uploading..." : "Add Product"}
                </button>
              </form>
            </SectionCard>
            ) : null}

            {currentView === "settings" || currentView === "products" ? (
            <SectionCard
              eyebrow="Consultation Settings"
              title="Pricing control"
              description="Update atelier consultation fees and keep the booking experience current."
            >
              <form id="settings" onSubmit={handleSettingsSubmit} className="grid gap-5">
                {[
                  ["bridal_bespoke_fee", "Bridal Couture / Bespoke"],
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
                      className="w-full border border-black/10 px-4 py-4 outline-none transition focus:border-black"
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
            </SectionCard>
            ) : null}
          </section>
          ) : null}

          {currentView === "bookings" ? (
          <SectionCard
            eyebrow="Bookings"
            title="Consultation requests"
            description="Track new consultation requests, review payment proof, and confirm appointments from one place."
          >
            <div id="bookings" className="grid gap-4">
              {bookings.length === 0 ? (
                <div className="border border-dashed border-black/15 bg-[#faf8f3] p-6 text-sm leading-7 text-[#6a6a6a]">
                  No bookings submitted yet.
                </div>
              ) : (
                bookings.map((booking) => (
                  <article key={booking.id} className="border border-black/10 bg-[#fcfbf8] p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-[#6a6a6a]">
                          {booking.status}
                        </p>
                        <h3 className="font-serif text-2xl leading-tight">{booking.name}</h3>
                        <p className="text-sm leading-7 text-[#6a6a6a]">
                          {booking.service} • {booking.type}
                        </p>
                      </div>
                      <div className="text-right text-sm leading-7 text-[#6a6a6a]">
                        <p>{booking.date}</p>
                        <p>{booking.time}</p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                      <div className="grid gap-2 text-sm leading-7 text-[#6a6a6a]">
                        <p><span className="text-black">Email:</span> {booking.email}</p>
                        <p><span className="text-black">Phone:</span> {booking.phone}</p>
                        {booking.notes ? (
                          <p><span className="text-black">Notes:</span> {booking.notes}</p>
                        ) : null}
                      </div>
                      <div className="grid gap-3">
                        {booking.paymentProof ? (
                          <a
                            href={booking.paymentProof}
                            target="_blank"
                            rel="noreferrer"
                            className="luxury-button luxury-button--ghost justify-center"
                          >
                            View Receipt
                          </a>
                        ) : (
                          <div className="border border-dashed border-black/15 px-4 py-3 text-sm text-[#6a6a6a]">
                            No receipt uploaded
                          </div>
                        )}
                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => handleBookingStatus(booking, "confirmed")}
                            className="luxury-button px-4 py-2"
                            disabled={bookingSavingId === booking.id}
                          >
                            {bookingSavingId === booking.id && booking.status !== "confirmed"
                              ? "Saving..."
                              : "Confirm"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleBookingStatus(booking, "pending")}
                            className="luxury-button luxury-button--ghost px-4 py-2"
                            disabled={bookingSavingId === booking.id}
                          >
                            Set Pending
                          </button>
                          <button
                            type="button"
                            onClick={() => handleBookingDelete(booking.id)}
                            className="luxury-button px-4 py-2"
                            disabled={bookingSavingId === booking.id}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              )}
              {bookingError ? <p className="text-sm text-[#6a6a6a]">{bookingError}</p> : null}
            </div>
          </SectionCard>
          ) : null}

          {currentView === "subscribers" ? (
          <SectionCard
            eyebrow="Subscribers"
            title="Email audience"
            description="Manage captured emails from the site popup and newsletter forms."
          >
            <div id="subscribers" className="grid gap-4">
              {subscribers.length === 0 ? (
                <div className="border border-dashed border-black/15 bg-[#faf8f3] p-6 text-sm leading-7 text-[#6a6a6a]">
                  No subscribers yet.
                </div>
              ) : (
                subscribers.map((subscriber) => (
                  <article
                    key={subscriber.id}
                    className="flex flex-wrap items-center justify-between gap-4 border border-black/10 bg-[#fcfbf8] p-5"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-black">{subscriber.email}</p>
                      <p className="text-sm text-[#6a6a6a]">
                        {new Date(subscriber.createdAt).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSubscriberDelete(subscriber.id)}
                      className="luxury-button px-4 py-2"
                    >
                      Delete
                    </button>
                  </article>
                ))
              )}
              {subscriberError ? <p className="text-sm text-[#6a6a6a]">{subscriberError}</p> : null}
            </div>
          </SectionCard>
          ) : null}

          {visibleProductSections.map((section) => (
            <SectionCard
              key={section.id}
              eyebrow={section.eyebrow}
              title={section.title}
              description={section.description}
            >
              <div id={section.id} className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                {loading ? (
                  <div className="border border-black/10 bg-[#faf8f3] p-6 text-sm text-[#6a6a6a]">
                    Loading items...
                  </div>
                ) : section.list.length === 0 ? (
                  <div className="border border-black/10 bg-[#faf8f3] p-6 text-sm text-[#6a6a6a]">
                    {section.empty}
                  </div>
                ) : (
                  section.list.map((item) => (
                    <article
                      key={item.id}
                      className="flex flex-col gap-4 border border-black/10 bg-[#fcfbf8] p-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden bg-[#f2eee7]">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                      </div>

                      {editingId === item.id ? (
                        <div className="flex flex-col gap-3">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(event) =>
                              setItems((current) =>
                                current.map((entry) =>
                                  entry.id === item.id
                                    ? { ...entry, name: event.target.value, slug: createSlug(event.target.value) }
                                    : entry
                                )
                              )
                            }
                            className="w-full border border-black/10 px-3 py-3 outline-none transition focus:border-black"
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
                            className="w-full border border-black/10 px-3 py-3 outline-none transition focus:border-black"
                          />
                          <input
                            type="text"
                            value={item.slug}
                            onChange={(event) =>
                              setItems((current) =>
                                current.map((entry) =>
                                  entry.id === item.id
                                    ? { ...entry, slug: createSlug(event.target.value) }
                                    : entry
                                )
                              )
                            }
                            className="w-full border border-black/10 px-3 py-3 outline-none transition focus:border-black"
                          />
                          <select
                            value={item.type}
                            onChange={(event) =>
                              setItems((current) =>
                                current.map((entry) =>
                                  entry.id === item.id
                                    ? { ...entry, type: event.target.value as ItemType }
                                    : entry
                                )
                              )
                            }
                            className="w-full border border-black/10 px-3 py-3 outline-none transition focus:border-black"
                          >
                            <option value="look">Look</option>
                            <option value="beauty">Beauty</option>
                          </select>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(event) =>
                              setEditFiles((current) => ({
                                ...current,
                                [item.id]: event.target.files?.[0] ?? null,
                              }))
                            }
                            className="w-full border border-black/10 px-3 py-3 text-sm outline-none file:mr-4 file:border-0 file:bg-black file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-[0.18em] file:text-white"
                          />
                          <p className="break-all text-xs text-[#6a6a6a]">{item.image}</p>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <p className="text-[10px] uppercase tracking-[0.22em] text-[#6a6a6a]">{item.category}</p>
                          <h3 className="font-serif text-2xl leading-tight">{item.name}</h3>
                          <p className="text-xs uppercase tracking-[0.18em] text-black/70">{item.type}</p>
                          <p className="break-all text-xs text-[#6a6a6a]">{item.slug}</p>
                        </div>
                      )}

                      <div className="mt-auto flex flex-wrap gap-3 pt-2">
                        {editingId === item.id ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleItemUpdate(item)}
                              className="luxury-button px-4 py-2"
                              disabled={itemSavingId === item.id}
                            >
                              {uploadingForId === item.id
                                ? "Uploading..."
                                : itemSavingId === item.id
                                  ? "Saving..."
                                  : "Save"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(null);
                                setEditFiles((current) => ({ ...current, [item.id]: null }));
                                void loadDashboard();
                              }}
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
                    </article>
                  ))
                )}
              </div>
              {error ? <p className="mt-4 text-sm text-[#6a6a6a]">{error}</p> : null}
            </SectionCard>
          ))}
        </div>
      </div>
    </div>
  );
}
