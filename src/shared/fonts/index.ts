import { Onest } from "next/font/google";

/**
 * Заглушка под шрифты макета: когда придут реальные файлы, кладём их в
 * `shared/fonts/<family>/*.woff2` и подключаем через `next/font/local`,
 * как в недвижке. Переменные (--font-display / --font-ui) менять не нужно —
 * они уже прошиты в @theme.
 */
export const display = Onest({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
  adjustFontFallback: false,
});

export const ui = Onest({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  variable: "--font-ui",
  display: "swap",
  adjustFontFallback: false,
});
