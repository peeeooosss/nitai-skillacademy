"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { generateSlidesFromMarkdown, type Slide } from "@/lib/slideGenerator";
import { hexToRgba } from "@/lib/courseIcons";

interface SlideViewerProps {
  missionNumber: number;
  title: string;
  contentMarkdown: string;
  accent?: string;
  compact?: boolean;
}

const GOLD = "#f59e0b";

function accentFor(slide: Slide, courseAccent: string): string {
  return slide.accentColor === "gold" ? GOLD : courseAccent || "#22d3ee";
}

export default function SlideViewer({
  missionNumber,
  title,
  contentMarkdown,
  accent = "#22d3ee",
  compact = false,
}: SlideViewerProps) {
  const slides = generateSlidesFromMarkdown(contentMarkdown, missionNumber, title);
  const [current, setCurrent] = useState(0);

  const total = slides.length;
  const progress = total > 0 ? ((current + 1) / total) * 100 : 0;

  const goTo = useCallback(
    (n: number) => {
      if (n < 0 || n >= total || n === current) return;
      setCurrent(n);
    },
    [current, total]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        goTo(current + 1);
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goTo(current - 1);
      }
      if (e.key === "Home") goTo(0);
      if (e.key === "End") goTo(total - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current, total, goTo]);

  if (slides.length === 0) return null;

  const slide = slides[current];
  const slideAccent = accentFor(slide, accent);
  const heightClass = compact ? "h-[500px]" : "min-h-[540px] h-[calc(100vh-300px)]";

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl border border-white/10 flex flex-col`} style={{ background: "#0a0d14", height: heightClass }}>
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div
        className="absolute top-0 left-0 z-20 h-[2px] transition-all duration-500"
        style={{ width: `${progress}%`, background: slideAccent, boxShadow: `0 0 12px ${slideAccent}` }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative z-10 flex flex-1 flex-col p-6 overflow-y-auto sm:p-8 lg:p-10"
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em]" style={{ color: slideAccent }}>
              {slide.marker}
            </span>
            <div className="h-px w-8" style={{ background: "rgba(255,255,255,0.15)" }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">{slide.section}</span>
          </div>

          <div className="flex w-full max-w-4xl flex-1 flex-col justify-start overflow-y-auto">
            {slide.layout === "title" && <TitleSlide slide={slide} accent={slideAccent} />}
            {slide.layout === "content" && <ContentSlide slide={slide} accent={slideAccent} />}
            {slide.layout === "code" && <CodeSlide slide={slide} accent={slideAccent} />}
            {slide.layout === "keypoints" && <KeypointsSlide slide={slide} accent={slideAccent} />}
            {slide.layout === "takeaways" && <TakeawaysSlide slide={slide} accent={slideAccent} />}
            {slide.layout === "wrapup" && <WrapupSlide slide={slide} accent={slideAccent} />}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="relative z-20 flex items-center justify-between px-6 pb-4 pt-2 sm:px-8">
        <button
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 font-mono text-xs uppercase tracking-wider text-white/30 transition-all hover:bg-white/[0.05] hover:text-white/70 disabled:cursor-not-allowed disabled:opacity-20"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${i === current ? "h-1.5 w-6" : i < current ? "h-1.5 w-1.5 bg-white/25" : "h-1.5 w-1.5 bg-white/10"}`}
              style={i === current ? { background: slideAccent } : undefined}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => goTo(current + 1)}
          disabled={current === total - 1}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 font-mono text-xs uppercase tracking-wider text-white/30 transition-all hover:bg-white/[0.05] hover:text-white/70 disabled:cursor-not-allowed disabled:opacity-20"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 font-mono text-[11px] tracking-[0.15em] text-white/25">
        <span style={{ color: slideAccent }}>{String(current + 1).padStart(2, "0")}</span>
        {" / "}
        <span>{String(total).padStart(2, "0")}</span>
      </div>
    </div>
  );
}

/* ── Slide layouts ── */

