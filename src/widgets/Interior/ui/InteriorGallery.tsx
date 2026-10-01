"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, ScrollTrigger, skipsAnimation, useGsapLayout } from "@/shared/lib";
import { cn } from "@/shared/lib/utils";
import { CUTOUT_DELAY, stick, Sticker, WineGlow } from "@/shared/ui";
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
 * Две раскладки коллажа: десктопная (холст 1920×1830) и мобильная (360×2130).
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

/**
 * Раскрытие кадра из угла — как в «Selected Cases» на hobro.digital.
 * `inset()` задаёт, сколько срезать с каждой стороны: кадр, схлопнутый
 * в правый верхний угол, срезан целиком снизу и слева.
 */
const CORNERS = {
  "top right": "inset(0% 0% 100% 100%)",
  "top left": "inset(0% 100% 100% 0%)",
  "bottom left": "inset(100% 100% 0% 0%)",
  "bottom right": "inset(100% 0% 0% 100%)",
} as const;

const OPEN = "inset(0% 0% 0% 0%)";

/** Откуда кадр раскрывается — по кругу, от кадра к кадру */
const ENTER_FROM = ["top right", "top left", "bottom left", "bottom right"] as const;

/** Куда схлопывается, уехав вверх за экран, — в противоположный угол */
const LEAVE_TO = ["bottom left", "bottom right", "top right", "top left"] as const;

const CLIP = { duration: 1, ease: "power1.out", overwrite: "auto" } as const;

/**
 * Когда клеить стикер — доля раскрытия кадра под ним. Ждать конца шторки
 * поздно: на телефоне стикер падал, когда кадр уже уезжал за экран.
 */
const STICK_AT = 0.4;

/** Проявление вырезок — тайминг `Reveal`, как у масок в других секциях */
const FADE = { duration: 1.4, ease: "power3.out", overwrite: "auto" } as const;

/** «122.331/153.762» → 0.795 */
const parseRatio = (ratio: string) => {
  const [w, h = 1] = ratio.split("/").map(Number);
  return w / h;
};

function CollagePhoto({ photo, sizes }: { photo: InteriorPhoto; sizes: string }) {
  return (
    <div
      className="js-interior-photo absolute"
      data-sticker={photo.sticker || undefined}
      data-cutout={photo.cutout || undefined}
      style={{
        left: photo.left,
        top: photo.top,
        width: photo.width,
        aspectRatio: photo.ratio,
        rotate: photo.rotate ? `${photo.rotate}deg` : undefined,
        opacity: photo.opacity,
      }}
    >
      {photo.sticker ? (
        <Sticker src={photo.src} ratio={parseRatio(photo.ratio)} auto={false} />
      ) : (
        <Image
          src={photo.src}
          alt={photo.alt}
          aria-hidden={photo.alt === "" || undefined}
          fill
          sizes={sizes}
          className="js-interior-img object-cover"
        />
      )}
    </div>
  );
}

/** Площадь пересечения рамок — по ней ищем кадр, на котором лежит стикер */
function overlap(a: Element, b: Element) {
  const r1 = a.getBoundingClientRect();
  const r2 = b.getBoundingClientRect();
  const w = Math.min(r1.right, r2.right) - Math.max(r1.left, r2.left);
  const h = Math.min(r1.bottom, r2.bottom) - Math.max(r1.top, r2.top);
  return w > 0 && h > 0 ? w * h : 0;
}

/**
 * Коллаж снимков зала — Figma node 222:2081 (холст 1920×1830), мобильный —
 * 336:246 (360×2130), см. `LAYOUTS`.
 *
 * Кадры раскрываются из угла, когда до них доезжает экран, и схлопываются
 * в противоположный, когда уезжают вверх, — как на hobro.digital (там
 * «Selected Cases»). Анимация обратима: вернулся к кадру — он раскроется
 * снова, отмотал выше — схлопнется туда, откуда вышел. Углы идут по кругу
 * сверху вниз по коллажу, а не по слоям — соседи раскрываются навстречу
 * друг другу.
 *
 * `clip-path` крутим на снимке, а не на рамке: у рамки бывает свой поворот
 * и прозрачность из макета (`photos.ts`). Рваный край кадра запечён
 * в картинку, так что `inset` его не срезает — режет только пустое поле.
 *
 * Вырезки поверх кадров (`sticker`) шторкой не раскрываются: они клеятся
 * стикером, когда кадр под ними раскрылся на `STICK_AT`, и прячутся, как только
 * он начал схлопываться, — вернёшься, приклеятся заново. «Под ними» — кадр
 * с наибольшим пересечением рамок. Стикер ни на чём не лежит — клеится
 * сам, через время раскрытия после входа в экран.
 *
 * Вырезки-декор (`cutout` — череп, полосатая маска) тоже держатся за кадр под
 * собой, но проявляются прозрачностью, как маски в других секциях: через
 * `CUTOUT_DELAY` после того, как кадр начал раскрываться, и гаснут вместе
 * с его схлопыванием.
 */
