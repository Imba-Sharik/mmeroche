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
 */
export function WineGlow({ x, y, size = 376, className }: WineGlowProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 bg-wine opacity-54 blur-[120px]",
        className,
      )}
      style={{
        left: x,
        top: typeof y === "number" ? `${y}px` : y,
        width: size,
        height: size,
      }}
    />
  );
}