function TitleSlide({ slide, accent }: { slide: Slide; accent: string }) {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
        {slide.title.split(" ").map((word, i) =>
          i === 1 || i === 2 ? (
            <span key={i} className="font-medium italic" style={{ color: accent }}>
              {word}{" "}
            </span>
          ) : (
            word + " "
          )
        )}
      </h1>

      {slide.subtitle && (
        <p className="max-w-lg font-mono text-[12px] uppercase leading-relaxed tracking-[0.2em] text-white/40">
          <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full align-middle" style={{ background: accent }} />
          {slide.subtitle}
        </p>
      )}

      {slide.contentBlocks[0]?.items && (
        <div className="mt-4 space-y-2">
          {slide.contentBlocks[0].items.map((item, i) => (
            <div key={i} className="flex items-start gap-3 text-sm leading-relaxed text-white/50">
              <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full" style={{ background: accent }} />
              <span dangerouslySetInnerHTML={{ __html: item }} />
            </div>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center gap-6 pt-8">
        <div className="font-mono text-[10px] uppercase leading-loose tracking-[0.2em] text-white/30">
          <strong className="font-medium text-white/50">Session Goal</strong>
          <br />
          Understand and apply the core concepts.
        </div>
        <div className="ml-auto text-right font-mono text-[10px] uppercase leading-loose tracking-[0.2em] text-white/30">
          <strong className="font-medium text-white/50">Format</strong> · Lecture + Examples
          <br />
          <strong className="font-medium text-white/50">Duration</strong> · ~15 min read
        </div>
      </div>
    </div>
  );
}

function ContentSlide({ slide, accent }: { slide: Slide; accent: string }) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold leading-tight tracking-tight text-white sm:text-2xl">
        {slide.title.split(" ").map((word, i) =>
          i === 0 || (slide.title.split(" ").length > 3 && i === 2) ? (
            <span key={i} className="font-medium italic" style={{ color: accent }}>
              {word}{" "}
            </span>
          ) : (
            word + " "
          )
        )}
      </h2>

      {slide.contentBlocks.map((block, i) => (
        <div key={i}>
          {block.type === "paragraph" && (
            <p className="max-w-2xl text-sm leading-relaxed text-slate-400" dangerouslySetInnerHTML={{ __html: block.text || "" }} />
          )}
          {block.type === "bullets" && (
            <div className="space-y-3">
              {(block.items || []).map((item, j) => (
                <div key={j} className="flex items-start gap-3 text-sm leading-relaxed text-slate-300">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: accent }} />
                  <span dangerouslySetInnerHTML={{ __html: item }} />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CodeSlide({ slide, accent }: { slide: Slide; accent: string }) {
  const codeBlock = slide.contentBlocks.find((b) => b.type === "code");
  void accent;
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold leading-tight tracking-tight text-white sm:text-2xl">{slide.title}</h2>

      {codeBlock && (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-900">
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
            </div>
            <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.15em] text-white/25">
              {codeBlock.language || "code"}
            </span>
          </div>
          <pre className="overflow-x-auto p-5">
            <code className="font-mono text-[13px] leading-relaxed text-slate-400" dangerouslySetInnerHTML={{ __html: codeBlock.code || "" }} />
          </pre>
        </div>
      )}
    </div>
  );
}

function KeypointsSlide({ slide, accent }: { slide: Slide; accent: string }) {
  const gridBlock = slide.contentBlocks.find((b) => b.type === "grid");
  const cards = gridBlock?.cards || [];

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold leading-tight tracking-tight text-white sm:text-2xl">{slide.title}</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cards.map((card, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
            <div className="mb-2 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.25em]" style={{ color: accent }}>
              <span className="h-1 w-1 rounded-full" style={{ background: accent }} />
              {String(i + 1).padStart(2, "0")}
            </div>
            <h3 className="mb-1.5 text-base font-semibold text-white">{card.title}</h3>
            <p className="text-sm leading-relaxed text-slate-400">{card.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TakeawaysSlide({ slide, accent }: { slide: Slide; accent: string }) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold leading-tight tracking-tight text-white sm:text-2xl">
        Why this matters <span className="font-medium italic" style={{ color: accent }}>for you.</span>
      </h2>

      <div className="mt-2 space-y-3">
        {(slide.contentBlocks[0]?.items || []).map((item, i) => (
          <div key={i} className="flex items-start gap-4 rounded-xl border border-white/[0.06] bg-slate-900/60 p-4">
            <span
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold"
              style={{ background: hexToRgba(accent, 0.12), color: accent }}
            >
              {i + 1}
            </span>
            <span className="pt-1 text-sm leading-relaxed text-slate-300" dangerouslySetInnerHTML={{ __html: item }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function WrapupSlide({ slide, accent }: { slide: Slide; accent: string }) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold leading-tight tracking-tight text-white sm:text-2xl">
        Practice <span className="font-medium italic" style={{ color: accent }}>Challenge.</span>
      </h2>

      <div className="space-y-2.5">
        {(slide.contentBlocks[0]?.items || []).map((item, i) => (
          <div key={i} className="flex items-start gap-3 text-sm leading-relaxed text-slate-300">
            <span className="pt-0.5 font-mono text-[11px] font-bold" style={{ color: accent }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span dangerouslySetInnerHTML={{ __html: item }} />
          </div>
        ))}
      </div>

      {slide.contentBlocks[1]?.type === "callout" && (
        <div className="mt-4 rounded-xl border-l-2 p-4" style={{ background: hexToRgba(accent, 0.08), borderLeftColor: accent }}>
          <p className="text-sm leading-relaxed text-slate-300">{slide.contentBlocks[1].text}</p>
        </div>
      )}
    </div>
  );
}