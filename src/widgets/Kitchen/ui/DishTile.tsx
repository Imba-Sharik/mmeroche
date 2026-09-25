"use client";

import Image from "next/image";
import { useRef, type PointerEvent, type RefObject } from "react";
import { gsap, SplitText, useGsapLayout } from "@/shared/lib";
import { cn } from "@/shared/lib/utils";
import { DishPanel } from "./DishPanel";
import type { CardMotion } from "../model/card-motion";
import type { Dish } from "../model/dishes";

/** Кривая из тех же `power3/expo.out`, что и остальные появления на сайте */
const EASE = "ease-[cubic-bezier(0.16,1,0.3,1)]";

/**
 * Раскрытие без 3D: фото и карточка лежат друг на друге, карточку открываем
 * сдвигом, `clip-path` или прозрачностью, а фото откликается под ней.
 *
 * Шторка — два встречных сдвига: рамка едет снизу вверх, а содержимое внутри
 * неё ровно навстречу, поэтому карточка стоит на месте, а открывается край.
 * Раньше шторка была на `clip-path`, но его анимация перерисовывает всю
 * карточку каждый кадр — и карту под маской, и текст, — и строки текста
 * ехали рывками. Сдвиги двигает видеокарта, без перерисовки.
 *
 * `--x`/`--y` — точка, где курсор вошёл в клетку: из неё расходится `iris`.
 * С клавиатуры курсора нет, и круг идёт из центра.
 */
const MOTION: Record<
  Exclude<CardMotion, "flip">,
  { photo: string; panel: string; inner?: string }
> = {
  curtain: {
    photo: "group-hover:scale-105 group-focus-within:scale-105",
    panel: cn(
      "overflow-hidden translate-y-full transition-[translate] duration-700 will-change-transform",
      "group-hover:translate-y-0 group-focus-within:translate-y-0",
    ),
    inner: cn(
      "-translate-y-full transition-[translate] duration-700 will-change-transform",
      "group-hover:translate-y-0 group-focus-within:translate-y-0",
    ),
  },
  iris: {
    photo: "group-hover:scale-105 group-focus-within:scale-105",
    panel: cn(
      "transition-[clip-path] duration-700 [clip-path:circle(0%_at_var(--x,50%)_var(--y,50%))]",
      "group-hover:[clip-path:circle(150%_at_var(--x,50%)_var(--y,50%))]",
      "group-focus-within:[clip-path:circle(150%_at_var(--x,50%)_var(--y,50%))]",
    ),
  },
  fade: {
    photo: cn(
      "group-hover:scale-110 group-hover:blur-md",
      "group-focus-within:scale-110 group-focus-within:blur-md",
    ),
    panel: cn(
      "translate-y-3 opacity-0 transition-[opacity,translate] duration-500",
      "group-hover:translate-y-0 group-hover:opacity-100",
      "group-focus-within:translate-y-0 group-focus-within:opacity-100",
    ),
  },
};

/** Запоминаем, откуда вошёл и куда ушёл курсор: круг `iris` раскрывается и схлопывается туда */
function trackPointer(event: PointerEvent<HTMLDivElement>) {
  const tile = event.currentTarget;
  const rect = tile.getBoundingClientRect();
  tile.style.setProperty("--x", `${event.clientX - rect.left}px`);
  tile.style.setProperty("--y", `${event.clientY - rect.top}px`);
}

/** Текст ждёт, пока карточка откроется хотя бы наполовину, секунды */
const TEXT_DELAY = 0.25;

/**
 * Текст карточки появляется построчно: каждая строка выезжает снизу из-под
 * своей маски, за ними проявляется кнопка. Закрывается вдвое быстрее — уйти
 * он должен раньше, чем схлопнется карточка.
 *
 * Открыта карточка, пока на клетке курсор или фокус, — ровно как в CSS
 * (`group-hover` + `group-focus-within`). Поэтому при уходе курсора текст
 * остаётся, если клетка в фокусе: иначе после тапа он пропадал бы из
 * раскрытой карточки.
 *
 * Против рывков строкам нужны три вещи. Chrome прищёлкивает текст к целым
 * пикселям, чтобы он был чётким, и в хвосте `power3.out`, где строка ползёт
 * на доли пикселя за кадр, она прыгает по пикселю. Прищёлкивание снимают
 * `will-change: transform` (строка живёт своим слоем) и поворот на 0.01° —
 * повёрнутый текст к сетке уже не выровнять. `force3D: true` — чтобы GSAP
 * в конце твина не переключался на плоский сдвиг: текст перерисовался бы
 * и прыгнул на полпикселя. Так советуют на форуме GSAP:
 * https://gsap.com/community/forums/topic/29876-line-animation-stutter-issue-at-the-easeout/
 *
 * Строки режем `autoSplit`: SplitText пересобирает их сам при ресайзе и
 * догрузке шрифта. Кнопку гасим только прозрачностью, без `visibility`, —
 * иначе её нельзя было бы достать табом, пока текст не доехал.
 */
