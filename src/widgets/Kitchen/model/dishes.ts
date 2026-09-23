/**
 * Лента блюд — Figma node 222:2039: шесть клеток 460×320.
 *
 * Вторая клетка в макете нарисована уже раскрытой — она показывает, что
 * карточки интерактивные (там же курсор-подсказка). У нас переворачиваются
 * все шесть, а подсказку носит та же вторая клетка.
 *
 * TODO: из макета взяты только «карбонара от путника Афелия», её описание и
 * плашка «Мексика». Названия, описания и страны остальных пяти придуманы нами —
 * ждём меню кухни.
 *
 * TODO: фотографии карбонары в макете нет — на её клетке пока копия соседнего
 * снимка, `public/images/kitchen/grid-2.webp`. Придёт настоящая — просто
 * перезаписать файл, код трогать не нужно.
 */
export interface Dish {
  id: string;
  title: string;
  description: string;
  /** Порядок в сетке макета: карточка из макета стоит второй */
  order: string;
  photo: string;
  alt: string;
  origin: { label: string; map: string };
  /** Курсор-подсказка из макета: намёк, что клетку можно раскрыть */
  hint?: boolean;
}

/**
 * Силуэты стран нарисованы нами из Natural Earth 110m (public domain) одним
 * скриптом, поэтому одинаковы по стилю и не требуют атрибуции. Мексика из
 * макета была картой другого рода (с морем и границами штатов) — заменена,
 * чтобы все шесть плашек выглядели как одна серия.
 */
const ORIGIN = {
  mexico: { label: "Мексика", map: "/images/kitchen/origin-mexico.webp" },
  italy: { label: "Италия", map: "/images/kitchen/origin-italy.webp" },
  spain: { label: "Испания", map: "/images/kitchen/origin-spain.webp" },
  greece: { label: "Греция", map: "/images/kitchen/origin-greece.webp" },
  portugal: { label: "Португалия", map: "/images/kitchen/origin-portugal.webp" },
} as const;

export const DISHES: Dish[] = [
  {
    id: "pizza",
    order: "lg:order-1",
    photo: "/images/kitchen/grid-1.webp",
    alt: "Пицца с фисташковым песто",
    title: "пицца с фисташкой и страчателлой",
    description:
      "Тонкое тесто на закваске, фисташковый песто и страчателла, которую кладут уже на горячее.",
    origin: ORIGIN.italy,
  },
  {
    id: "carbonara",
    order: "lg:order-2",
    photo: "/images/kitchen/grid-2.webp",
    alt: "Паста карбонара",
    title: "карбонара от путника Афелия",
    description:
      "Это блюдо — тёплый привет из детства, где каждая ложка наполнена уютом и ароматами свежих, " +
      "отборных продуктов, приготовленных с любовью и вниманием к сезону.",
    origin: ORIGIN.mexico,
    hint: true,
  },
  {
    id: "peppers",
    order: "lg:order-3",
    photo: "/images/kitchen/grid-3.webp",
    alt: "Салат с печёным перцем",
    title: "печёный перец с фетой",
    description: "Перец томят на углях, подают с фетой, каперсами и зеленью, собранной утром.",
    origin: ORIGIN.greece,
  },
  {
    id: "bruschetta",
    order: "lg:order-4",
    photo: "/images/kitchen/grid-4.webp",
    alt: "Брускетта с томатами и пармезаном",
    title: "брускетта с томатом и пармезаном",
    description: "Ремесленный хлеб, спелый томат, пармезан и зелёный песто на оливковом масле.",
    origin: ORIGIN.italy,
  },
  {
    id: "croquettes",
    order: "lg:order-5",
    photo: "/images/kitchen/grid-5.webp",
    alt: "Крокеты с хамоном на камне",
    title: "крокеты с хамоном",
    description: "Хрустящие снаружи и текучие внутри, с хамоном и томатным соусом на огне.",
    origin: ORIGIN.spain,
  },
  {
    id: "octopus",
    order: "lg:order-6",
    photo: "/images/kitchen/grid-6.webp",
    alt: "Осьминог с микрозеленью",
    title: "осьминог с микрозеленью",
    description: "Осьминог с углей, зелёное масло и микрозелень — вкус, собранный в три штриха.",
    origin: ORIGIN.portugal,
  },
];
