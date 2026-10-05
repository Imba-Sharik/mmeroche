"use client";

import { Music2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { toggleSound, useSoundEnabled } from "../model/sound";

/**
 * Кнопка звука — та же, что в шапке, рамка `ink-muted`. В макете у неё одно
 * состояние; выключенное (по умолчанию) — нота приглушена и перечёркнута.
 */
export function SoundButton() {
  const enabled = useSoundEnabled();

  return (
    <button
      type="button"
      aria-label={enabled ? "Выключить звук" : "Включить звук"}
      aria-pressed={enabled}
      onClick={toggleSound}
      className={cn(
        "relative flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-ink-muted transition-colors hover:border-cream",
        enabled ? "text-cream" : "text-ink-muted hover:text-cream",
      )}
    >
      <Music2 className="size-4" strokeWidth={1.5} />
      {/* Косая черта поверх ноты — как у иконок «выключено» в lucide */}
      <span
        aria-hidden
        className={cn(
          "absolute h-px w-5 -rotate-45 bg-current transition-opacity",
          enabled && "opacity-0",
        )}
      />
    </button>
  );
}
