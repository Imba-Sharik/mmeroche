import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

/**
 * Кнопки макета: бордовая заливка и обводка кремовым.
 * Figma nodes 114:2412 (шапка), 114:2438 / 114:2442 (секция «Кухня»).
 */
const button = cva(
  "text-mono-sm inline-flex items-center justify-center gap-2.5 rounded-lg whitespace-nowrap transition-opacity hover:opacity-80",
  {
    variants: {
      variant: {
        solid: "bg-wine text-cream",
        outline: "border-[0.5px] border-ink-dim text-cream",
      },
      size: {
        sm: "h-9 px-5",
        md: "px-5.5 py-3",
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
