"use client";

import { useMemo, useState } from "react";

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

type BookingFormProps = {
  selectedLook?: SelectedLook;
  fees: {
    bridalBespokeFee: number;
    bridalCustomizationFee: number;
    eveningwearBespokeFee: number;
    customFee: number;
  };
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export function BookingForm({ selectedLook, fees }: BookingFormProps) {
  const availableDates = useMemo(() => getAvailableDates(), []);
  const [selectedDate, setSelectedDate] = useState(formatDate(availableDates[0]));
  const [selectedTime, setSelectedTime] = useState(timeSlots[0]);
  const [selectedType, setSelectedType] = useState(consultationTypes[0]);
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
      duration: "Eveningwear commission",
    },
    { title: "Custom / Made-to-order", price: formatPrice(fees.customFee), duration: "30–45 mins" },
  ];

  return (
    <div className="grid gap-px bg-line lg:grid-cols-[1.15fr_0.85fr]">
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
        <div className="space-y-4">
          <p className="eyebrow">Select Date</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {availableDates.map((date) => {
              const label = formatDate(date);
              const active = selectedDate === label;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setSelectedDate(label)}
                  className={`border px-4 py-5 text-left ${
                    active ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink"
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
                className={`border px-5 py-3 text-xs uppercase tracking-[0.22em] ${
                  selectedTime === slot ? "border-ink bg-ink text-paper" : "border-line"
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
                className={`border p-5 text-left ${
                  selectedType === type ? "border-ink bg-ink text-paper" : "border-line"
                }`}
              >
                <span className="block text-sm leading-7">{type}</span>
              </button>
            ))}
          </div>
        </div>

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
          <div className="space-y-4 text-sm leading-7 text-mist">
            {selectedLook ? (
              <p>
                <span className="text-ink">Look:</span> {selectedLook.name}
              </p>
            ) : null}
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
          <button type="button" className="luxury-button w-full">
            Proceed to Booking
          </button>
        </div>

        <div className="space-y-4 border-b border-line pb-8">
          <p className="eyebrow">Payment</p>
          <div className="space-y-2 text-sm leading-7 text-mist">
            <p className="text-ink">DION BACI LIMITED</p>
            <p>Moniepoint</p>
            <p>Account Number: 6819833852</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="eyebrow">Notes</p>
          <ul className="space-y-3 text-sm leading-7 text-mist">
            <li>Fees are non-refundable</li>
            <li>Consultation fees are not deducted from outfit cost</li>
            <li>One accompanying adult allowed</li>
            <li>No children allowed</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
