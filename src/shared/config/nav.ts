/** Пункты меню из макета (Figma node 114:2402) — id ведут на секции страницы */
export const NAV_ITEMS = [
  { id: "legend", label: "О доме" },
  { id: "kitchen", label: "Меню" },
  { id: "spaces", label: "Пространства" },
  { id: "events", label: "Мероприятия" },
  { id: "contacts", label: "Контакты" },
] as const;

/** Контакты заведения — Figma nodes 114:2391, 114:2590 */
export const CONTACTS = {
  brand: "MADAME ROCHE",
  city: "MOSCOW",
  /** Строка адреса в Hero — капсом, как в макете */
  address: "УЛ.КОЖЕВНИЧЕСКАЯ, 16 СТР.4",
  addressLines: ["Москва", "Кожевническая ул., 16, стр. 4"],
  hours: ["Вт–Чт 17:00–00:00", "Пт–Вс 15:00–00:00"],
  phone: "+7 495 019-01-11",
  /** TODO: заменить на ссылку с точными координатами, когда подтвердят точку на карте */
  routeUrl: "https://yandex.ru/maps/?text=Москва, Кожевническая улица, 16с4",
  /** TODO: реальные ссылки на соцсети и домен */
  links: [
    { label: "Instagram", href: "#" },
    { label: "Telegram", href: "#" },
    { label: "mmeroche.ru", href: "#" },
  ],
  legal: "MADAME ROCHE · PART OF PLACEBO/25",
  requisites: "Реквизиты по запросу",
} as const;

/** Телефон в формате для tel: */
export const PHONE_HREF = `tel:${CONTACTS.phone.replace(/[^\d+]/g, "")}`;
