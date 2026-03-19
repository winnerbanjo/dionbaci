"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { BrandLogo } from "@/components/brand-logo";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSCODE) {
      localStorage.setItem("admin-auth", "true");
      router.push("/admin");
    } else {
      alert("Wrong passcode");
    }
  };

  return (
    <div className="page-shell flex min-h-[calc(100vh-5rem)] items-center justify-center py-16">
      <div className="w-full max-w-md space-y-4 border border-line bg-paper p-8 shadow-card sm:p-10">
        <BrandLogo href="" width={220} imageClassName="max-h-10 w-auto" />
        <p className="text-sm leading-7 text-mist">
          Enter the admin passcode to manage looks and update the shop.
        </p>
        <input
          type="password"
          placeholder="Enter passcode"
          className="w-full border border-line px-4 py-3 outline-none focus:border-ink"
          onChange={(event) => setPassword(event.target.value)}
        />
        <button onClick={handleLogin} className="luxury-button w-full">
          Login
        </button>
      </div>
    </div>
  );
}