function useDishText(tileRef: RefObject<HTMLDivElement | null>) {
  useGsapLayout(() => {
    const tile = tileRef.current;
    if (!tile) return;

    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const cta = tile.querySelector(".js-dish-cta");
      let timeline: gsap.core.Timeline | undefined;

      const split = SplitText.create(tile.querySelectorAll(".js-dish-lines"), {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          gsap.set(self.lines, { willChange: "transform", rotation: 0.01, force3D: true });

          timeline = gsap
            .timeline({ paused: true, defaults: { ease: "power3.out" } })
            .from(
              self.lines,
              { yPercent: 100, duration: 0.9, stagger: 0.06, force3D: true },
              TEXT_DELAY,
            )
            .from(cta, { opacity: 0, duration: 0.6 }, "<0.2");
          return timeline;
        },
      });

      const open = () => timeline?.timeScale(1).play();
      const close = () => {
        if (tile.matches(":hover, :focus-within")) return;
        timeline?.timeScale(2).reverse();
      };
      // `focusout` приходит раньше, чем фокус сменится, — проверяем на следующем кадре
      const closeAfterBlur = () => requestAnimationFrame(close);

      tile.addEventListener("pointerenter", open);
      tile.addEventListener("pointerleave", close);
      tile.addEventListener("focusin", open);
      tile.addEventListener("focusout", closeAfterBlur);

      return () => {
        tile.removeEventListener("pointerenter", open);
        tile.removeEventListener("pointerleave", close);
        tile.removeEventListener("focusin", open);
        tile.removeEventListener("focusout", closeAfterBlur);
        split.revert();
      };
    });

    return () => media.revert();
  }, []);
}

/**
 * Клетка ленты: лежит фотографией, по наведению раскрывается карточкой блюда.
 * Как именно — решает `motion`, см. `CARD_MOTIONS`.
 *
 * Клетка фокусируемая, а раскрытие висит на `focus-within` — так карточка
 * открывается и с клавиатуры, и по тапу на тач-экране, где наведения нет.
 */
export function DishTile({ dish, motion }: { dish: Dish; motion: CardMotion }) {
  const tileRef = useRef<HTMLDivElement>(null);
  useDishText(tileRef);

  const photo = (
    <>
      <Image
        src={dish.photo}
        alt={dish.alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 460px"
        className={cn(
          "object-cover",
          motion !== "flip" &&
            cn(
              "transition-[scale,filter] duration-700 motion-reduce:transition-none",
              EASE,
              MOTION[motion].photo,
            ),
        )}
      />

      {/*
        Курсор из макета (Figma node 222:2047) — намёк, что клетку можно
        раскрыть. В макете он лежит внутри уже раскрытой карточки, у нас
        карточка закрыта, поэтому подсказка переехала на лицевую сторону.
      */}
      {dish.hint && (
        <Image
          src="/images/kitchen/cursor.svg"
          alt=""
          aria-hidden
          width={31}
          height={31}
          unoptimized
          className="absolute top-[57.9%] left-[42.3%] w-[6.7%] rotate-5 transition-opacity duration-300 group-hover:opacity-0"
        />
      )}
    </>
  );

  /*
   * Переворот — настоящий 3D: у клетки своя перспектива, внутренний слой
   * хранит объём (`transform-3d`), обе стороны прячут изнанку.
   */
  if (motion === "flip") {
    return (
      <div
        ref={tileRef}
        tabIndex={0}
        className="group relative aspect-460/320 rounded-xl outline-none perspective-distant focus-visible:ring-1 focus-visible:ring-ink-muted"
      >
        <div
          className={cn(
            "relative size-full transition-transform duration-700 transform-3d group-focus-within:transform-[rotateY(180deg)] group-hover:transform-[rotateY(180deg)] motion-reduce:transition-none",
            EASE,
          )}
        >
          <div className="absolute inset-0 overflow-hidden rounded-xl backface-hidden">{photo}</div>
          <div className="absolute inset-0 backface-hidden transform-[rotateY(180deg)]">
            <DishPanel dish={dish} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={tileRef}
      tabIndex={0}
      onPointerEnter={trackPointer}
      onPointerLeave={trackPointer}
      className="group relative aspect-460/320 rounded-xl outline-none focus-visible:ring-1 focus-visible:ring-ink-muted"
    >
      {/*
        Режем `clip-path` со скруглением, а не `overflow-hidden` + `rounded`:
        пока идёт анимация, фото и карточка живут на своих слоях видеокарты,
        и Chrome обрезает такие слои по скруглённым углам неточно — в углах
        вылезал край фото. `clip-path` режет уже собранную картинку.
        Обрезка на внутреннем слое, а не на клетке, — иначе срезало бы
        кольцо фокуса.
      */}
      <div className="absolute inset-0 isolate [clip-path:inset(0_round_var(--radius-xl))]">
        {/*
          Раскрылась карточка — фото под ней убираем совсем. Chrome сглаживает
          край слоя карточки и после анимации, и в этих пикселях по периметру
          оставалась кромка фото. Возвращается фото мгновенно, без задержки, —
          раньше, чем карточка начнёт закрываться.
        */}
        <div className="absolute inset-0 transition-opacity duration-0 group-hover:opacity-0 group-hover:delay-700 group-focus-within:opacity-0 group-focus-within:delay-700">
          {photo}
        </div>

        {/*
          Карточка на пиксель шире клетки и без своего скругления: иначе её
          край сглаживается отдельно от края клетки, и по периметру
          просвечивает фото, пока оно ещё не спрятано.
        */}
        <div
          className={cn(
            "absolute -inset-px motion-reduce:transition-none",
            EASE,
            MOTION[motion].panel,
          )}
        >
          <div
            className={cn("size-full motion-reduce:transition-none", EASE, MOTION[motion].inner)}
          >
            <DishPanel dish={dish} className="rounded-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
