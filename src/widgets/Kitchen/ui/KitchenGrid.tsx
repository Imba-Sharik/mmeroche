"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGsapLayout } from "@/shared/lib";
import { Reveal } from "@/shared/ui";
import { DishCard } from "./DishCard";

/**
 * Кадры блюд — Figma node 222:2039. Карточка блюда стоит второй в первом ряду,
 * остальные пять клеток — снимки.
 * TODO: подписи и фото ждут меню кухни, из макета взяты как есть.
 */
const PHOTOS = [
  { src: "/images/kitchen/grid-1.webp", alt: "Пицца с фисташковым песто", order: "lg:order-1" },
  { src: "/images/kitchen/grid-3.webp", alt: "Подача на тёмном столе", order: "lg:order-3" },
  { src: "/images/kitchen/grid-4.webp", alt: "Брускетта с томатами и пармезаном", order: "lg:order-4" },
  { src: "/images/kitchen/grid-5.webp", alt: "Крокеты с хамоном на камне", order: "lg:order-5" },
  { src: "/images/kitchen/grid-6.webp", alt: "Закуска в каменной ступке", order: "lg:order-6" },
];

/** Правая кромка, к которой лента приезжает в конце хода — поле контейнера */
const EDGE = 228;

export function KitchenGrid() {
  const trackRef = useRef<HTMLDivElement>(null);

  useGsapLayout(() => {
    const track = trackRef.current;
    const section = track?.closest("section");
    if (!track || !section) return;

    const media = gsap.matchMedia();

    media.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      /**
       * Лента шире экрана: за проход секции она уезжает ровно настолько, чтобы
       * правый край встал по полю контейнера. Собственное смещение вычитаем —
       * `getBoundingClientRect` считает уже с ним.
       */
      const distance = () => {
        const x = Number(gsap.getProperty(track, "x")) || 0;
        return Math.max(0, track.getBoundingClientRect().right - x - window.innerWidth + EDGE);
      };

      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => media.revert();
  }, []);

  return (
    <div
      ref={trackRef}
      className="grid gap-8 sm:grid-cols-2 lg:ml-[117px] lg:w-[1444px] lg:shrink-0 lg:grid-cols-3"
    >
      <Reveal>
        <DishCard className="lg:order-2" />

        {PHOTOS.map((photo) => (
          <div
            key={photo.src}
            className={`relative aspect-460/320 overflow-hidden rounded-xl ${photo.order}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 460px"
              className="object-cover"
            />
          </div>
        ))}
      </Reveal>
    </div>
  );
}
