"use client";

import { useRef } from "react";
import {
  finishIfPassing,
  gsap,
  revealText,
  SPLIT_SELECTOR,
  useGsapLayout,
  type SplitText,
  typografText,
} from "@/shared/lib";

/** Тайминг с референса fromanother.love */
const REVEAL = { duration: 1.4, ease: "power3.out" } as const;

/**
 * Задержка для вырезок-декора (маски, голова Будды): они проявляются после
 * фото или карты, на которых лежат, а не вместе с ними — так просил дизайнер
 * (комментарий в макете у маски «Чего ожидать»). Одна на все, чтобы вырезки
 * появлялись одинаково: `<Reveal delay={CUTOUT_DELAY}>`.
 */
export const CUTOUT_DELAY = 0.6;

interface RevealProps {
  children: React.ReactNode;
  /** Разбег между соседями, секунды */
  stagger?: number;
  /** Задержка старта, секунды — когда блок должен появиться после соседей */
  delay?: number;
}

/**
 * Что проявлять по отдельности. Блок без размеченного текста — целиком.
 * Блок, внутри которого есть `data-split`, разбираем глубже: сам он стоит,
 * текст проявляется по буквам или строкам, а соседи текста (кнопки, фото)
 * проявляются прозрачностью. Иначе прозрачность блока легла бы поверх
 * проявления букв и съела его. Вложенный `Reveal` пропускаем — он проявляет
 * своё сам.
 */
function collect(elements: Element[]): HTMLElement[] {
  return elements.flatMap((el) => {
    if (el.hasAttribute("data-reveal")) return [];
    if (el.matches(SPLIT_SELECTOR) || !el.querySelector(SPLIT_SELECTOR)) {
      return [el as HTMLElement];
    }
    return collect(Array.from(el.children));
  });
}

/**
 * Проявление блоков на входе в экран: прямые дети по очереди наливаются
 * прозрачностью. Ни подъёма, ни размытия блоков — по просьбе клиента блок
 * именно проявляется, а не выезжает. Размечённые тексты (`data-split`)
 * проявляются из размытия по буквам или строкам — как на jeskojets.com,
 * см. `revealText`.
 *
 * Обёртка с `display: contents` не создаёт бокс — раскладка родителя (сетка,
 * флекс) не меняется, поэтому вешать можно прямо внутри грида.
 */
export function Reveal({ children, stagger = 0.05, delay = 0 }: RevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGsapLayout(() => {
    const root = rootRef.current;
    if (!root) return;

    const targets = gsap.utils.toArray<HTMLElement>(root.children);
    const trigger = targets[0];
    if (!trigger) return;

    // Висячие предлоги склеиваем и там, где текст не режется (без анимаций)
    root.querySelectorAll<HTMLElement>(SPLIT_SELECTOR).forEach(typografText);

    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const splits: SplitText[] = [];

      collect(targets).forEach((el, i) => {
        const vars = {
          delay: delay + i * stagger,
          // Проехали мимо по клику в меню — сразу проявлено (`finishIfPassing`)
          scrollTrigger: {
            trigger,
            start: "top bottom-=33.33%",
            once: true,
            onEnter: finishIfPassing,
          },
        };

        if (el.matches(SPLIT_SELECTOR)) splits.push(revealText(el, vars));
        else gsap.from(el, { autoAlpha: 0, ...REVEAL, ...vars });
      });

      return () => splits.forEach((split) => split.revert());
    });

    return () => media.revert();
  }, []);

  return (
    <div ref={rootRef} data-reveal className="contents">
      {children}
    </div>
  );
}
