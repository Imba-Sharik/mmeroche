import type { ScrollTrigger } from "./gsap";

/**
 * Куда сейчас везём страницу по клику в меню; `null` — человек крутит сам.
 *
 * По дороге к секции срабатывают проявления, стикеры и счётчики всех секций,
 * мимо которых едем, — кадры проседали, и поездка выходила дёрганой. Пока
 * флаг стоит, всё, что вне секции назначения, сразу встаёт в конечное
 * состояние. Ставит и снимает его `scrollToSection`.
 */
let destination: Element | null = null;

export function setNavDestination(el: Element | null) {
  destination = el;
}

/** Едем по меню, и `el` — не в секции назначения: анимацию пропускаем */
export function skipsAnimation(el: Element) {
  return destination !== null && !destination.contains(el);
}

/**
 * `onEnter` для твина со `scrollTrigger`: проехали мимо — твин сразу в конец.
 * ScrollTrigger сначала запускает твин, потом зовёт колбэк, так что
 * `progress(1)` перебивает запуск.
 */
export function finishIfPassing(self: ScrollTrigger) {
  if (self.trigger && skipsAnimation(self.trigger)) self.animation?.progress(1);
}
