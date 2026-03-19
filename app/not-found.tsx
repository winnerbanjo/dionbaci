import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-shell flex min-h-[60vh] items-center py-20">
      <div className="max-w-2xl space-y-6">
        <p className="eyebrow">Not Found</p>
        <h1 className="text-5xl leading-tight sm:text-6xl">This page does not exist.</h1>
        <p className="max-w-xl text-base leading-8 text-mist sm:text-lg">
          The page may have moved or the link may be incomplete.
        </p>
        <Link href="/" className="luxury-button">
          Return Home
        </Link>
      </div>
    </section>
  );
}
