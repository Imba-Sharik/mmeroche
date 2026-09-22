import { cn } from "@/shared/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

/** Секция страницы: якорь для навигации и точка отсчёта для декора */
export function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn("relative", className)}>
      {children}
    </section>
  );
}

/** Контейнер макета: 1464px по центру (поля 228 при 1920), на узких — 20px */
export function Container({ children, className }: Omit<SectionProps, "id">) {
  return <div className={cn("container-grid relative", className)}>{children}</div>;
}

interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
}

/** Крупный заголовок секции — 72px по макету (Figma node 222:2016) */
export function SectionHeading({ children, className }: SectionHeadingProps) {
  return <h2 className={cn("text-display-xl", className)}>{children}</h2>;
}

interface SectionIntroProps {
  title: React.ReactNode;
  children: React.ReactNode;
  id?: string;
  className?: string;
}

/**
 * Заголовок с лидом по центру — Figma node 222:2077 («чего ожидать»),
 * тот же блок в «Интерьере» (222:2103): колонка 520px, гэп 24.
 */
export function SectionIntro({ title, children, id, className }: SectionIntroProps) {
  return (
    <div className={cn("relative mx-auto flex max-w-130 flex-col gap-6 text-center text-cream", className)}>
      <h2 id={id} className="text-display-xl">
        {title}
      </h2>
      <p className="text-mono-base">{children}</p>
    </div>
  );
}
