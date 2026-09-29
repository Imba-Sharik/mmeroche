"use client";

import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/**
 * Единая точка входа в GSAP.
 *
 * Плагин регистрируем при импорте модуля, а не в эффекте: эффекты компонентов
 * выполняются снизу вверх, и твин с `scrollTrigger` мог создаться раньше
 * регистрации — тогда GSAP молча игнорирует привязку к скроллу и проигрывает
 * анимацию сам по себе.
 *
 * SplitText и CustomEase с 3.13 бесплатные и лежат в самом пакете `gsap`.
 *
 * `reveal` — кривая проявления текста с jeskojets.com (у них она `Out`):
 * резкий старт и длинный мягкий хвост.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
  CustomEase.create("reveal", "0.25,1,0.5,1");
}

export { gsap, ScrollTrigger, SplitText };
