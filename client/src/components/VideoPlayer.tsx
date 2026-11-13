import { ExternalLink, VideoOff } from "lucide-react";
import { toVideoSource } from "../lib/video";

export function VideoPlayer({ url, title }: { url: string; title: string }) {
  const source = toVideoSource(url);

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-black">
      {source.kind === "iframe" && (
        <iframe
          key={source.src}
          src={source.src}
          title={title}
          className="absolute inset-0 size-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      )}

      {source.kind === "file" && (
        <video key={source.src} src={source.src} controls playsInline className="absolute inset-0 size-full">
          Your browser does not support embedded video.
        </video>
      )}

      {source.kind === "unsupported" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-white/80">
          <VideoOff className="size-10" />
          <p className="text-sm">This video can't be embedded here.</p>
          <a
            href={source.src}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white underline underline-offset-4"
          >
            Open video in a new tab <ExternalLink className="size-4" />
          </a>
        </div>
      )}
    </div>
  );
}
