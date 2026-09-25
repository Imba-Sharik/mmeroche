"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGsapLayout } from "@/shared/lib";
import { cn } from "@/shared/lib/utils";
import { WineGlow } from "@/shared/ui";
import {
  INTERIOR_CANVAS,
  INTERIOR_GLOW,
  INTERIOR_MOBILE_CANVAS,
  INTERIOR_MOBILE_GLOW,
  INTERIOR_MOBILE_PHOTOS,
  INTERIOR_PHOTOS,
  type InteriorPhoto,
} from "../model/photos";

/**
 * Две раскладки коллажа: десктопная (холст 1920×1830) и мобильная (360×2240).
 * `media` — где раскладка видна: проявление запускаем только там, иначе
 * скрытые кадры вставали бы в общую очередь и задерживали видимые.
 */
const LAYOUTS = {
  desktop: {
    photos: INTERIOR_PHOTOS,
    glow: INTERIOR_GLOW,
    canvas: INTERIOR_CANVAS,
    media: "(min-width: 1024px)",
    sizes: "40vw",
  },
  mobile: {
    photos: INTERIOR_MOBILE_PHOTOS,
    glow: INTERIOR_MOBILE_GLOW,
    canvas: INTERIOR_MOBILE_CANVAS,
    media: "(max-width: 1023.98px)",
    sizes: "100vw",
  },
} as const;

type Layout = keyof typeof LAYOUTS;

/** Тайминг появлений с референса fromanother.love, как в `Reveal` */
const REVEAL = { duration: 1.4, ease: "power3.out" } as const;

/** Разбег между кадрами коллажа, секунды */
const GAP = 0.3;

function CollagePhoto({ photo, sizes }: { photo: InteriorPhoto; sizes: string }) {
  return (
    <div
      className="js-interior-photo absolute"
      style={{
        left: photo.left,
        top: photo.top,
        width: photo.width,
        aspectRatio: photo.ratio,
        rotate: photo.rotate ? `${photo.rotate}deg` : undefined,
        opacity: photo.opacity,
      }}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        aria-hidden={photo.alt === "" || undefined}
        fill
        sizes={sizes}
        className="js-interior-img object-cover"
      />
    </div>
  );
}

/**
 * Коллаж снимков зала — Figma node 222:2081 (холст 1920×1830), мобильный —
 * 336:246 (360×2240), см. `LAYOUTS`.
 *
 * Кадры проявляются по очереди, когда до них доезжает экран: только
 * прозрачность, как у остальных появлений на сайте (`Reveal`), без выезда
 * и масштаба. Коллаж выше экрана, поэтому одной волной на всё нельзя —
 * нижние кадры отыграли бы за кадром. `ScrollTrigger.batch` собирает те,
 * что вошли в экран вместе, и ставит их в общую очередь сверху вниз.
 *
 * Очередь общая на весь коллаж, а не на пачку: кадры одного ряда въезжают
 * с разницей в доли секунды, попадают в разные пачки, и у каждой пачки
 * разбег начинался заново — ряд загорался разом. Теперь следующий кадр
 * стартует не раньше чем через `GAP` после предыдущего, из какой бы пачки
 * он ни был.
 *
 * Прозрачность крутим на снимке, а не на рамке: у части рамок своя,
 * из макета (`opacity` в `photos.ts`), и твин бы её затёр.
 */
export function InteriorGallery({ layout, className }: { layout: Layout; className?: string }) {
  const { photos, glow, canvas, media: visibleOn, sizes } = LAYOUTS[layout];
  const rootRef = useRef<HTMLDivElement>(null);

  useGsapLayout(() => {
    const root = rootRef.current;
    if (!root) return;

    const media = gsap.matchMedia();

    media.add(`${visibleOn} and (prefers-reduced-motion: no-preference)`, () => {
      const frames = gsap.utils.toArray<HTMLElement>(".js-interior-photo", root);
      const imgOf = (frame: Element) => frame.querySelector(".js-interior-img");

      gsap.set(frames.map(imgOf), { autoAlpha: 0 });

      /** Когда по часам GSAP может стартовать следующий кадр */
      let nextStart = 0;

      ScrollTrigger.batch(frames, {
        start: "top bottom-=15%",
        once: true,
        onEnter: (batch) => {
          // В массиве кадры идут по слоям, а проявляться им — сверху вниз
          const ordered = [...batch].sort(
            (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top,
          );
          ordered.forEach((frame) => {
            const now = gsap.ticker.time;
            const delay = Math.max(0, nextStart - now);
            nextStart = now + delay + GAP;
            gsap.to(imgOf(frame), { autoAlpha: 1, delay, ...REVEAL });
          });
        },
      });
    });

    return () => media.revert();
  }, [visibleOn]);

  const under = photos.slice(0, glow.after);
  const over = photos.slice(glow.after);

  return (
    <div ref={rootRef} className={cn("relative w-full", className)} style={{ aspectRatio: canvas }}>
      {under.map((photo) => (
        <CollagePhoto key={photo.src} photo={photo} sizes={sizes} />
      ))}

      {/* Свечение под ворохом записок — Figma nodes 222:2106, 336:264 */}
      <WineGlow x={glow.x} y={glow.y} size={glow.size} />

      {over.map((photo) => (
        <CollagePhoto key={photo.src} photo={photo} sizes={sizes} />
      ))}
    </div>
  );
}
