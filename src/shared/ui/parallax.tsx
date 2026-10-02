"use client";

import { useRef } from "react";
import { gsap, useGsapLayout } from "@/shared/lib";

interface ParallaxProps {
  children: React.ReactNode;
  /** Запас сверху и снизу в долях рамки — на столько же фото и сдвигается */
  amount?: number;
}

/**
 * Параллакс фото внутри рамки: снимок выше рамки на `amount` с каждой
 * стороны и, пока рамка проходит экран, едет от верхнего запаса к нижнему —
 * медленнее страницы. Рамка (родитель) должна быть `relative` с `overflow`,
 * затемнения и градиенты кладём в неё рядом, а не сюда — они стоят.
 */
export function Parallax({ children, amount = 0.1 }: ParallaxProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGsapLayout(() => {
    const root = rootRef.current;
    const frame = root?.parentElement;
    if (!root || !frame) return;

    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        root,
        { y: () => -frame.offsetHeight * amount },
        {
          y: () => frame.offsetHeight * amount,
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: frame,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    });

    return () => media.revert();
  }, [amount]);

  return (
    <div
      ref={rootRef}
      className="absolute inset-x-0 will-change-transform"
      style={{ top: `${-amount * 100}%`, bottom: `${-amount * 100}%` }}
    >
      {children}
    </div>
  );
}
