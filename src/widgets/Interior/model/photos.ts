/**
 * Россыпь снимков зала — Figma node 222:2081, кадры с y 430 по 2260 макета.
 * Холст считаем 1920×1830, координаты держим в долях от него — тогда коллаж
 * тянется по ширине и не разъезжается. Порядок в массиве = порядок слоёв
 * снизу вверх, как в Figma: `polaroid` лежит поверх `mask`, а не под ним.
 *
 * Кадры в рамках (`hall`, `lamps`, `mural`, `mask`, `canopy`, `door`, `brick`,
 * `terrace`) — **рендеры нод** (`download_assets` → `export`): у каждого своя
 * рамка с рваным краем, в рендере она уже запечена. Рамка рендера чуть больше
 * рамки ноды, край вылезает наружу симметрично — `left`/`top` уже с поправкой.
 *
 * Вырезки (`polaroid`, `papers`, `skull`, `mask-stripes`) — наоборот, сырые
 * заливки: рендер ноды Figma кладёт на **непрозрачный чёрный**, и на бордовом
 * свечении из-под записок вылезал чёрный квадрат. У сырых заливок прозрачность
 * настоящая, но нет поворота — его навешиваем сами, а `left`/`top` здесь
 * считаны для кадра **до** поворота (Figma отдаёт рамку после него).
 * Стикеры (`sticker: true`) — только полароид и записки. Череп и полосатая
 * маска (`cutout: true`) проявляются, как все маски на странице: прозрачностью
 * после кадра под ними (`CUTOUT_DELAY`).
 */
export interface InteriorPhoto {
  src: string;
  alt: string;
  left: string;
  top: string;
  width: string;
  ratio: string;
  rotate?: number;
  opacity?: number;
  /**
   * Вырезка поверх кадров — клеится стикером (`Sticker`), когда раскроется
   * кадр под ней, а не раскрывается шторкой сама.
   */
  sticker?: boolean;
  /**
   * Вырезка-декор (маска, череп) — не раскрывается шторкой, а проявляется
   * прозрачностью после кадра под ней, как маски в других секциях.
   */
  cutout?: boolean;
}

export const INTERIOR_PHOTOS: InteriorPhoto[] = [
  {
    src: "/images/interior/hall.webp",
    alt: "Зал с круглыми зеркалами и люстрами",
    left: "11.549%",
    top: "0%",
    width: "41.12%",
    ratio: "789.5/447.5",
  },
  {
    src: "/images/interior/lamps.webp",
    alt: "Зал с плетёными люстрами",
    left: "57.839%",
    top: "29.59%",
    width: "30.677%",
    ratio: "589/377.5",
  },
  {
    src: "/images/interior/mural.webp",
    alt: "Картина с лицом на стене",
    left: "16.302%",
    top: "30.997%",
    width: "14.844%",
    ratio: "285/280",
  },
  {
    src: "/images/interior/mask.webp",
    alt: "Натюрморт с черепами",
    left: "62.344%",
    top: "9.358%",
    width: "14.427%",
    ratio: "1/1",
  },
  {
    src: "/images/interior/canopy.webp",
    alt: "Балдахин с кистями над столом",
    left: "56.966%",
    top: "57.104%",
    width: "15.286%",
    ratio: "293.5/276.5",
  },
  {
    src: "/images/interior/door.webp",
    alt: "Резная дверь особняка",
    left: "27.07%",
    top: "80.71%",
    width: "15.286%",
    ratio: "293.5/276.5",
  },
  {
    src: "/images/interior/mask-stripes.webp",
    cutout: true,
    alt: "",
    left: "39.083%",
    top: "91.556%",
    width: "4.4%",
    ratio: "84.483/122.998",
    rotate: 11.59,
  },
  {
    src: "/images/interior/brick.webp",
    alt: "Кирпичный зал с окнами",
    left: "13.659%",
    top: "53.579%",
    width: "38.047%",
    ratio: "730.5/395.5",
  },
  {
    src: "/images/interior/terrace.webp",
    alt: "Зал со скульптурами у окна",
    left: "52.669%",
    top: "78.388%",
    width: "36.016%",
    ratio: "691.5/395.5",
  },
  {
    src: "/images/interior/polaroid.webp",
    sticker: true,
    alt: "",
    left: "59.078%",
    top: "6.886%",
    width: "6.371%",
    ratio: "122.331/153.762",
    rotate: 13.55,
  },
  {
    src: "/images/interior/papers.webp",
    sticker: true,
    alt: "",
    left: "36.432%",
    top: "29.822%",
    width: "16.064%",
    ratio: "1/1",
    rotate: -8.5,
    opacity: 0.9,
  },
  {
    src: "/images/interior/skull.webp",
    cutout: true,
    alt: "",
    left: "9.947%",
    top: "16.081%",
    width: "5.907%",
    ratio: "113.418/170.127",
    rotate: -9.29,
  },
];

