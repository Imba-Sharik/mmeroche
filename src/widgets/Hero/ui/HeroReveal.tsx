"use client";

import { useRef } from "react";
import { gsap, revealText, SPLIT_SELECTOR, useGsapLayout, type SplitText } from "@/shared/lib";

/** Тайминг появления с референса: размытие уходит вместе с проявлением */
const REVEAL = { duration: 1.82, ease: "power3.out" } as const;

/**
 * Проявление первого экрана: элементы с классом `js-hero-reveal` выходят из
 * размытия по очереди — лого, слоган, адрес, кнопки. Без подъёма: по просьбе
 * клиента блоки проявляются, а не выезжают. Обёртка с
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
      const splits: SplitText[] = [];

      gsap.utils.toArray<HTMLElement>(".js-hero-reveal", root).forEach((el, i) => {
        const delay = 0.15 + i * 0.12;

        // Слоган — по буквам, как тексты ниже по странице (`revealText`)
        if (el.matches(SPLIT_SELECTOR)) splits.push(revealText(el, { delay }));
        else gsap.from(el, { autoAlpha: 0, filter: "blur(12px)", delay, ...REVEAL });
      });

      return () => splits.forEach((split) => split.revert());
    });

    return () => media.revert();
  }, []);

  return (
    <div ref={rootRef} className="contents">
      {children}
    </div>
  );
}
