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
    alt: "",
    left: "59.078%",
    top: "6.886%",
    width: "6.371%",
    ratio: "122.331/153.762",
    rotate: 13.55,
  },
  {
    src: "/images/interior/papers.webp",
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
