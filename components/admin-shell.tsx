"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, ReactNode, useEffect, useState } from "react";

const adminLinks = [
  { label: "Overview", href: "/admin" },
  { label: "Bookings", href: "/admin/bookings" },
  { label: "Products", href: "/admin/products" },
  { label: "Content", href: "/admin/content" },
  { label: "Contacts", href: "/admin/contacts" },
  { label: "Courses", href: "/admin/courses" },
];

type AdminShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AdminShell({ title, description, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const session = window.localStorage.getItem("dion-baci-admin-session");
    if (session === "active") {
      setAuthorized(true);
    }
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password === "DionBaciAdmin") {
      window.localStorage.setItem("dion-baci-admin-session", "active");
      setAuthorized(true);
      setError("");
      return;
    }

    setError("Incorrect password. Use the current studio passcode.");
  };

  const handleLogout = () => {
    window.localStorage.removeItem("dion-baci-admin-session");
    setAuthorized(false);
    setPassword("");
    router.push("/admin");
  };

  if (!authorized) {
    return (
      <section className="min-h-[calc(100vh-5rem)] bg-[#f8f8f8]">
        <div className="page-shell flex min-h-[calc(100vh-5rem)] items-center justify-center py-16">
          <div className="w-full max-w-md border border-line bg-paper p-8 shadow-card sm:p-10">
            <p className="eyebrow">Private Studio</p>
            <h1 className="mt-4 text-4xl leading-tight">Dion Baci Admin</h1>
            <p className="mt-4 text-sm leading-7 text-mist">
              Enter the studio passcode to manage bookings, collections, content, and client inquiries.
            </p>
            <form className="mt-10 space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-3 block text-xs uppercase tracking-[0.22em] text-mist">
                  Passcode
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full border border-line px-4 py-4 outline-none placeholder:text-mist focus:border-ink"
                  placeholder="Enter passcode"
                />
              </label>
              {error ? <p className="text-sm text-mist">{error}</p> : null}
              <button type="submit" className="luxury-button w-full">
                Enter Studio
              </button>
            </form>
            <p className="mt-5 text-xs uppercase tracking-[0.18em] text-mist">
              Starter passcode: DionBaciAdmin
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-5rem)] bg-[#f8f8f8]">
      <div className="page-shell grid gap-8 py-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:py-10">
        <aside className="border border-line bg-paper p-6 shadow-card">
          <div className="border-b border-line pb-6">
            <p className="eyebrow">Private Studio</p>
            <p className="mt-4 text-2xl">Dion Baci Admin</p>
          </div>
          <nav className="mt-6 flex flex-col gap-2">
            {adminLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 text-xs uppercase tracking-[0.22em] ${
                    active ? "bg-ink text-paper" : "text-mist hover:bg-[#fafafa] hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <button type="button" className="luxury-button mt-8 w-full" onClick={handleLogout}>
            Logout
          </button>
        </aside>

        <div className="space-y-8">
          <header className="border border-line bg-paper p-6 shadow-card sm:p-8">
            <p className="eyebrow">Studio Overview</p>
            <h1 className="mt-4 text-4xl leading-tight">{title}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-mist">{description}</p>
          </header>
          {children}
        </div>
      </div>
    </section>
  );
}
