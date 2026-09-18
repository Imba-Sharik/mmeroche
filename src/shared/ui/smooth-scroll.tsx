"use client";

import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/shared/lib";
import { useEffect } from "react";

let lenis: Lenis | null = null;

/** Единственный инстанс Lenis на приложение — забирать через getLenis() */
export function getLenis() {
  return lenis;
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
    const instance = new Lenis({ autoRaf: false });
    lenis = instance;

    const onScroll = () => ScrollTrigger.update();
    instance.on("scroll", onScroll);

    const raf = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(raf);
    // GSAP сглаживает дельту между кадрами, Lenis это только мешает
    gsap.ticker.lagSmoothing(0);

    // Позиции триггеров считались до перехвата скролла — пересчитываем
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      instance.off("scroll", onScroll);
      instance.destroy();
      lenis = null;
    };
  }, []);

  return null;
}
