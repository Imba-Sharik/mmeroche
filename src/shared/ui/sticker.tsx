"use client";

import { useRef, useSyncExternalStore } from "react";
import { cn, gsap, ScrollTrigger, useGsapLayout } from "@/shared/lib";
import "./sticker.css";

/** Полос в каждой цепочке — столько же, сколько у оригинала на ecopanels.pro */
const STRIPS = 12;

/**
 * На сенсорных экранах полос вдвое меньше, и вдвое шире (`--st-strips`):
 * каждый кадр анимации браузер перерисовывает все грани с их `clip-path`,
 * и полсотни граней на стикер iPhone не тянул — стикеры клеились рывками.
 * На маленьком стикере вдвое грубее дуга не заметна.
 */
const STRIPS_TOUCH = 6;

const TOUCH_QUERY = "(hover: none)";

const subscribeTouch = (onChange: () => void) => {
  const query = window.matchMedia(TOUCH_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

const useStrips = () =>
  useSyncExternalStore(
    subscribeTouch,
    () => (window.matchMedia(TOUCH_QUERY).matches ? STRIPS_TOUCH : STRIPS),
    () => STRIPS,
  );

interface StickerProps {
  src: string;
  /** Пропорция кадра, ширина / высота */
  ratio: number;
  /**
   * `true` — клеится сам, когда до него доезжает экран. `false` — ждёт
   * команды: родитель ставит `data-stuck` на `.sticker` (так в «Интерьере»
   * стикер ждёт, пока раскроется кадр под ним). Спрятан в обоих случаях
   * одинаково — атрибутом `data-armed`.
   */
  auto?: boolean;
  /** Задержка старта, секунды */
  delay?: number;
  className?: string;
}

const Faces = ({ last }: { last: boolean }) => (
  <>
    <span className={cn("sticker__face", last && "sticker__face--last")}>
      <span className="sticker__surface" />
    </span>
    <span className={cn("sticker__face sticker__face--back", last && "sticker__face--last")}>
      <span className="sticker__surface" />
    </span>
  </>
);

/** Цепочка полос: каждая следующая вложена в предыдущую и гнётся вместе с ней */
const chain = (tail: boolean, strips: number, i = 0): React.ReactNode => (
  <span
    className={cn("sticker__hinge", tail && "sticker__hinge--tail")}
    style={{ "--i": i } as React.CSSProperties}
  >
    <Faces last={i === strips - 1} />
    {i < strips - 1 && chain(tail, strips, i + 1)}
  </span>
);

/**
 * Стикер, который «приклеивается»: падает сверху, ложится и прижимается
 * к стене, края раскатываются от середины. Механика — в `sticker.css`.
 *
 * Заполняет родителя (`absolute inset-0`), родитель задаёт место и размер.
 * Кадр рисуется фоном на гранях (`--st-art`), а не `next/image`: граней
 * пятьдесят, и каждая показывает свой кусок того же кадра. Кадр вписан
 * в квадрат `contain`, как у оригинала, — у вытянутых кадров квадрат шире
 * рамки и выступает за неё поровну с двух сторон.
 *
 * `opacity` и `filter` на предках не мешают: 3D-цепочка полос живёт внутри
 * контейнера, а у него ни того, ни другого нет.
 */
export function Sticker({ src, ratio, auto = true, delay = 0, className }: StickerProps) {
  const stickerRef = useRef<HTMLSpanElement>(null);
  const strips = useStrips();

  useGsapLayout(() => {
    const sticker = stickerRef.current;
    if (!sticker) return;

    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      sticker.setAttribute("data-armed", "");

      // Пока идёт анимация — 3D, как лёг — плоская копия (см. `.sticker__flat`).
      // `roll` кончается последним; `fade` стартует первым, в том числе
      // при повторном приклеивании в «Интерьере».
      const onStart = (event: AnimationEvent) => {
        if (event.animationName === "sticker-fade") sticker.removeAttribute("data-settled");
      };
      const onEnd = (event: AnimationEvent) => {
        if (event.animationName === "sticker-roll") sticker.setAttribute("data-settled", "");
      };
      sticker.addEventListener("animationstart", onStart);
      sticker.addEventListener("animationend", onEnd);

      const trigger = auto
        ? ScrollTrigger.create({
            trigger: sticker,
            start: "top bottom-=33.33%",
            once: true,
            onEnter: () => sticker.setAttribute("data-stuck", ""),
          })
        : undefined;

      return () => {
        trigger?.kill();
        sticker.removeEventListener("animationstart", onStart);
        sticker.removeEventListener("animationend", onEnd);
        sticker.removeAttribute("data-armed");
        sticker.removeAttribute("data-settled");
        sticker.removeAttribute("data-stuck");
      };
    });

    return () => media.revert();
  }, [auto]);

  return (
    <span aria-hidden className={cn("sticker-frame", className)}>
      <span
        ref={stickerRef}
        className="sticker"
        style={
          {
            "--st-art": `url("${src}")`,
            "--st-square": Math.max(1, 1 / ratio),
            "--st-delay": `${delay}s`,
            "--st-strips": strips,
          } as React.CSSProperties
        }
      >
        <span className="sticker__flat" />
        <span className="sticker__container">
          <span className="sticker__main">
            <span className="sticker__surface" />
          </span>
          {chain(false, strips)}
          {chain(true, strips)}
        </span>
      </span>
    </span>
  );
}
