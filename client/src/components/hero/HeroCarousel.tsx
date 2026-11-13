import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Background photo for the hero banner. */
const HERO_IMAGE =
  "https://plus.unsplash.com/premium_photo-1664299792298-52b53119ec78?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D";

/**
 * Which part of the photo stays visible when it is cropped to the banner.
 * Use any CSS object-position value: "center", "right center", "70% 30%"…
 * Shift it right if the photo's subject ends up hidden behind the text card.
 */
const HERO_IMAGE_POSITION = "right center";

type Slide = { title: string; text: string; cta: string; href: string };

const slides: Slide[] = [
  {
    title: "Learning that gets you building",
    text: "Step-by-step video courses where you write real code from the first lecture. Start in minutes.",
    cta: "Browse courses",
    href: "#courses",
  },
  {
    title: "Learn at your own pace",
    text: "Pause, rewind and pick up where you left off. Every course is split into short, focused lectures.",
    cta: "Find your next course",
    href: "#courses",
  },
  {
    title: "From front end to database",
    text: "React, Node.js, TypeScript and PostgreSQL — everything you need to ship full-stack apps.",
    cta: "Explore the catalogue",
    href: "#courses",
  },
];

const AUTOPLAY_MS = 7000;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const reducedMotion = useRef(
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const go = useCallback((dir: number) => setIndex((i) => (i + dir + slides.length) % slides.length), []);

  useEffect(() => {
    if (paused || reducedMotion.current) return;
    const id = window.setTimeout(() => go(1), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [index, paused, go]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured"
      className="container-page pt-4 sm:pt-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
    >
      <div className="relative md:h-[400px]">
        {/* Background photo (stacked on top on mobile, full-bleed behind the card on desktop) */}
        <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-brand-100 to-[#fff7df] md:absolute md:inset-0 md:aspect-auto">
          {!imgFailed && (
            <img
              src={HERO_IMAGE}
              alt=""
              fetchPriority="high"
              onError={() => setImgFailed(true)}
              className="absolute inset-0 size-full object-cover"
              style={{ objectPosition: HERO_IMAGE_POSITION }}
            />
          )}
        </div>

        {/* Text card: only the text rotates, the photo stays put */}
        <div className="grid py-5 md:absolute md:top-16 md:left-16 md:w-[440px] md:bg-white md:p-6 md:shadow-[0_2px_4px_rgba(0,0,0,.08),0_4px_12px_rgba(0,0,0,.08)]">
          {slides.map((s, i) => (
            <div
              key={s.title}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
              aria-hidden={i !== index}
              inert={i !== index}
              className={`col-start-1 row-start-1 transition-opacity duration-500 motion-reduce:transition-none ${
                i === index ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <h1 className="text-[28px] leading-tight font-bold text-ink md:text-[32px]">{s.title}</h1>
              <p className="mt-2 text-base text-ink-soft md:text-[17px]">{s.text}</p>
              <a href={s.href} className="btn-primary mt-4">
                {s.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Round arrow buttons straddling the edges, as on Udemy's billboard */}
        <ArrowButton side="left" onClick={() => go(-1)} />
        <ArrowButton side="right" onClick={() => go(1)} />

        <div className="flex justify-center gap-2 pt-1 md:absolute md:right-6 md:bottom-5 md:rounded-full md:bg-white/80 md:px-2.5 md:py-1.5 md:pt-1.5 md:backdrop-blur">
          {slides.map((s, i) => (
            <button
              key={s.title}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-ink-soft" : "w-2 bg-ink-soft/30 hover:bg-ink-soft/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ArrowButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      aria-label={side === "left" ? "Previous slide" : "Next slide"}
      className={`absolute top-[28%] z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-ink-soft text-white shadow-lg transition-colors hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 md:top-1/2 md:size-12 ${
        side === "left" ? "left-1 md:-left-6" : "right-1 md:-right-6"
      }`}
    >
      <Icon className="size-6" />
    </button>
  );
}