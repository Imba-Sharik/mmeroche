"use client";

import { useRef } from "react";
import { gsap, useGsapLayout } from "@/shared/lib";
import { cn } from "@/shared/lib/utils";

interface CountUpProps {
  /** Конечное значение как в макете, с ведущими нулями: «03», «1100» */
  value: string;
  /**
   * Задержка старта, секунды — чтобы соседние карточки шли вразбег. Только
   * от `sm`, где карточки в ряд: на мобильном они столбиком, и каждая
   * стартует сама, когда доехала до экрана.
   */
  delay?: number;
  className?: string;
}

/**
 * Число набирается от нуля до `value`, когда карточка доехала до экрана.
 *
 * В разметке сразу конечное значение — его видят без JS и поисковики, а ноль
 * ставим в layout-эффекте, до первой отрисовки, так что мигания нет.
 *
 * Цифры у дисплейного шрифта разной ширины, и число «дышало» бы по ходу
 * набора. Поэтому ширину держит невидимая копия конечного значения, а
 * бегущее число лежит поверх неё.
 */
export function CountUp({ value, delay = 0, className }: CountUpProps) {
  const counterRef = useRef<HTMLSpanElement>(null);

  useGsapLayout(() => {
    const counter = counterRef.current;
    if (!counter) return;

    const target = Number(value);
    const format = (n: number) => String(Math.round(n)).padStart(value.length, "0");
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const state = { n: 0 };
      counter.textContent = format(0);

      gsap.to(state, {
        n: target,
        duration: 2,
        delay: window.matchMedia("(min-width: 640px)").matches ? delay : 0,
        ease: "power3.out",
        onUpdate: () => {
          counter.textContent = format(state.n);
        },
        // Как обычно у счётчиков: стартует, как только число показалось на экране
        scrollTrigger: { trigger: counter, start: "top 85%", once: true },
      });

      return () => {
        counter.textContent = value;
      };
    });

    return () => media.revert();
  }, [value, delay]);

  return (
    <span className={cn("relative inline-block", className)}>
      <span aria-hidden className="invisible">
        {value}
      </span>
      <span ref={counterRef} className="absolute inset-0 whitespace-nowrap">
        {value}
      </span>
    </span>
  );
}
