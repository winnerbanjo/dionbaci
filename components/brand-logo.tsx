import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  width?: number;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export function BrandLogo({
  href = "/",
  width = 220,
  className = "",
  imageClassName = "",
  priority = false,
}: BrandLogoProps) {
  const logo = (
    <Image
      src="/logo-wordmark.svg"
      alt="Dion Baci"
      width={width}
      height={Math.round((width * 240) / 1200)}
      priority={priority}
      className={`h-auto w-auto max-w-full ${imageClassName}`}
    />
  );

  if (!href) {
    return logo;
  }

  return <Link href={href} className={className}>{logo}</Link>;
}