/**
 * Бордовое свечение под ворохом записок — Figma node 222:2106.
 * `after` — сколько кадров лежит под ним: в макете свечение идёт следом за
 * `polaroid` и накрывает всё, что было раньше, а записки и череп уже поверх.
 */
export const INTERIOR_GLOW = { x: "44.297%", y: "37.746%", size: 387, after: 10 };

/** Пропорция холста коллажа */
export const INTERIOR_CANVAS = "1920/1830";

/**
 * Мобильный коллаж — Figma node 336:246, холст 360×2130 (от y 270 секции
 * до конца последнего кадра). В сентябре 2026 записки в макете уменьшили
 * (210 вместо 288, Figma 336:265) и всё, что ниже, подняли на ~106px —
 * координаты пересчитаны по `get_design_context`: у повёрнутых вырезок
 * он отдаёт рамку после поворота, её центр совпадает с нашим. Раскладка своя, не ужатая десктопная: восемь
 * кадров идут столбиком и уступами, вырезки поверх.
 *
 * Кадры — рендеры нод ×2 (`m-*.webp`): у них та же рваная рамка, прозрачная
 * снаружи. Рендер на 3–5px с каждой стороны больше рамки ноды — `left`/`top`
 * и ширина уже с этой поправкой. Вырезки — те же файлы, что на десктопе,
 * координаты — кадра до поворота. Порядок — слои снизу вверх, как в Figma.
 */
export const INTERIOR_MOBILE_PHOTOS: InteriorPhoto[] = [
  {
    src: "/images/interior/m-1.webp",
    alt: "Зал с хрустальными люстрами",
    left: "3.125%",
    top: "0.105%",
    width: "93.75%",
    ratio: "337.5/249.5",
  },
  {
    src: "/images/interior/m-3.webp",
    alt: "Зал с драпировкой и круглыми зеркалами",
    left: "3.333%",
    top: "36.901%",
    width: "93.333%",
    ratio: "336/248",
  },
  {
    src: "/images/interior/m-2.webp",
    alt: "Черепа на полке",
    left: "49.514%",
    top: "16.116%",
    width: "47.083%",
    ratio: "1/1",
  },
  {
    src: "/images/interior/m-5.webp",
    alt: "Зал с высокими окнами",
    left: "3.056%",
    top: "57.512%",
    width: "93.889%",
    ratio: "338/250",
  },
  {
    src: "/images/interior/m-8.webp",
    alt: "Стол у окна и деревянная скульптура",
    left: "3.056%",
    top: "88.028%",
    width: "93.889%",
    ratio: "338/250",
  },
  {
    src: "/images/interior/polaroid.webp",
    sticker: true,
    alt: "",
    left: "39.158%",
    top: "15.119%",
    width: "19.508%",
    ratio: "70.227/88.27",
    rotate: 13.55,
  },
  {
    src: "/images/interior/papers.webp",
    sticker: true,
    alt: "",
    left: "3.989%",
    top: "24.662%",
    width: "58.345%",
    ratio: "1/1",
    rotate: -8.5,
    opacity: 0.9,
  },
  {
    src: "/images/interior/skull.webp",
    cutout: true,
    alt: "",
    left: "-0.189%",
    top: "7.941%",
    width: "20.173%",
    ratio: "72.623/108.935",
    rotate: -9.29,
  },
  {
    src: "/images/interior/m-4.webp",
    alt: "Резная маска на стене",
    left: "50.208%",
    top: "49.613%",
    width: "40.694%",
    ratio: "1/1",
  },
  {
    src: "/images/interior/m-6.webp",
    alt: "Резная дверь",
    left: "3.472%",
    top: "70.258%",
    width: "46.389%",
    ratio: "1/1",
  },
  {
    src: "/images/interior/m-7.webp",
    alt: "Балдахин с кистями",
    left: "50.139%",
    top: "79.178%",
    width: "46.389%",
    ratio: "1/1",
  },
  {
    src: "/images/interior/mask-stripes.webp",
    cutout: true,
    alt: "",
    left: "35.511%",
    top: "74.927%",
    width: "16.003%",
    ratio: "57.609/83.873",
    rotate: 11.59,
  },
];

/** Свечение под записками на мобильном — Figma node 336:264; идёт следом за `polaroid` */
export const INTERIOR_MOBILE_GLOW = { x: "34.875%", y: "29.601%", size: 245, after: 6 };

/** Пропорция мобильного холста */
export const INTERIOR_MOBILE_CANVAS = "360/2130";
