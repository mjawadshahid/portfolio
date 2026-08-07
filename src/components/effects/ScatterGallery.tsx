"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { galleryColumns, type Tile } from "@/data/milestones";

/**
 * Full-screen pinned horizontal gallery.
 *
 * Not a carousel. The strip is a column grid — columns of different widths and
 * gaps, holding tiles of different heights at different vertical offsets, so
 * the composition scatters instead of marching. Each column also has a `depth`
 * that makes it drift at its own rate, which is what turns a flat strip into
 * something with air in it.
 *
 * Under reduced motion the pin never engages and it degrades to a normal
 * horizontally-scrollable region with the same content.
 */
export function ScatterGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const section = sectionRef.current;
    const strip = stripRef.current;
    if (!section || !strip || reduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const distance = () => Math.max(0, strip.scrollWidth - window.innerWidth);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(strip, { x: () => -distance(), ease: "none" }, 0);

      // Per-column parallax, layered on top of the strip's own travel.
      strip.querySelectorAll<HTMLElement>("[data-depth]").forEach((col) => {
        const depth = Number(col.dataset.depth ?? 1);
        if (depth === 1) return;
        tl.to(
          col,
          { x: () => distance() * (1 - depth), ease: "none" },
          0
        );
      });

      // Tiles lift in as they enter the viewport horizontally.
      strip.querySelectorAll<HTMLElement>("[data-tile]").forEach((tile) => {
        gsap.fromTo(
          tile,
          { y: 34, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: tile,
              containerAnimation: tl,
              start: "left 95%",
              once: true,
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden"
      data-act="gallery"
    >
      <div className="shell pointer-events-none absolute top-0 left-0 right-0 z-10 pt-8">
        <p className="t-label text-[var(--color-amber)]">05 — the long version</p>
      </div>

      <div
        ref={stripRef}
        className="flex h-[100svh] w-max items-center px-[clamp(1.25rem,5vw,6rem)] max-lg:overflow-x-auto"
      >
        {galleryColumns.map((col, ci) => (
          <div
            key={ci}
            data-depth={col.depth}
            style={{ width: col.w, marginRight: col.gap }}
            className="flex shrink-0 flex-col justify-center gap-8"
          >
            {col.tiles.map((tile, ti) => (
              <GalleryTile key={ti} tile={tile} index={ci * 10 + ti} />
            ))}
          </div>
        ))}

        <div className="flex w-[min(60vw,300px)] shrink-0 items-center">
          <p className="t-h3 text-[var(--color-terminal-dim)]">
            keep going —<br />
            <span className="text-[var(--color-amber)]">there&apos;s more below</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function GalleryTile({ tile, index }: { tile: Tile; index: number }) {
  if (tile.kind === "quote") {
    return (
      <figure
        data-tile
        style={{ height: tile.h, marginTop: tile.offset ?? 0 }}
        className="flex items-center border-l-2 border-[var(--color-amber)] pl-6"
      >
        <blockquote className="t-h3 text-[var(--color-terminal-bright)]">
          {tile.text}
        </blockquote>
      </figure>
    );
  }

  return (
    <figure data-tile style={{ marginTop: tile.offset ?? 0 }}>
      {/* Caption above the tile, the way the reference does it. */}
      <figcaption className="t-mono-sm mb-3 flex items-baseline justify-between gap-4 text-[var(--color-terminal-dim)]">
        <span className="lowercase">{tile.title}</span>
        <span className="text-[var(--color-amber)]">{tile.year}</span>
      </figcaption>

      <div
        style={{ height: tile.h }}
        className="group relative w-full overflow-hidden rounded-[2px] border border-[var(--color-terminal-rule)]"
      >
        {tile.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={tile.image}
            alt={tile.alt ?? tile.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <Plate index={index} />
        )}
      </div>
    </figure>
  );
}

/**
 * Placeholder plate for tiles with no photograph yet.
 *
 * Deliberately not a grey box: a procedural scanline-and-grid field derived
 * from the tile index, so the composition reads correctly now and each tile
 * still looks distinct. Swap in a real image and this disappears.
 */
function Plate({ index }: { index: number }) {
  const hueShift = (index * 37) % 100;
  return (
    <div
      aria-hidden="true"
      className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      style={{
        background: `
          repeating-linear-gradient(
            ${90 + (index % 3) * 30}deg,
            rgba(232,163,61,0.055) 0px,
            rgba(232,163,61,0.055) 1px,
            transparent 1px,
            transparent ${7 + (index % 4) * 3}px
          ),
          repeating-linear-gradient(
            0deg,
            rgba(147,174,168,0.05) 0px,
            rgba(147,174,168,0.05) 1px,
            transparent 1px,
            transparent ${9 + (index % 5) * 2}px
          ),
          radial-gradient(
            120% 90% at ${20 + hueShift * 0.5}% ${30 + (index % 3) * 20}%,
            rgba(232,163,61,0.13),
            transparent 62%
          ),
          var(--color-terminal-raised)
        `,
      }}
    />
  );
}
