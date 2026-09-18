"use client";

import { useRef } from "react";
import { gsap, useGsapLayout } from "@/shared/lib";

/** Тайминг появления с референса: размытие уходит вместе с проявлением */
const REVEAL = { duration: 1.82, ease: "power3.out" } as const;

/**
 * Проявление первого экрана: элементы с классом `js-hero-reveal` выходят из
 * размытия по очереди — иероглифы, адрес, лого, подпись, кнопка. Обёртка с
 * `display: contents` не создаёт бокс, поэтому раскладка Hero не меняется,
 * а сам виджет остаётся серверным.
 */
export function HeroReveal({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGsapLayout(() => {
    const root = rootRef.current;
    if (!root) return;

    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(gsap.utils.toArray<HTMLElement>(".js-hero-reveal", root), {
        autoAlpha: 0,
        filter: "blur(12px)",
        yPercent: 6,
        stagger: 0.12,
        delay: 0.15,
        ...REVEAL,
      });
    });

    return () => media.revert();
  }, []);

  return (
    <div ref={rootRef} className="contents">
      {children}
    </div>
  );
}
