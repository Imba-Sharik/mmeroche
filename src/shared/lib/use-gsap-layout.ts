"use client";

import { gsap } from "./gsap";
import { useEffect, useLayoutEffect, type DependencyList } from "react";

/** На сервере useLayoutEffect предупреждает — там эффект всё равно не нужен */
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Анимации внутри gsap.context: всё созданное в `setup` живёт в своей области
 * и полностью откатывается на размонтировании, включая ScrollTrigger'ы.
 */
export function useGsapLayout(setup: () => void | (() => void), deps: DependencyList = []) {
  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(setup);
    return () => ctx.revert();
  }, deps);
}
