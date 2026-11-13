export type VideoSource =
  | { kind: "iframe"; src: string; provider: "youtube" | "vimeo" }
  | { kind: "file"; src: string }
  | { kind: "unsupported"; src: string };

/** Parses "90", "90s", "1m30s", "1h2m3s" into seconds. */
function parseTime(value: string | null): number {
  if (!value) return 0;
  if (/^\d+$/.test(value)) return Number(value);
  const m = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  if (!m) return 0;
  return Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0);
}

/** Converts a YouTube / Vimeo / direct video URL into something we can embed. */
export function toVideoSource(rawUrl: string): VideoSource {
  let url: URL;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    return { kind: "unsupported", src: rawUrl };
  }

  const host = url.hostname.replace(/^www\.|^m\./, "");

  // YouTube
  let ytId: string | null = null;
  if (host === "youtu.be") ytId = url.pathname.slice(1).split("/")[0];
  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") ytId = url.searchParams.get("v");
    const m = url.pathname.match(/^\/(embed|shorts|live|v)\/([^/?]+)/);
    if (m) ytId = m[2];
  }
  if (ytId && /^[\w-]{6,}$/.test(ytId)) {
    const start = parseTime(url.searchParams.get("t") ?? url.searchParams.get("start"));
    const params = new URLSearchParams({ rel: "0", modestbranding: "1" });
    if (start) params.set("start", String(start));
    return {
      kind: "iframe",
      provider: "youtube",
      src: `https://www.youtube-nocookie.com/embed/${ytId}?${params}`,
    };
  }

  // Vimeo
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = url.pathname.match(/(\d{5,})/)?.[1];
    if (id) return { kind: "iframe", provider: "vimeo", src: `https://player.vimeo.com/video/${id}` };
  }

  // Direct file
  if (/\.(mp4|webm|ogg|ogv|mov|m4v)$/i.test(url.pathname)) {
    return { kind: "file", src: url.toString() };
  }

  return { kind: "unsupported", src: url.toString() };
}

export function isEmbeddableVideoUrl(url: string) {
  return toVideoSource(url).kind !== "unsupported";
}