export function InteriorGallery({ layout, className }: { layout: Layout; className?: string }) {
  const { photos, glow, canvas, media: visibleOn, sizes } = LAYOUTS[layout];
  const rootRef = useRef<HTMLDivElement>(null);

  useGsapLayout(() => {
    const root = rootRef.current;
    if (!root) return;

    const media = gsap.matchMedia();

    media.add(`${visibleOn} and (prefers-reduced-motion: no-preference)`, () => {
      const all = gsap.utils
        .toArray<HTMLElement>(".js-interior-photo", root)
        // В массиве кадры идут по слоям, а углы чередуем сверху вниз
        .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
      const isOverlay = (frame: HTMLElement) =>
        frame.hasAttribute("data-sticker") || frame.hasAttribute("data-cutout");
      const frames = all.filter((frame) => !isOverlay(frame));
      const stickers = all.filter((frame) => frame.hasAttribute("data-sticker"));
      const cutouts = all.filter((frame) => frame.hasAttribute("data-cutout"));

      /** Кадр, на котором лежит вырезка, — с наибольшим пересечением рамок */
      const hostOf = (frame: HTMLElement) => {
        let host: HTMLElement | undefined;
        let best = 0;
        frames.forEach((candidate) => {
          const area = overlap(frame, candidate);
          if (area > best) [host, best] = [candidate, area];
        });
        return host;
      };

      /** Кто ждёт раскрытия кадра: кадр → стикеры и вырезки на нём */
      const riders = new Map<Element, HTMLElement[]>();
      const fades = new Map<Element, Element[]>();
      /** `instant` — едем мимо по клику в меню: сразу в конечное состояние */
      const fade = (img: Element, on: boolean, instant = false) => {
        if (instant) gsap.set(img, { autoAlpha: on ? 1 : 0, overwrite: "auto" });
        else if (on) gsap.to(img, { autoAlpha: 1, ...FADE, delay: CUTOUT_DELAY });
        else gsap.to(img, { autoAlpha: 0, ...CLIP });
      };

      cutouts.forEach((frame) => {
        const img = frame.querySelector(".js-interior-img");
        if (!img) return;
        gsap.set(img, { autoAlpha: 0 });

        const host = hostOf(frame);
        if (host) {
          fades.set(host, [...(fades.get(host) ?? []), img]);
          return;
        }

        ScrollTrigger.create({
          trigger: frame,
          start: "clamp(top+=20% bottom)",
          onEnter: () => fade(img, true, skipsAnimation(frame)),
          onLeaveBack: () => fade(img, false, skipsAnimation(frame)),
        });
      });

      stickers.forEach((frame) => {
        const sticker = frame.querySelector<HTMLElement>(".sticker");
        if (!sticker) return;

        const host = hostOf(frame);
        if (host) {
          riders.set(host, [...(riders.get(host) ?? []), sticker]);
          return;
        }

        let pending: gsap.core.Tween | undefined;
        ScrollTrigger.create({
          trigger: frame,
          start: "clamp(top+=20% bottom)",
          onEnter: () => {
            if (skipsAnimation(frame)) stick(sticker, true, true);
            else pending = gsap.delayedCall(CLIP.duration * STICK_AT, () => stick(sticker, true));
          },
          onLeaveBack: () => {
            pending?.kill();
            stick(sticker, false);
          },
        });
      });

      frames.forEach((frame, i) => {
        const img = frame.querySelector(".js-interior-img");
        const from = CORNERS[ENTER_FROM[i % ENTER_FROM.length]];
        const to = CORNERS[LEAVE_TO[i % LEAVE_TO.length]];
        const onTop = riders.get(frame) ?? [];
        const cutoutsOnTop = fades.get(frame) ?? [];

        let pending: gsap.core.Tween | undefined;
        const open = () => {
          const instant = skipsAnimation(frame);
          pending?.kill();
          cutoutsOnTop.forEach((cutout) => fade(cutout, true, instant));
          if (instant) {
            gsap.set(img, { clipPath: OPEN, overwrite: "auto" });
            onTop.forEach((sticker) => stick(sticker, true, true));
            return;
          }
          gsap.to(img, { clipPath: OPEN, ...CLIP });
          pending = gsap.delayedCall(CLIP.duration * STICK_AT, () =>
            onTop.forEach((sticker) => stick(sticker, true)),
          );
        };
        const close = (clipPath: string) => {
          const instant = skipsAnimation(frame);
          pending?.kill();
          onTop.forEach((sticker) => stick(sticker, false));
          cutoutsOnTop.forEach((cutout) => fade(cutout, false, instant));
          if (instant) gsap.set(img, { clipPath, overwrite: "auto" });
          else gsap.to(img, { clipPath, ...CLIP });
        };

        gsap.set(img, { clipPath: from });

        ScrollTrigger.create({
          trigger: frame,
          start: "clamp(top+=20% bottom)",
          end: "clamp(bottom+=100% top)",
          onEnter: open,
          onEnterBack: open,
          onLeave: () => close(to),
          onLeaveBack: () => close(from),
        });
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
