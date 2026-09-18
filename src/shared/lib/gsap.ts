"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Единая точка входа в GSAP.
 *
 * Плагин регистрируем при импорте модуля, а не в эффекте: эффекты компонентов
 * выполняются снизу вверх, и твин с `scrollTrigger` мог создаться раньше
 * регистрации — тогда GSAP молча игнорирует привязку к скроллу и проигрывает
 * анимацию сам по себе.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
