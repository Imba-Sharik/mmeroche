"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGsapLayout } from "@/shared/lib";

/**
 * Кадры блюд — Figma node 114:2448, карточка 576×420.
 * Название проявляется по наведению (в макете на это намекал курсор 114:2453).
 * TODO: «карбонара» — из макета, остальные подписи временные, ждём меню кухни.
 */
const CARDS = [
  {
    src: "/images/kitchen/food-dessert.webp",
    alt: "Десерт с икрой в каменной ступке",
    title: "икра с хрустящим листом",
  },
  {
    src: "/images/kitchen/food-peas.webp",
    alt: "Карбонара на красной скатерти",
    title: "карбонара",
  },
  {
    src: "/images/kitchen/food-tin.webp",
    alt: "Креветки с зелёным горошком",
    title: "креветки с горошком",
  },
  {
    src: "/images/kitchen/food-dessert.webp",
    alt: "Подача на тёмном столе",
    title: "подача дня",
  },
];

/** Насколько кадр опускается, отойдя от центра на пол-экрана, в долях высоты окна */
const ARC_DEPTH = 0.16;
/** Доворот по касательной на том же отрезке, градусы */
const ARC_TILT = 9;
/** Отдаление краёв — от него ход читается как овал, а не как прямая */
const ARC_SCALE = 0.08;
/** Насколько близко к центру должен подойти кадр, чтобы показать название */
const ACTIVE_ZONE = 0.3;

export function KitchenGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGsapLayout(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const media = gsap.matchMedia();

    media.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const cards = gsap.utils.toArray<HTMLElement>(".js-kitchen-card", track);
      const arcs = cards
        .map((card) => card.querySelector<HTMLElement>(".js-kitchen-arc"))
        .filter((arc): arc is HTMLElement => arc !== null);

      const setters = arcs.map((arc) => ({
        y: gsap.quickSetter(arc, "y", "px"),
        rotate: gsap.quickSetter(arc, "rotation", "deg"),
        scale: gsap.quickSetter(arc, "scale"),
      }));

      // Центры карточек внутри трека — меряем на refresh, дальше только считаем
      let centers: number[] = [];
      const measure = () => {
        centers = cards.map((card) => card.offsetLeft + card.offsetWidth / 2);
      };

      /**
       * Одна дуга на всю ленту: отход от центра экрана считаем в половинах окна
       * и по нему опускаем кадр, доворачиваем по касательной и отдаляем.
       * Отход ограничен единицей, иначе крайние кадры проваливаются вниз.
       */
      const applyArc = () => {
        const x = Number(gsap.getProperty(track, "x")) || 0;
        const viewport = window.innerWidth;

        centers.forEach((center, index) => {
          const setter = setters[index];
          if (!setter) return;

          const offset = gsap.utils.clamp(-1, 1, (center + x - viewport / 2) / (viewport / 2));

          setter.y(ARC_DEPTH * window.innerHeight * offset * offset);
          setter.rotate(ARC_TILT * offset);
          setter.scale(1 - ARC_SCALE * offset * offset);

          // Название показываем у кадра, который сейчас проходит через центр
          cards[index].dataset.active = String(Math.abs(offset) < ACTIVE_ZONE);
        });
      };

      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      measure();
      applyArc();

      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        onUpdate: applyArc,
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          onRefresh: () => {
            measure();
            applyArc();
          },
        },
      });
    });

    // Карточки въезжают снизу, когда секция вошла на треть экрана
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(gsap.utils.toArray<HTMLElement>(".js-kitchen-card"), {
        yPercent: 12,
        autoAlpha: 0,
        duration: 1.4,
        ease: "power3.out",
        stagger: 0.05,
        scrollTrigger: {
          trigger: section,
          start: "top bottom-=33.33%",
        },
      });
    });

    return () => {
      media.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <div ref={sectionRef} className="relative h-svh w-full overflow-hidden">
      <div
        ref={trackRef}
        className="absolute top-1/2 flex -translate-y-1/2 items-center gap-10 pr-[10vw] pl-5 lg:gap-[8vw] lg:pr-[35vw] lg:pl-[35vw]"
      >
        {CARDS.map((card, index) => (
          <div
            key={`${card.src}-${index}`}
            className="js-kitchen-card group w-[62vw] shrink-0 lg:w-[30vw]"
          >
            {/* Дугу крутит внутренний слой: у внешнего остаётся раскладка ленты */}
            <div className="js-kitchen-arc">
              <div className="relative aspect-576/420 overflow-hidden rounded-[8px]">
                <Image
                  src={card.src}
                  alt={card.alt}
                  fill
                  sizes="(max-width: 1024px) 62vw, 30vw"
                  className="object-cover"
                />
                <div aria-hidden className="absolute inset-0 bg-black/20" />
                {/* Затемнение к низу из макета — проявляется вместе с названием */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-linear-to-b from-black/0 to-black/80 transition-opacity duration-500 group-data-[active=false]:opacity-0"
                />

                <div className="absolute inset-x-0 bottom-[7.2%] overflow-hidden px-4 text-center">
                  <span className="block font-sans text-[clamp(18px,1.7vw,32px)] leading-[1.1] text-cream uppercase transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-data-[active=false]:translate-y-full">
                    {card.title}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
