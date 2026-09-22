"use client";

import { ArrowDown } from "lucide-react";
import { getLenis } from "@/shared/ui";

/** Кнопка «ЛИСТАТЬ» — Figma node 222:2007 */
export function ScrollCue() {
  const scrollToNext = () => {
    const target = document.getElementById("legend");
    if (!target) return;

    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToNext}
      className="text-mono-xs flex items-center gap-1 px-5.5 py-3 text-ink-dim transition-colors hover:text-cream"
    >
      <ArrowDown className="size-4" strokeWidth={1} />
      ЛИСТАТЬ
    </button>
  );
}
