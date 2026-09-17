/** Пункты меню из макета (Figma node 114:2402) — id ведут на секции страницы */
export const NAV_ITEMS = [
  { id: "legend", label: "О доме" },
  { id: "kitchen", label: "Меню" },
  { id: "spaces", label: "Пространства" },
  { id: "events", label: "Мероприятия" },
  { id: "contacts", label: "Контакты" },
] as const;

/** Контакты заведения — Figma node 114:2391 */
export const CONTACTS = {
  address: "УЛ.КОЖЕВНИЧЕСКАЯ, 16 СТР.4",
  city: "MOSCOW",
  brand: "MADAME ROCHE",
} as const;
