import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

/**
 * Кнопки макета — Figma nodes 222:1993 / 222:1998 (шапка), 222:2001 / 222:2003
 * (Hero), 222:2030 / 222:2034 («Кухня»), 222:2150 («Контакты»).
 * Скругление одно на все — 8px (`rounded-lg`).
 */
const button = cva(
  "text-mono-sm inline-flex items-center justify-center gap-2.5 rounded-lg whitespace-nowrap transition-opacity hover:opacity-80",
  {
    variants: {
      variant: {
        solid: "bg-wine text-cream",
        /** Secondary из макета — «Построить маршрут» */
        route: "bg-wine-light text-cream",
        /** Главная кнопка первого экрана: кремовая заливка, бордовый текст */
        cream: "bg-cream text-wine",
        outline: "border-[0.5px] border-ink-muted text-cream",
        ghost: "text-cream",
      },
      size: {
        sm: "h-9 px-5",
        md: "px-5.5 py-3",
        /** Hero: 46px высотой, текст 16px */
        lg: "text-mono-md h-11.5 px-5",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> & VariantProps<typeof button>;

export function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(button({ variant, size }), className)} {...props} />;
}

type ButtonLinkProps = React.ComponentProps<"a"> & VariantProps<typeof button>;

/** Та же кнопка, но ссылкой: маршрут, телефон, внешние переходы */
export function ButtonLink({ className, variant, size, ...props }: ButtonLinkProps) {
  return <a className={cn(button({ variant, size }), className)} {...props} />;
}
