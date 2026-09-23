/**
 * Лента блюд — Figma node 222:2039. В макете клеток шесть, но клиент попросил
 * меню из десяти, поэтому четыре блюда повторяются (`-2` в `id`). Повторы
 * расставлены так, чтобы одинаковые кадры не оказались ни рядом, ни друг
 * под другом: сетка идёт пятью колонками в два ряда.
 *
 * Вторая клетка в макете нарисована уже раскрытой — она показывает, что
 * карточки интерактивные (там же курсор-подсказка). У нас переворачиваются
 * все, а подсказку носит та же вторая клетка.
 *
 * TODO: из макета взяты только «карбонара от путника Афелия», её описание и
 * плашка «Мексика». Названия, описания и страны остальных придуманы нами —
 * ждём меню кухни. Тогда же уйдут и повторы: блюд станет десять настоящих.
 *
 * TODO: фотографии карбонары в макете нет — на её клетке пока копия соседнего
 * снимка, `public/images/kitchen/grid-2.webp`. Придёт настоящая — просто
 * перезаписать файл, код трогать не нужно.
 */
export interface Dish {
  id: string;
  title: string;
  description: string;
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
 * чтобы все плашки выглядели как одна серия.
 */
const ORIGIN = {
  mexico: { label: "Мексика", map: "/images/kitchen/origin-mexico.webp" },
  italy: { label: "Италия", map: "/images/kitchen/origin-italy.webp" },
  spain: { label: "Испания", map: "/images/kitchen/origin-spain.webp" },
  greece: { label: "Греция", map: "/images/kitchen/origin-greece.webp" },
  portugal: { label: "Португалия", map: "/images/kitchen/origin-portugal.webp" },
} as const;

type DishContent = Omit<Dish, "id">;

const PIZZA: DishContent = {
  photo: "/images/kitchen/grid-1.webp",
  alt: "Пицца с фисташковым песто",
  title: "пицца с фисташкой и страчателлой",
  description:
    "Тонкое тесто на закваске, фисташковый песто и страчателла, которую кладут уже на горячее.",
  origin: ORIGIN.italy,
};

const CARBONARA: DishContent = {
  photo: "/images/kitchen/grid-2.webp",
  alt: "Паста карбонара",
  title: "карбонара от путника Афелия",
  description:
    "Это блюдо — тёплый привет из детства, где каждая ложка наполнена уютом и ароматами свежих, " +
    "отборных продуктов, приготовленных с любовью и вниманием к сезону.",
  origin: ORIGIN.mexico,
};

const PEPPERS: DishContent = {
  photo: "/images/kitchen/grid-3.webp",
  alt: "Салат с печёным перцем",
  title: "печёный перец с фетой",
  description: "Перец томят на углях, подают с фетой, каперсами и зеленью, собранной утром.",
  origin: ORIGIN.greece,
};

const BRUSCHETTA: DishContent = {
  photo: "/images/kitchen/grid-4.webp",
  alt: "Брускетта с томатами и пармезаном",
  title: "брускетта с томатом и пармезаном",
  description: "Ремесленный хлеб, спелый томат, пармезан и зелёный песто на оливковом масле.",
  origin: ORIGIN.italy,
};

const CROQUETTES: DishContent = {
  photo: "/images/kitchen/grid-5.webp",
  alt: "Крокеты с хамоном на камне",
  title: "крокеты с хамоном",
  description: "Хрустящие снаружи и текучие внутри, с хамоном и томатным соусом на огне.",
  origin: ORIGIN.spain,
};

const OCTOPUS: DishContent = {
  photo: "/images/kitchen/grid-6.webp",
  alt: "Осьминог с микрозеленью",
  title: "осьминог с микрозеленью",
  description: "Осьминог с углей, зелёное масло и микрозелень — вкус, собранный в три штриха.",
  origin: ORIGIN.portugal,
};

/** Порядок в массиве и есть порядок в сетке: первые пять — верхний ряд */
export const DISHES: Dish[] = [
  { id: "pizza", ...PIZZA },
  { id: "carbonara", ...CARBONARA, hint: true },
  { id: "peppers", ...PEPPERS },
  { id: "bruschetta", ...BRUSCHETTA },
  { id: "croquettes", ...CROQUETTES },

  { id: "octopus", ...OCTOPUS },
  { id: "croquettes-2", ...CROQUETTES },
  { id: "pizza-2", ...PIZZA },
  { id: "peppers-2", ...PEPPERS },
  { id: "bruschetta-2", ...BRUSCHETTA },
];
