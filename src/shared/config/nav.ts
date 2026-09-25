/**
 * Пункты меню из макета (Figma node 222:1986) — id ведут на секции страницы.
 * «Пространства» открывают секцию «Чего ожидать» (виджет Expect): отдельной
 * секции про залы в новом макете нет, про них рассказывает её средняя карточка.
 */
export const NAV_ITEMS = [
  { id: "legend", label: "О доме" },
  { id: "kitchen", label: "Меню" },
  { id: "spaces", label: "Пространства" },
  { id: "events", label: "Мероприятия" },
  { id: "contacts", label: "Контакты" },
] as const;

/**
 * Пункты мобильного меню — Figma node 336:451. Их больше, чем на десктопе,
 * и названы они по секциям, а не по смыслу: «интерьер» есть только здесь.
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
  hours: ["Вт–Чт  17:00–00:00", "Пт–Вс  15:00–00:00"],
  phone: "+7 (495) 019-01-11",
  /** Телефон брони в шапке — Figma node 222:1994 */
  bookingPhone: "+7 905 403 20 20",
  /** TODO: заменить на ссылку с точными координатами, когда подтвердят точку на карте */
  routeUrl: "https://yandex.ru/maps/?text=Москва, Кожевническая улица, 16с4",
  /** TODO: реальные ссылки на соцсети и домен */
  links: [
    { label: "Instagram", href: "#" },
    { label: "Telegram", href: "#" },
    { label: "mmeroche.ru", href: "#" },
  ],
  /** Подпись в подвале: «MADAME ROCHE · PART OF PLACEBO/25», ссылка только на вторую часть */
  legal: "MADAME ROCHE",
  group: { label: "PART OF PLACEBO/25", url: "https://placebo25.com/" },
  requisites: "Реквизиты по запросу",
} as const;

/** Телефон в формате для tel: */
const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const PHONE_HREF = telHref(CONTACTS.phone);
export const BOOKING_PHONE_HREF = telHref(CONTACTS.bookingPhone);
