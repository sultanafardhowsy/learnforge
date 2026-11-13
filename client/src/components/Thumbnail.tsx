import { useState } from "react";
import { ImageOff } from "lucide-react";

/** Course image with a graceful fallback when the URL is broken. */
export function Thumbnail({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`grid place-items-center bg-gradient-to-br from-brand-100 to-brand-50 text-brand-700/60 ${className}`}
        role="img"
        aria-label={alt || "No image"}
      >
        <ImageOff className="size-8" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`bg-line/50 object-cover ${className}`}
    />
  );
}
