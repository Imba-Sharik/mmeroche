import { cn } from "@/shared/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

/** Контейнер макета: поля --container-inset (50px по макету), на мобиле — 20px */
export function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn("px-5 lg:px-(--container-inset)", className)}>
      {children}
    </section>
  );
}

interface SectionKickerProps {
  /** Порядковый номер секции по макету: «01», «02», … */
  index: string;
  children: React.ReactNode;
  className?: string;
}

/** Надзаголовок секции: «01 · О ДОМЕ» + бордовая черта — Figma node 114:2415 */
export function SectionKicker({ index, children, className }: SectionKickerProps) {
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <p className="text-mono-xs text-ink-dim">
        {index} · {children}
      </p>
      <span aria-hidden className="h-px w-12 bg-wine" />
    </div>
  );
}

interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
}

/** Крупный заголовок секции — 72px по макету (Figma node 114:2419) */
export function SectionHeading({ children, className }: SectionHeadingProps) {
  return (
    <h2
      className={cn("font-sans text-[clamp(40px,3.75vw,72px)] leading-[0.9] uppercase", className)}
    >
      {children}
    </h2>
  );
}

interface SectionTitleProps {
  children: React.ReactNode;
  /** Правый слот: табы, счётчик, кнопка */
  aside?: React.ReactNode;
  className?: string;
}

export function SectionTitle({ children, aside, className }: SectionTitleProps) {
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-5", className)}>
      <h2 className="font-sans text-3xl leading-none uppercase lg:text-[48px]">{children}</h2>
      {aside}
    </div>
  );
}
