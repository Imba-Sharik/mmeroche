"use client";

import { useRef } from "react";
import { gsap, useGsapLayout } from "@/shared/lib";

/** Какую долю прокрутки фото отстаёт от страницы */
const LAG = 0.35;

/**
 * Параллакс фото первого экрана на мобильном (уже `lg`): пока Hero уходит
 * вверх, снимок сдвигается вниз на долю хода и едет медленнее контента.
 * Растягивать фото не нужно: щель над ним остаётся выше экрана, а низ
 * срезает `overflow` секции. Затемнения лежат снаружи и стоят на месте.
 */
export function HeroParallax({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGsapLayout(() => {
    const root = rootRef.current;
    const section = root?.closest("section");
    if (!root || !section) return;

    const media = gsap.matchMedia();

    media.add("(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.to(root, {
        y: () => section.offsetHeight * LAG,
        ease: "none",
        force3D: true,
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => media.revert();
  }, []);

  return (
    <div ref={rootRef} className="absolute inset-0 will-change-transform">
      {children}
    </div>
  );
}
