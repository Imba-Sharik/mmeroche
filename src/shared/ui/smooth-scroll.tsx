"use client";

import Lenis from "lenis";
import { gsap, ScrollTrigger, setNavDestination } from "@/shared/lib";
import { useEffect } from "react";

let lenis: Lenis | null = null;

/** Единственный инстанс Lenis на приложение — забирать через getLenis() */
export function getLenis() {
  return lenis;
}

/** Разгон и торможение — поездка к секции, а не рывок */
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * Плавно везёт страницу к секции по `id` — пункты шапки, меню, «ЛИСТАТЬ».
 * Обычная ссылка `#id` прыгала бы мгновенно: Lenis её не перехватывает.
 *
 * Время — по расстоянию (0.8–2 с): с постоянными 1.4 с путь до «Контактов»
 * пролетал почти 6000px в секунду. И на время поездки всё, мимо чего едем,
 * встаёт в конечное состояние без анимации (`setNavDestination`): иначе по
 * дороге проявлялись из размытия тексты всех секций и кадры проседали.
 * Секция назначения проявляется как обычно.
 *
 * Шторку (экран в чёрное → прыжок → открыть) тоже пробовали — клиент
 * предпочёл прокрутку.
 */
export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  // Секций нет только на страницах документов: меню ведёт на главную, «наверх» — в начало
  if (!target) {
    if (id !== "hero") window.location.assign(`/#${id}`);
    else if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (!lenis) {
    target.scrollIntoView({ behavior: "smooth" });
    return;
  }

  const distance = Math.abs(target.getBoundingClientRect().top);
  const duration = gsap.utils.clamp(0.8, 2, 0.6 + distance / 5000);

  setNavDestination(target);
  // Подстраховка: если поездку перебили колесом, `onComplete` не придёт
  const release = gsap.delayedCall(duration + 0.5, () => setNavDestination(null));

  lenis.scrollTo(target, {
    duration,
    easing: easeInOutCubic,
    // Едем, даже если Lenis только что остановлен: мобильное меню закрывается в том же клике
    force: true,
    onComplete: () => {
      release.kill();
      setNavDestination(null);
    },
  });
}

/**
 * Плавный скролл + общий тикер для GSAP.
 *
 * Lenis подменяет нативную прокрутку, поэтому ScrollTrigger сам не узнаёт о
 * движении: связываем их вручную — Lenis крутим из тикера GSAP (без autoRaf),
 * а каждый его кадр дёргает ScrollTrigger.update().
 */
export function SmoothScroll() {
  useEffect(() => {
    /*
     * Настройки как в «Недвижке» (`D:\nedvizka`) — клиент попросил вернуть тот
     * скролл: колесо доезжает за 1 с по кубической кривой, касания не трогаем —
     * на телефоне нативная инерция. Эмуляцию касаний (`syncTouch`) пробовали
     * по просьбе «плавнее» — отказались.
     */
    const instance = new Lenis({
      autoRaf: false,
      duration: 1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });
    lenis = instance;

    const onScroll = () => ScrollTrigger.update();
    instance.on("scroll", onScroll);

    const raf = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(raf);
    // GSAP сглаживает дельту между кадрами, Lenis это только мешает
    gsap.ticker.lagSmoothing(0);

    // Позиции триггеров считались до перехвата скролла — пересчитываем
    ScrollTrigger.refresh();

    /*
     * И ещё раз, когда догрузились шрифты: дисплейный меняет высоту заголовков,
     * всё ниже по странице съезжает, и триггеры срабатывали не там — на
     * мобильном это заметно по счётчикам в «Мероприятиях».
     */
    let alive = true;
    document.fonts.ready.then(() => {
      if (alive) ScrollTrigger.refresh();
    });

    return () => {
      alive = false;
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      instance.off("scroll", onScroll);
      instance.destroy();
      lenis = null;
    };
  }, []);

  return null;
}
