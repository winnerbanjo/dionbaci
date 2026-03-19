"use client";

import { useState } from "react";

const womenRows = [
  ["XS", "6", "32", "25", "35"],
  ["S", "8", "34", "27", "37"],
  ["M", "10", "36", "29", "39"],
  ["L", "12", "39", "32", "42"],
];

const menRows = [
  ["S", "36", "36", "30", "15"],
  ["M", "38", "38", "32", "16"],
  ["L", "40", "41", "35", "17"],
  ["XL", "42", "44", "38", "18"],
];

type Tab = "Women" | "Men";

export function SizeChartTabs() {
  const [tab, setTab] = useState<Tab>("Women");
  const rows = tab === "Women" ? womenRows : menRows;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3">
        {(["Women", "Men"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`border px-5 py-3 text-xs uppercase tracking-[0.22em] ${
              tab === item ? "border-ink bg-ink text-paper" : "border-line"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto border border-line">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line">
              {tab === "Women"
                ? ["Size", "UK", "Bust", "Waist", "Hip"].map((head) => (
                    <th key={head} className="px-6 py-4 text-xs uppercase tracking-[0.22em] text-mist">
                      {head}
                    </th>
                  ))
                : ["Size", "Chest", "Waist", "Hip", "Neck"].map((head) => (
                    <th key={head} className="px-6 py-4 text-xs uppercase tracking-[0.22em] text-mist">
                      {head}
                    </th>
                  ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${tab}-${index}`} className="border-b border-line last:border-b-0">
                {row.map((cell) => (
                  <td key={cell} className="px-6 py-5 text-sm text-ink">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
