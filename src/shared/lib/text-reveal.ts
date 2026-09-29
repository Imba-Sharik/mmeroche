"use client";

import { gsap, SplitText } from "./gsap";

/** Тексты, которые проявляются по частям: `data-split="chars"` или `"lines"` */
export const SPLIT_SELECTOR = "[data-split]";

/**
 * Общие настройки SplitText: не терять неразрывные пробелы (`typograf`).
 *
 * По умолчанию (`reduceWhiteSpace`) SplitText схлопывает пробелы регэкспом
 * `/\s+/`, а под `\s` попадает и неразрывный — предлоги снова повисали на
 * концах строк. Поэтому схлопывание выключаем и делаем сами, только для
 * обычных пробелов и переводов строк из разметки.
 */
export const SPLIT_KEEP_NBSP = {
  reduceWhiteSpace: false,
  prepareText: (text: string) => text.replace(/[ \t\r\n]+/g, " "),
};

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
    ...SPLIT_KEEP_NBSP,
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
