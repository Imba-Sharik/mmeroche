import { cn } from "@/shared/lib/utils";

export interface BlurStep {
  /** Радиус размытия слоя, px */
  blur: number;
  /** Докуда слой дотягивается от сильного края, доля блока */
  fade: string;
}

/**
 * Шаги из шапки: в Figma у неё «Background blur (progressive)», 20 → 0.
 * Радиусы складываются по квадратам, у сильного края выходит около 8px.
 */
export const HEADER_BLUR_STEPS: BlurStep[] = [
  { blur: 3, fade: "100%" },
  { blur: 3, fade: "70%" },
  { blur: 4, fade: "45%" },
  { blur: 6, fade: "22%" },
];

interface ProgressiveBlurProps {
  /** Край, у которого размытие сильнее всего */
  side: "top" | "left" | "right";
  steps?: BlurStep[];
  className?: string;
}

const DIRECTION = {
  top: "to bottom",
  left: "to right",
  right: "to left",
} as const;

/**
 * Прогрессивное размытие того, что лежит под блоком. В CSS такого нет,
 * поэтому набираем стопкой слоёв: каждый следующий размывает сильнее и
 * подрезан маской ближе к краю, а `backdrop-filter` берёт уже размытый
 * результат предыдущих — размытие копится к краю и сходит на нет внутрь.
 *
 * Позиционирование — на вызывающем (`className`), клики проходят насквозь.
 */
export function ProgressiveBlur({
  side,
  steps = HEADER_BLUR_STEPS,
  className,
}: ProgressiveBlurProps) {
  return (
    <div aria-hidden className={cn("pointer-events-none", className)}>
      {steps.map((step, index) => {
        const mask = `linear-gradient(${DIRECTION[side]}, #000, transparent ${step.fade})`;

        return (
          <div
            key={index}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${step.blur}px)`,
              WebkitBackdropFilter: `blur(${step.blur}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        );
      })}
    </div>
  );
}
