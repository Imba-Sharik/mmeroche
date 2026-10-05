"use client";

import { ArrowDown } from "lucide-react";
import { scrollToSection } from "@/shared/ui";

/** Кнопка «ЛИСТАТЬ» — Figma node 222:2007 */
export function ScrollCue() {
  return (
    <button
      type="button"
      onClick={() => scrollToSection("legend")}
      className="text-mono-xs flex cursor-pointer items-center gap-1 px-5.5 py-3 text-dop transition-colors hover:text-cream"
    >
      <ArrowDown className="size-4" strokeWidth={1} />
      ЛИСТАТЬ
    </button>
  );
}
