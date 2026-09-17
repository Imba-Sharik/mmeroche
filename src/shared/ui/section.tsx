import { cn } from "@/shared/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

/** Контейнер макета: поля --container-inset (50px по макету), на мобиле — 20px */
export function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn("px-5 lg:px-[var(--container-inset)]", className)}>
      {children}
    </section>
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
