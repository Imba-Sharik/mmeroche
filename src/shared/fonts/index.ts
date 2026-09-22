import { Noto_Serif_SC, PT_Mono, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";

/**
 * Дисплейный шрифт макета — «a_RomanusTitul» (Arsenal Company, 1997,
 * W. Chufarofsky & M. Slutsker). Титульная антиква: строчных в нём нет,
 * на их местах лежат прописные — поэтому в коде заголовки набраны строчными
 * («легенда», «кухня»), а на экране выходят капсом, как в Figma.
 *
 * Шрифт 1997 года, разложен по бесплатным архивам как «free for personal use»;
 * коммерческого разрешения у нас нет. TODO: получить лицензию у клиента —
 * иначе шрифт придётся заменить.
 */
export const display = localFont({
  src: "./romanus/a-romanus-titul.woff2",
  variable: "--font-display",
  display: "swap",
  weight: "400",
  style: "normal",
  fallback: ["Playfair Display", "serif"],
  adjustFontFallback: false,
});

/**
 * Playfair Display Italic — им в макете набрана только подпись в «Легенде»
 * (Figma node 222:2020), заголовки идут дисплейным.
 */
export const note = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["400"],
  style: ["italic"],
  variable: "--font-note",
  display: "swap",
  adjustFontFallback: false,
});

/** Интерфейсный моношрифт: навигация, кнопки, подписи (PT Mono 10…18 по макету) */
export const ui = PT_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400"],
  variable: "--font-ui",
  display: "swap",
  adjustFontFallback: false,
});

/** Акцент — иероглифы 创意料理 в подвале */
export const accent = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["300", "400", "900"],
  variable: "--font-accent",
  display: "swap",
  adjustFontFallback: false,
});
