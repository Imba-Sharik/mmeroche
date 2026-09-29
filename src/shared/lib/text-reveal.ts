"use client";

import { gsap, SplitText } from "./gsap";

/** Тексты, которые проявляются по частям: `data-split="chars"` или `"lines"` */
export const SPLIT_SELECTOR = "[data-split]";

/**
 * Проявление текста как на jeskojets.com: каждая буква (заголовки) или
 * строка (абзацы) выходит из сильного размытия. Тайминги и размытие —
 * их, кривая — `reveal` из `gsap.ts`.
 *
 * Размытие здесь на самих буквах и строках — листьях без 3D-потомков,
 * поэтому `DishTile` и прочий 3D его не заметят (см. грабли с `filter`).
 *
 * Режем с `autoSplit`: строки пересобираются при ресайзе и догрузке шрифта,
 * а твин, возвращённый из `onSplit`, SplitText сам пересоздаёт с тем же
 * прогрессом. Слова `words` держат буквы вместе — перенос не рвёт слово.
 */
export function revealText(el: HTMLElement, vars: gsap.TweenVars = {}) {
  const byChars = el.dataset.split === "chars";

  return SplitText.create(el, {
    type: byChars ? "words,chars" : "lines",
    autoSplit: true,
    onSplit: (self) =>
      gsap.from(byChars ? self.chars : self.lines, {
        autoAlpha: 0,
        filter: "blur(36px)",
        duration: 1,
        stagger: byChars ? 0.05 : 0.1,
        ease: "reveal",
        ...vars,
      }),
  });
}
