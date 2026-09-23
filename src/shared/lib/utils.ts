import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Собственные текстовые утилиты (`text-mono-*`, `text-display-*` из globals.css)
 * tailwind-merge по умолчанию принимает за цвет: `cn("text-display-xl",
 * "text-cream")` выбрасывал размер и оставлял только цвет. Объявляем их
 * размерами — тогда они спорят между собой, а не с цветом.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "mono-xs",
            "mono-sm",
            "mono-base",
            "mono-md",
            "display-xs",
            "display-sm",
            "display-md",
            "display-xl",
            "display-2xl",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
