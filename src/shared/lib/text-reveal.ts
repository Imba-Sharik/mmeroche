"use client";

import { gsap, SplitText } from "./gsap";
import { typograf } from "./typograf";

/** Тексты, которые проявляются по частям: `data-split="chars"` или `"lines"` */
export const SPLIT_SELECTOR = "[data-split]";

/**
 * Общие настройки SplitText: не терять неразрывные пробелы (`typograf`).
 *
 * По умолчанию (`reduceWhiteSpace`) SplitText схлопывает пробелы регэкспом
 * `/\s+/`, а под `\s` попадает и неразрывный — предлоги снова повисали на
 * концах строк. Поэтому схлопывание выключаем и делаем сами, только для
 * обычных пробелов и переводов строк из разметки.
 *
 * Здесь же `typograf`: тексты в разметке (`Legend`, `Kitchen`…) набраны
 * обычными пробелами, и без него предлоги висели на концах строк — склеиваем
 * их перед нарезкой, так что любой `data-split` получает это сам.
 */
export const SPLIT_KEEP_NBSP = {
  reduceWhiteSpace: false,
  prepareText: (text: string) => typograf(text.replace(/[ \t\r\n]+/g, " ")),
};

/**
 * Прогоняет текстовые узлы внутри `el` через `typograf` — для размеченного
 * текста, который не режем: без анимаций (`reduced-motion`) SplitText не
 * запускается, и его `prepareText` предлоги не склеил бы.
 */
export function typografText(el: HTMLElement) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.nodeValue ?? "";
    const fixed = typograf(text);
    if (fixed !== text) node.nodeValue = fixed;
  }
}

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
