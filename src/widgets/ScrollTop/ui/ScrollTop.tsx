"use client";

import { ArrowUp } from "lucide-react";
import { useState } from "react";
import { ScrollTrigger, useGsapLayout } from "@/shared/lib";
import { cn } from "@/shared/lib/utils";
import { scrollToSection } from "@/shared/ui";

/**
 * Кнопка «наверх» — Figma node 450:25, 41×41 в правом нижнем углу.
 *
 * Показываем, как и шапку, только когда прокручивают вверх, и не на первом
 * экране — там она ни к чему. Вниз — уезжает. Выезжает справа из-за края
 * экрана с лёгким перелётом; сдвиг в 250% своей ширины уводит её за край
 * при любом отступе (16px на мобильном, 40 на десктопе).
 */
export function ScrollTop() {
  const [visible, setVisible] = useState(false);

  useGsapLayout(() => {
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) =>
        setVisible(self.direction === -1 && self.scroll() > window.innerHeight),
    });
  }, []);

  return (
    <button
      type="button"
      aria-label="Наверх"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={() => scrollToSection("hero")}
      className={cn(
        "fixed right-4 bottom-4 z-40 flex size-10.25 cursor-pointer items-center justify-center rounded-lg border-[0.5px] border-ink-muted bg-cream/10 text-cream backdrop-blur-[5px] transition-[translate,background-color] hover:bg-cream/20 motion-reduce:transition-none lg:right-10 lg:bottom-10",
        visible
          ? "translate-x-0 duration-700 ease-[cubic-bezier(0.34,1.4,0.64,1)]"
          : "pointer-events-none translate-x-[250%] duration-500 ease-in",
      )}
    >
      <ArrowUp className="size-4" strokeWidth={1.5} />
    </button>
  );
}
