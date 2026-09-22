/**
 * Разделители между секциями — Figma nodes 241:1128, 241:1130, 241:1139.
 * Каждый — полоса на всю ширину с линией по центру и реликвиями поверх неё.
 *
 * Полоса держит пропорцию макета (`1920 / height`), поэтому доли ниже —
 * это проценты от ширины 1920 и от высоты самой полосы. У повёрнутых нод
 * Figma отдаёт рамку **после** поворота: размеры и отступы здесь пересчитаны
 * на исходный кадр, поворот навешивается сверху.
 */
export interface DividerRelic {
  src: string;
  /** Размеры исходного кадра в пикселях макета */
  width: number;
  height: number;
  /** Левый край и верх кадра: % ширины 1920 и % высоты полосы */
  left: string;
  top: string;
  rotate: number;
}

export interface DividerVariant {
  /** Высота полосы в пикселях макета */
  height: number;
  /** Положение линии — % высоты полосы */
  line: string;
  relics: DividerRelic[];
}

export const DIVIDERS = {
  /** Каллиграфия и билет в «Луна-парк» — Figma node 241:1128 */
  tickets: {
    height: 161,
    line: "49.69%",
    relics: [
      {
        src: "/images/common/divider-1a.webp",
        width: 57,
        height: 101,
        left: "47.46%",
        top: "3.85%",
        rotate: 17.6,
      },
      {
        src: "/images/common/divider-1b.webp",
        width: 76,
        height: 114,
        left: "48.92%",
        top: "26.27%",
        rotate: -8,
      },
    ],
  },
  /** Шанхайская марка и вывеска зубной клиники — Figma node 241:1130 */
  stamp: {
    height: 135,
    line: "49.63%",
    relics: [
      {
        src: "/images/common/divider-2a.webp",
        width: 77,
        height: 115,
        left: "49.24%",
        top: "7.39%",
        rotate: 21,
      },
      {
        src: "/images/common/divider-2b.webp",
        width: 88,
        height: 58,
        left: "46.93%",
        top: "35.33%",
        rotate: 57.97,
      },
    ],
  },
  /** Ворох меню и записок — Figma node 241:1139 */
  menu: {
    height: 463,
    line: "49.89%",
    relics: [
      {
        src: "/images/common/divider-3.webp",
        width: 442,
        height: 462,
        left: "38.48%",
        top: "0%",
        rotate: 0,
      },
    ],
  },
} as const satisfies Record<string, DividerVariant>;

export type DividerName = keyof typeof DIVIDERS;
