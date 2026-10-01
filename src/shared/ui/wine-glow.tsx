"use client";

import { useRef } from "react";
import { finishIfPassing, gsap, useGsapLayout } from "@/shared/lib";
import { cn } from "@/shared/lib/utils";

interface WineGlowProps {
  /** Центр пятна по горизонтали — доля ширины макета, а не пиксели */
  x: string;
  /** Центр пятна по вертикали: пиксели от верха секции или доля её высоты */
  y: number | string;
  /** Сторона квадрата в пикселях макета */
  size?: number;
  className?: string;
}

/**
 * Бордовое свечение из макета: квадрат `#761313` с непрозрачностью 54%
 * и layer blur (в Figma это `Rectangle 34/35/36`).
 *
 * Положение задаём центром и в долях ширины: макет мерян при 1920, а секции
 * у нас центрируют контент — от пикселей слева пятно уезжает мимо заголовка
 * на любой другой ширине.
 *
 * Размытие 120px подобрано по рендеру макета: в центре пятна красный канал
 * даёт ~50 из 64 возможных, на 360px от центра — ~7.
 *
 * Пятно «загорается», когда до него доезжает экран: плавно наливается
 * и расползается до полного размера. Без мерцания и без «дыхания» потом —
 * пробовали, клиент попросил просто загорание.
 *
 * Анимируем внутренний слой: у внешнего центрирующий `translate`, а GSAP,
 * взяв элемент, забирает CSS-сдвиг в свой `transform`.
 */
export function WineGlow({ x, y, size = 376, className }: WineGlowProps) {
  const lightRef = useRef<HTMLDivElement>(null);

  useGsapLayout(() => {
    const light = lightRef.current;
    if (!light) return;

    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(light, {
        opacity: 0,
        scale: 0.7,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: light,
          start: "top bottom-=20%",
          once: true,
          onEnter: finishIfPassing,
        },
      });
    });

    return () => media.revert();
  }, []);

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute -translate-x-1/2 -translate-y-1/2", className)}
      style={{
        left: x,
        top: typeof y === "number" ? `${y}px` : y,
        width: size,
        height: size,
      }}
    >
      <div
        ref={lightRef}
        className="size-full bg-wine opacity-54 blur-[120px] will-change-[opacity,transform]"
      />
    </div>
  );
}
