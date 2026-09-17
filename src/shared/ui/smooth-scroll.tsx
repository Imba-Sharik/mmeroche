"use client";

import Lenis from "lenis";
import { useEffect } from "react";

let lenis: Lenis | null = null;

/** Единственный инстанс Lenis на приложение — забирать через getLenis() */
export function getLenis() {
  return lenis;
}

export function SmoothScroll() {
  useEffect(() => {
    lenis = new Lenis({ autoRaf: true });
    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  return null;
}
