export interface Space {
  number: string;
  name: string;
  meta: string;
  description: string;
  capacity: { value: string; label: string }[];
  photo: { src: string; alt: string };
}

/**
 * Четыре пространства — Figma node 114:2464.
 *
 * Раскрыто в макете только BISTRO (02) — эта запись дословная. Остальные три
 * TODO: названия, метраж, описания, вместимость и фото ждём от клиента.
 */
export const SPACES: Space[] = [
  {
    number: "01",
    name: "BAR",
    meta: "180 м² · 1 этаж",
    description: "Авторские коктейли и винная карта. Длинная стойка и живая музыка по выходным.",
    capacity: [
      { value: "40", label: "Фуршет" },
      { value: "120", label: "Банкет" },
    ],
    photo: { src: "/images/interior/tables.webp", alt: "Барная зона" },
  },
  {
    number: "02",
    name: "BISTRO",
    meta: "290 м² · 1 этаж",
    description: "Гастрономические ужины и камерные мероприятия. Джогло, камин и открытая кухня.",
    capacity: [
      { value: "65", label: "Фуршет" },
      { value: "323", label: "Банкет" },
    ],
    photo: { src: "/images/spaces/bistro.webp", alt: "Зал Bistro с накрытым столом у камина" },
  },
  {
    number: "03",
    name: "CHAMBER",
    meta: "220 м² · 2 этаж",
    description: "Закрытый зал для приватных ужинов. Отдельный вход и собственная гардеробная.",
    capacity: [
      { value: "35", label: "Фуршет" },
      { value: "90", label: "Банкет" },
    ],
    photo: { src: "/images/spaces/hall.webp", alt: "Зал с высокими потолками" },
  },
  {
    number: "04",
    name: "TERRACE",
    meta: "410 м² · 3 этаж",
    description: "Летняя терраса с панорамой на Замоскворечье. Работает с мая по сентябрь.",
    capacity: [
      { value: "70", label: "Фуршет" },
      { value: "180", label: "Банкет" },
    ],
    photo: { src: "/images/interior/ceiling.webp", alt: "Верхний зал под расписным потолком" },
  },
];
