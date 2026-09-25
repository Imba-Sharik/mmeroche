"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGsapLayout } from "@/shared/lib";
import { WineGlow } from "@/shared/ui";
import {
  INTERIOR_CANVAS,
  INTERIOR_GLOW,
  INTERIOR_PHOTOS,
  type InteriorPhoto,
} from "../model/photos";

/** Тайминг появлений с референса fromanother.love, как в `Reveal` */
const REVEAL = { duration: 1.4, ease: "power3.out" } as const;

/** Разбег между кадрами коллажа, секунды */
const GAP = 0.3;

function CollagePhoto({ photo }: { photo: InteriorPhoto }) {
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
        sizes="(max-width: 1024px) 50vw, 40vw"
        className="js-interior-img object-cover"
      />
    </div>
  );
}

/**
 * Коллаж снимков зала — Figma node 222:2081, холст 1920×1830.
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
export function InteriorGallery() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGsapLayout(() => {
    const root = rootRef.current;
    if (!root) return;

    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
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
  }, []);

  const under = INTERIOR_PHOTOS.slice(0, INTERIOR_GLOW.after);
  const over = INTERIOR_PHOTOS.slice(INTERIOR_GLOW.after);

  return (
    <div ref={rootRef} className="relative w-full" style={{ aspectRatio: INTERIOR_CANVAS }}>
      {under.map((photo) => (
        <CollagePhoto key={photo.src} photo={photo} />
      ))}

      {/* Свечение под ворохом записок — Figma node 222:2106 */}
      <WineGlow x={INTERIOR_GLOW.x} y={INTERIOR_GLOW.y} size={INTERIOR_GLOW.size} />

      {over.map((photo) => (
        <CollagePhoto key={photo.src} photo={photo} />
      ))}
    </div>
  );
}
