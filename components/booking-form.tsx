"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";

type SelectedLook = {
  slug: string;
  name: string;
  image: string;
  category: string;
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

const timeSlots = ["12:00 PM", "2:00 PM", "4:00 PM"];
const consultationTypes = [
  "Virtual (Zoom, Google Meet, FaceTime, WhatsApp)",
  "Physical (Chevron, Lekki, Lagos)",
];

type BookingFormProps = {
  selectedLook?: SelectedLook;
  fees: {
    bridalBespokeFee: number;
    bridalCustomizationFee: number;
    eveningwearBespokeFee: number;
    customFee: number;
  };
};

type BookingState = {
  name: string;
  email: string;
  phone: string;
  service: string;
  notes: string;
};

const defaultBookingState: BookingState = {
  name: "",
  email: "",
  phone: "",
  service: "Bridal Couture / Bespoke consultation",
  notes: "",
};

function formatDate(date: Date) {
  return `${dayNames[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}`;
}

function getAvailableDates() {
  const dates: Date[] = [];
  const cursor = new Date();

  while (dates.length < 10) {
    const day = cursor.getDay();
    if (day === 2 || day === 4) {
      dates.push(new Date(cursor));
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
}

export function BookingForm({ selectedLook, fees }: BookingFormProps) {
  const availableDates = useMemo(() => getAvailableDates(), []);
  const pricing = [
    {
      title: "Bridal Couture / Bespoke consultation",
      price: formatPrice(fees.bridalBespokeFee),
      duration: "Design from scratch",
    },
    {
      title: "Bridal customization consultation",
      price: formatPrice(fees.bridalCustomizationFee),
      duration: "Adapting an existing design",
    },
    {
      title: "Eveningwear Bespoke consultation",
      price: formatPrice(fees.eveningwearBespokeFee),
      duration: "Private eveningwear commission",
    },
    {
      title: "Custom / Made-to-order",
      price: formatPrice(fees.customFee),
      duration: "Made-to-order direction",
    },
  ];

  const [form, setForm] = useState<BookingState>({
    ...defaultBookingState,
    notes: selectedLook ? `Requested look: ${selectedLook.name}` : "",
  });
  const [selectedDate, setSelectedDate] = useState(formatDate(availableDates[0]));
  const [selectedTime, setSelectedTime] = useState(timeSlots[0]);
  const [selectedType, setSelectedType] = useState(consultationTypes[0]);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const bankDetails = [
    {
      label: "Primary Local Transfer",
      lines: ["DION BACI LIMITED", "Moniepoint", "6819833852"],
    },
    {
      label: "GTBank Naira",
      lines: ["Dion Baci Limited", "GTBank", "3001822654"],
    },
    {
      label: "GTBank USD",
      lines: ["Dion Baci Limited", "GTBank", "3001822472 (USD)", "SWIFT: GTBINGLA"],
    },
  ];

  const onReceiptChange = (event: ChangeEvent<HTMLInputElement>) => {
    setReceiptFile(event.target.files?.[0] ?? null);
  };

  const uploadReceipt = async () => {
    if (!receiptFile) {
      return null;
    }

    const base64 = await readFileAsDataUrl(receiptFile);
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file: base64,
        type: "receipt",
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.secure_url) {
      throw new Error(data?.error ?? "Unable to upload payment proof");
    }

    return String(data.secure_url);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.name || !form.email || !form.phone || !form.service) {
      setError("Complete the required booking details before proceeding.");
      return;
    }

    if (!receiptFile) {
      setError("Upload your transfer receipt before submitting.");
      return;
    }

    setSubmitting(true);

    try {
      const paymentProof = await uploadReceipt();

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          date: selectedDate,
          time: selectedTime,
          type: selectedType,
          paymentProof,
          notes: selectedLook ? `${form.notes}\nRequested look: ${selectedLook.name}`.trim() : form.notes,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error ?? "Unable to submit booking");
      }

      setSuccess(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We could not submit your consultation request right now."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="border border-line bg-paper p-10 text-center sm:p-16">
        <p className="eyebrow">Consultation Received</p>
        <h2 className="mt-4 text-4xl sm:text-5xl">Your consultation request has been received.</h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-mist sm:text-lg">
          Our team will contact you shortly to confirm your appointment and review the transfer receipt.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-px bg-line lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-10 bg-paper p-6 sm:p-8 lg:p-12">
        {selectedLook ? (
          <div className="border border-line p-5 sm:p-6">
            <p className="eyebrow">{selectedLook.category}</p>
            <h2 className="mt-3 text-2xl">{selectedLook.name}</h2>
            <p className="mt-3 text-sm leading-7 text-mist">
              You are requesting this look. Complete your consultation to proceed.
            </p>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="eyebrow">Full Name</span>
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              className="min-h-14 border border-line px-4 text-sm outline-none focus:border-ink"
              placeholder="Enter full name"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="eyebrow">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              className="min-h-14 border border-line px-4 text-sm outline-none focus:border-ink"
              placeholder="Enter email address"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="eyebrow">Phone</span>
            <input
              type="tel"
              value={form.phone}
              onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
              className="min-h-14 border border-line px-4 text-sm outline-none focus:border-ink"
              placeholder="Enter phone number"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="eyebrow">Service Type</span>
            <select
              value={form.service}
              onChange={(event) => setForm((current) => ({ ...current, service: event.target.value }))}
              className="min-h-14 border border-line bg-paper px-4 text-sm outline-none focus:border-ink"
            >
              {pricing.map((item) => (
                <option key={item.title} value={item.title}>
                  {item.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="space-y-4">
          <p className="eyebrow">Date</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {availableDates.map((date) => {
              const label = formatDate(date);
              const active = selectedDate === label;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setSelectedDate(label)}
                  className={`border px-4 py-5 text-left transition-all duration-300 ${
                    active ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink hover:shadow-card"
                  }`}
                >
                  <span className="block text-xs uppercase tracking-[0.22em]">
                    {dayNames[date.getDay()]}
                  </span>
                  <span className="mt-3 block text-lg font-serif">
                    {monthNames[date.getMonth()]} {date.getDate()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <p className="eyebrow">Time Slot</p>
          <div className="flex flex-wrap gap-3">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedTime(slot)}
                className={`border px-5 py-3 text-xs uppercase tracking-[0.22em] transition-all duration-300 ${
                  selectedTime === slot
                    ? "border-ink bg-ink text-paper"
                    : "border-line hover:border-ink hover:shadow-card"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <p className="eyebrow">Consultation Type</p>
          <div className="grid gap-3">
            {consultationTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`border p-5 text-left transition-all duration-300 ${
                  selectedType === type
                    ? "border-ink bg-ink text-paper"
                    : "border-line hover:border-ink hover:shadow-card"
                }`}
              >
                <span className="block text-sm leading-7">{type}</span>
              </button>
            ))}
          </div>
        </div>

        <label className="flex flex-col gap-2">
          <span className="eyebrow">Notes</span>
          <textarea
            value={form.notes}
            onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
            className="min-h-32 border border-line px-4 py-4 text-sm outline-none focus:border-ink"
            placeholder="Add fitting notes, preferred contact times, or anything your consultation should account for."
          />
        </label>

        <div className="grid gap-px bg-line sm:grid-cols-2">
          {pricing.map((item) => (
            <div key={item.title} className="space-y-2 bg-paper p-6">
              <p className="eyebrow">{item.duration}</p>
              <h3 className="text-2xl">{item.title}</h3>
              <p className="text-sm text-mist">{item.price}</p>
            </div>
          ))}
        </div>
      </div>

      <aside className="space-y-8 bg-paper p-6 sm:p-8 lg:p-12">
        <div className="space-y-4 border-b border-line pb-8">
          <p className="eyebrow">Booking Summary</p>
          <div className="space-y-3 text-sm leading-7 text-mist">
            {selectedLook ? (
              <p>
                <span className="text-ink">Look:</span> {selectedLook.name}
              </p>
            ) : null}
            <p>
              <span className="text-ink">Service:</span> {form.service}
            </p>
            <p>
              <span className="text-ink">Date:</span> {selectedDate}
            </p>
            <p>
              <span className="text-ink">Time:</span> {selectedTime}
            </p>
            <p>
              <span className="text-ink">Format:</span> {selectedType}
            </p>
          </div>
        </div>

        <div className="space-y-4 border-b border-line pb-8">
          <p className="eyebrow">Payment Details</p>
          <div className="grid gap-4">
            {bankDetails.map((bank) => (
              <div key={bank.label} className="border border-line p-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-mist">{bank.label}</p>
                <div className="mt-3 space-y-1 text-sm leading-7 text-ink">
                  {bank.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 border-b border-line pb-8">
          <p className="eyebrow">Upload Payment Proof</p>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={onReceiptChange}
            className="w-full border border-line px-4 py-4 text-sm outline-none file:mr-4 file:border-0 file:bg-black file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-[0.18em] file:text-white"
          />
          <p className="text-sm leading-7 text-mist">
            Upload your transfer receipt so the studio can confirm your consultation request.
          </p>
        </div>

        <div className="space-y-4">
          <p className="eyebrow">Notes</p>
          <ul className="space-y-3 text-sm leading-7 text-mist">
            <li>Fees are non-refundable.</li>
            <li>Consultation fees are not deducted from outfit cost.</li>
            <li>One accompanying adult allowed.</li>
            <li>No children allowed.</li>
          </ul>
        </div>

        {error ? <p className="text-sm text-[#8a4b4b]">{error}</p> : null}

        <button type="submit" className="luxury-button w-full justify-center" disabled={submitting}>
          {submitting ? "Submitting..." : "Proceed"}
        </button>
      </aside>
    </form>
  );
}
