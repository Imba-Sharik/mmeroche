"use client";

import Image from "next/image";
import { Music2 } from "lucide-react";
import { useRef } from "react";
import { BOOKING_PHONE_HREF, CONTACTS, NAV_ITEMS } from "@/shared/config";
import { gsap, ScrollTrigger, useGsapLayout } from "@/shared/lib";
import { Button, ButtonLink, ProgressiveBlur } from "@/shared/ui";

/** Спуск шапки: тот же тайминг, что у остальных появлений на сайте */
const DROP = { duration: 0.7, ease: "power3.out", delay: 0.15 } as const;

/** Наклон лого из макета, одинаковый и в Hero, и в шапке */
const TILT = -5;

/** Доля хода, за которую красное лого сменяется кремовым */
const SWAP = 0.12;

/**
 * Шапка — Figma nodes 222:1985 (над первым экраном) и 203:1202 (после него).
 *
 * Шапка спускается сразу, на загрузке, и дальше висит наверху.
 *
 * Лого переезжает из первого экрана в шапку по мере прокрутки: кремовая копия
 * в шапке стартует ровно поверх красной из Hero, ужимается до своего места и
 * проявляется, а красная растворяется — со стороны это одно лого, которое
 * уменьшается и меняет цвет. Ход кончается там, где лого Hero ушло бы под
 * шапку.
 *
 * Геометрию считаем каждый кадр от живых рамок обоих элементов, а не от
 * замеров при старте: так переезд переживает ресайз, и не важно, что шапка
 * в этот момент сама едет вниз.
 */
export function SiteHeader() {
  const ref = useRef<HTMLElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLSpanElement>(null);

  useGsapLayout(() => {
    const header = ref.current;
    const slot = slotRef.current;
    const logo = logoRef.current;
    if (!header || !slot || !logo) return;

    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(header, { yPercent: -100, ...DROP });
    });

    const hero = document.getElementById("hero");
    const heroLogo = document.querySelector<HTMLElement>(".js-hero-logo");
    if (!hero || !heroLogo) return () => media.revert();

    /** Сколько надо прокрутить, чтобы лого Hero доехало под шапку */
    const range = () =>
      Math.max(1, heroLogo.getBoundingClientRect().bottom + window.scrollY - header.offsetHeight);

    media.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.set(logo, { rotation: TILT, transformOrigin: "50% 50%" });

      const apply = (progress: number) => {
        const from = heroLogo.getBoundingClientRect();
        const to = slot.getBoundingClientRect();
        const left = 1 - progress;

        /*
         * Цвет меняем в самом начале хода, а не по всей его длине: пока обе
         * копии полупрозрачны, видно, что лого два. За первые проценты
         * прокрутки красная уходит совсем, дальше летит только кремовая.
         */
        const fade = gsap.utils.clamp(0, 1, progress / SWAP);

        gsap.set(logo, {
          x: (from.left + from.width / 2 - (to.left + to.width / 2)) * left,
          y: (from.top + from.height / 2 - (to.top + to.height / 2)) * left,
          scale: 1 + (from.width / to.width - 1) * left,
          autoAlpha: fade,
        });
        gsap.set(heroLogo, { autoAlpha: 1 - fade });
      };

      ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: () => `+=${range()}`,
        onUpdate: (self) => apply(self.progress),
        onRefresh: (self) => apply(self.progress),
        onLeave: () => apply(1),
        onLeaveBack: () => apply(0),
        invalidateOnRefresh: true,
      });
    });

    /* Без анимаций лого просто появляется в конце того же отрезка */
    media.add("(min-width: 1024px) and (prefers-reduced-motion: reduce)", () => {
      ScrollTrigger.create({
        trigger: hero,
        start: () => `top top+=-${range()}`,
        onEnter: () => gsap.set(logo, { autoAlpha: 1 }),
        onLeaveBack: () => gsap.set(logo, { autoAlpha: 0 }),
      });
    });

    return () => media.revert();
  }, []);

  return (
    <header ref={ref} className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="relative mx-auto flex w-full max-w-480 items-center justify-between px-5 pt-5 pb-10 lg:px-57">
        {/*
          Фон шапки: сперва прогрессивное размытие (см. `ProgressiveBlur`), поверх —
          линейный градиент чёрного. В Figma это заливка ноды, `#000000` сверху
          с непрозрачностью 39% и в ноль книзу; раньше тут лежала растровая
          копия того же градиента.
        */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <ProgressiveBlur side="top" className="absolute inset-0" />
          <div className="absolute inset-0 bg-linear-to-b from-black/39 to-transparent" />
        </div>

        <nav className="text-mono-sm pointer-events-auto relative hidden items-center gap-7 text-cream lg:flex">
          {NAV_ITEMS.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="transition-colors hover:text-wine">
              {item.label}
            </a>
          ))}
        </nav>

        {/*
          Место лого в шапке — Figma node 203:1217. Сама рамка не трансформируется:
          по ней считается переезд, поэтому наклон и всё движение живут на
          внутреннем слое.

          В макете лого на 50px правее середины; ставим по центру — на других
          ширинах жёсткое смещение всё равно разъедется.
        */}
        <div
          ref={slotRef}
          className="absolute top-3.5 left-1/2 hidden w-27 -translate-x-1/2 lg:block"
        >
          <span ref={logoRef} className="block opacity-0">
            <Image
              src="/images/common/roche-header.svg"
              alt="Madame Roche"
              width={108}
              height={73}
              unoptimized
              className="h-auto w-full"
            />
          </span>
        </div>

        <div className="pointer-events-auto relative ml-auto flex items-center gap-4">
          <ButtonLink href={BOOKING_PHONE_HREF} variant="ghost" size="sm" className="hidden sm:flex">
            {CONTACTS.bookingPhone}
          </ButtonLink>

          {/* TODO: подключить к фоновому аудио, когда появится features/ambient-sound */}
          <button
            type="button"
            aria-label="Включить звук"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-ink-muted text-cream transition-colors hover:border-cream"
          >
            <Music2 className="size-4" strokeWidth={1.5} />
          </button>

          {/* TODO: открывать форму брони, когда появится features/booking */}
          <Button size="sm">Забронировать стол</Button>
        </div>
      </div>
    </header>
  );
}
