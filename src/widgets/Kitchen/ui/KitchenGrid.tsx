"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGsapLayout } from "@/shared/lib";
import { Reveal } from "@/shared/ui";
import { DishTile } from "./DishTile";
import { DISHES } from "../model/dishes";

export function KitchenGrid() {
  const trackRef = useRef<HTMLDivElement>(null);

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
       * Секция замирает, как только упёрлась в верх экрана, и держится ровно
       * столько, сколько нужно ленте, чтобы доехать. Пин вешаем на саму секцию:
       * у неё нет предков с `overflow`, иначе `position: fixed` от ScrollTrigger
       * обрезался бы.
       */
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
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
    });

    return () => {
      media.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    // z-10: по задумке лента проезжает поверх текстовой колонки, а не под ней
    <div
      ref={trackRef}
      className="relative z-10 grid gap-8 sm:grid-cols-2 lg:w-607 lg:shrink-0 lg:grid-cols-5"
    >
      <Reveal>
        {DISHES.map((dish) => (
          <DishTile key={dish.id} dish={dish} />
        ))}
      </Reveal>
    </div>
  );
}
