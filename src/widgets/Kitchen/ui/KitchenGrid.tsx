"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, useGsapLayout } from "@/shared/lib";
import { Reveal } from "@/shared/ui";
import { DishTile } from "./DishTile";
import { useCardMotion } from "../model/card-motion";
import { DISHES } from "../model/dishes";
import { lockSwipeAxis } from "../model/swipe-axis-lock";

/** Доля ширины текстовой колонки, за которую она гаснет под лентой */
const FADE_SPAN = 0.8;

export function KitchenGrid() {
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const motion = useCardMotion();

  // Мобильная лента: один жест — одна ось, см. `lockSwipeAxis`
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const mobile = window.matchMedia("(max-width: 1023.98px)");
    let release: (() => void) | undefined;
    const sync = () => {
      release?.();
      release = mobile.matches ? lockSwipeAxis(scroller) : undefined;
    };

    sync();
    mobile.addEventListener("change", sync);
    return () => {
      mobile.removeEventListener("change", sync);
      release?.();
    };
  }, []);

  useGsapLayout(() => {
    const track = trackRef.current;
    const section = track?.closest("section");
    if (!track || !section) return;

    const media = gsap.matchMedia();

    media.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      /*
       * Колонку ищем по классу, а не через `previousElementSibling`: рядом
       * стоит обёртка `Reveal` с `display: contents`. Бокса у неё нет, и
       * `getBoundingClientRect()` отдаёт нули — лента уезжала в край экрана.
       */
      const textCol = section.querySelector(".js-kitchen-title");
      const fadeLayer = section.querySelector(".js-kitchen-fade");

      /**
       * Ход ленты — больший из двух: доехать левым краем до начала текста и
       * показать все клетки. На шести клетках побеждает первое, на десяти —
       * второе, иначе последние четыре так и не появятся.
       *
       * Собственное смещение вычитаем: `getBoundingClientRect` считает уже с ним.
       */
      const distance = () => {
        if (!textCol) return 0;

        const x = Number(gsap.getProperty(track, "x")) || 0;
        const rect = track.getBoundingClientRect();
        const textLeft = textCol.getBoundingClientRect().left;

        const toText = rect.left - x - textLeft;
        const toEnd = rect.right - x - (window.innerWidth - textLeft);

        return Math.max(0, toText, toEnd);
      };

      /**
       * Колонка растворяется, как только лента наехала на её правый край, и
       * пропадает целиком, когда лента перекрыла её на `FADE_SPAN` ширины.
       * На весь ход растягивать нельзя — на десяти клетках он длинный, и текст
       * висел под фото почти до конца. Считаем по живым рамкам на каждом
       * кадре — так растворение переживает ресайз и откат скролла.
       */
      const fadeText = () => {
        if (!textCol || !fadeLayer) return;

        const x = Number(gsap.getProperty(track, "x")) || 0;
        const text = textCol.getBoundingClientRect();
        // Зазор между лентой и колонкой до начала хода
        const gap = track.getBoundingClientRect().left - x - text.right;
        const span = Math.min(text.width * FADE_SPAN, distance() - gap);
        const progress = span > 0 ? gsap.utils.clamp(0, 1, (-x - gap) / span) : 0;

        gsap.set(fadeLayer, { autoAlpha: 1 - progress });
      };

      /**
       * Секция замирает, как только упёрлась в верх экрана, и держится ровно
       * столько, сколько нужно ленте, чтобы доехать. Пин вешаем на саму секцию:
       * у неё нет предков с `overflow`, иначе `position: fixed` от ScrollTrigger
       * обрезался бы.
       */
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        onUpdate: fadeText,
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        if (fadeLayer) gsap.set(fadeLayer, { clearProps: "opacity,visibility" });
      };
    });

    return () => {
      media.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    /*
      Мобильный — Figma node 336:189: два ряда клеток 328×400 уходят за правый
      край, листаются свайпом с доводкой к клетке. Колонка — 80% ширины
      экрана, чтобы следующая выглядывала справа (на планшете не больше 400px). Пин с прокруткой — только
      на десктопе. Там эта обёртка — `contents`, и лента снова flex-ребёнок
      строки рядом с колонкой текста.
    */
    <div
      ref={scrollerRef}
      className="-mx-4 snap-x snap-mandatory scroll-px-4 overflow-x-auto overscroll-x-contain px-4 sm:-mx-5 sm:scroll-px-5 sm:px-5 [scrollbar-width:none] lg:contents"
    >
      {/* z-10: по задумке лента проезжает поверх текстовой колонки, а не под ней */}
      <div
        ref={trackRef}
        className="relative z-10 grid w-max auto-cols-[min(80vw,400px)] grid-flow-col grid-rows-2 gap-3 lg:w-607 lg:shrink-0 lg:auto-cols-auto lg:grid-flow-row lg:grid-cols-5 lg:grid-rows-none lg:gap-8"
      >
        <Reveal>
          {DISHES.map((dish) => (
            <DishTile key={dish.id} dish={dish} motion={motion} />
          ))}
        </Reveal>
      </div>
    </div>
  );
}
