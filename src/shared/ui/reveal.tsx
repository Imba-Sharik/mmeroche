"use client";

import { useRef } from "react";
import { gsap, useGsapLayout } from "@/shared/lib";

/** Тайминг с референса fromanother.love */
const REVEAL = { duration: 1.4, ease: "power3.out" } as const;

interface RevealProps {
  children: React.ReactNode;
  /** Разбег между соседями, секунды */
  stagger?: number;
}

/**
 * Проявление блоков на входе в экран: прямые дети по очереди наливаются
 * прозрачностью. Ни подъёма, ни размытия — по просьбе клиента блок именно
 * проявляется, а не выезжает.
 *
 * Обёртка с `display: contents` не создаёт бокс — раскладка родителя (сетка,
 * флекс) не меняется, поэтому вешать можно прямо внутри грида.
 */
export function Reveal({ children, stagger = 0.05 }: RevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGsapLayout(() => {
    const root = rootRef.current;
    if (!root) return;

    const targets = gsap.utils.toArray<HTMLElement>(root.children);
    const trigger = targets[0];
    if (!trigger) return;

    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(targets, {
        autoAlpha: 0,
        stagger,
        ...REVEAL,
        scrollTrigger: { trigger, start: "top bottom-=33.33%", once: true },
      });
    });

    return () => media.revert();
  }, []);

  return (
    <div ref={rootRef} className="contents">
      {children}
    </div>
  );
}
