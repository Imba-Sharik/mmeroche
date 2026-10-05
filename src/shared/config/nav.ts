/**
 * Пункты меню из макета (Figma node 222:1986) — id ведут на секции страницы.
 * «Чего ожидать» — это `spaces`, виджет Expect.
 */
export const NAV_ITEMS = [
  { id: "legend", label: "Легенда" },
  { id: "kitchen", label: "Кухня" },
  { id: "spaces", label: "Чего ожидать" },
  { id: "interior", label: "Интерьер" },
  { id: "events", label: "Мероприятия" },
  { id: "contacts", label: "Контакты" },
] as const;

/**
 * Пункты мобильного меню — Figma node 336:451. Те же, что на десктопе,
 * но строчными, как в макете.
 */
export const MOBILE_NAV_ITEMS = [
  { id: "legend", label: "легенда" },
  { id: "kitchen", label: "кухня" },
  { id: "spaces", label: "чего ожидать" },
  { id: "interior", label: "интерьер" },
  { id: "events", label: "мероприятия" },
  { id: "contacts", label: "контакты" },
] as const;

/** Контакты заведения — Figma nodes 222:1994, 222:2140, 222:2159 */
export const CONTACTS = {
  brand: "MADAME ROCHE",
  city: "MOSCOW",
  /** Подзаголовок первого экрана — Figma node 222:2005 */
  tagline: ["Ресторан и тайный особняк", "загадочной азиатки"],
  /** Строка адреса в Hero — капсом, как в макете */
  address: "УЛ.КОЖЕВНИЧЕСКАЯ, 16 СТР.4",
  addressLines: ["Москва", "Кожевническая ул., 16, стр. 4"],
  hours: ["Пн–Вс  14:00–00:00"],
  /** Один номер на весь сайт — шапка, меню, «Контакты» (в макете в шапке стоял другой) */
  phone: "+7 (495) 019-01-11",
  /** Бронь столов — внешний сервис Hostme, как на прежнем сайте */
  bookingUrl: "https://tables.hostmeapp.com/reserve/36826",
  /** Меню кухни и барная карта — PDF от клиента в `public/`, открываются во вкладке */
  menuUrl: "/madame-roche-menu.pdf",
  barUrl: "/madame-roche-bar.pdf",
  /** TODO: заменить на ссылку с точными координатами, когда подтвердят точку на карте */
  routeUrl: "https://yandex.ru/maps/?text=Москва, Кожевническая улица, 16с4",
  /** TODO: ссылки на Telegram и домен */
  links: [
    // Звёздочка отсылает к `metaNotice` — ставим его везде, где есть эта ссылка
    { label: "Instagram*", href: "https://www.instagram.com/madame.roche.rest" },
    { label: "Telegram", href: "#" },
    { label: "mmeroche.ru", href: "#" },
  ],
  /** Подпись в подвале: «MADAME ROCHE · PART OF PLACEBO/25», ссылка только на вторую часть */
  legal: "MADAME ROCHE",
  group: { label: "PART OF PLACEBO/25", url: "https://placebo25.com/" },
  /** Реквизиты: на десктопе в строку, на мобильном столбиком — Figma node 336:324 */
  requisites: ["ООО «АБЕРДИН РОУД»", "ОГРН 1247700649932", "ИНН 9725170197"],
  /**
   * Оговорка про Meta — принятая в РФ формулировка при упоминании Instagram
   * (Meta признана экстремистской, решение Тверского суда от 21.03.2022).
   */
  metaNotice:
    "*Instagram — продукт компании Meta Platforms Inc., деятельность которой признана экстремистской и запрещена на территории РФ",
} as const;

/** Телефон в формате для tel: */
const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const PHONE_HREF = telHref(CONTACTS.phone);

/** Внешние ссылки и PDF открываем в новой вкладке, заглушки `#` — нет */
export const linkTarget = (href: string) =>
  href.startsWith("http") || href.endsWith(".pdf")
    ? ({ target: "_blank", rel: "noreferrer noopener" } as const)
    : {};
