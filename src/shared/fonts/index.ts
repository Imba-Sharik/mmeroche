import { Noto_Serif_SC, PT_Mono, Playfair_Display } from "next/font/google";

/**
 * Дисплейный шрифт макета — «a RomanusTitul» (высококонтрастная антиква, лого MADAME).
 * Лицензионных файлов пока нет → временно Playfair Display.
 * TODO: положить реальный в `shared/fonts/romanus/*.woff2` и подключить через
 * `next/font/local`, не меняя имя переменной --font-display.
 */
export const display = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
  adjustFontFallback: false,
});

/** Интерфейсный моношрифт: навигация, кнопки, подписи (PT Mono 12/14/18 по макету) */
export const ui = PT_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400"],
  variable: "--font-ui",
  display: "swap",
  adjustFontFallback: false,
});

/** Акцент — вертикальные иероглифы в Hero и разделителях секций */
export const accent = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["300", "400", "900"],
  variable: "--font-accent",
  display: "swap",
  adjustFontFallback: false,
});
