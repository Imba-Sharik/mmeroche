"use client";

import Image from "next/image";
import { useRef } from "react";
import { CONTACTS, linkTarget, NAV_ITEMS, PHONE_HREF } from "@/shared/config";
import { gsap, ScrollTrigger, useGsapLayout } from "@/shared/lib";
import { ButtonLink, ProgressiveBlur, scrollToSection } from "@/shared/ui";
import { MobileMenu } from "./MobileMenu";
import { SoundButton } from "./SoundButton";

/** Спуск шапки: тот же тайминг, что у остальных появлений на сайте */
const DROP = { duration: 0.7, ease: "power3.out", delay: 0.15 } as const;

/** Наклон лого из макета — как у лого Hero: 5° от `sm`, 8° на мобильном (Figma 336:107) */
const tilt = () => (window.matchMedia("(min-width: 640px)").matches ? -5 : -8);

/** Доля хода, за которую красное лого сменяется кремовым */
const SWAP = 0.12;

/**
 * Шапка — Figma nodes 222:1985 (над первым экраном) и 203:1202 (после него),
 * мобильная — 336:471: слева звук, справа бургер, меню открывается на весь
 * экран (`MobileMenu`). Мобильная раскладка — всё, что уже `lg`: на планшете
 * десктопной навигации тоже негде встать.
 *
 * Шапка спускается сразу, на загрузке. После первого экрана при прокрутке
 * вниз уходит, вверх — возвращается.
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
  const logoRef = useRef<HTMLAnchorElement>(null);

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
    // Страницы документов без Hero: лого переезжать неоткуда, оно сразу в шапке
    if (!hero || !heroLogo) {
      gsap.set(logo, { opacity: 1 });
      return () => media.revert();
    }

    /** Сколько надо прокрутить, чтобы лого Hero доехало под шапку */
    const range = () =>
      Math.max(1, heroLogo.getBoundingClientRect().bottom + window.scrollY - header.offsetHeight);

    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(logo, { rotation: tilt(), transformOrigin: "50% 50%" });

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

    /*
     * Вниз шапка уходит, вверх возвращается. Прячем только после переезда
     * лого — иначе оно летело бы в уезжающую шапку; на первом экране она
     * стоит всегда.
     */
    let hidden = false;
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const hide = self.direction === 1 && self.scroll() > range() + header.offsetHeight;
        if (hide === hidden) return;
        hidden = hide;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        // Лого с наклоном выступает ниже шапки (на мобильном 16 + 64px):
        // уезжаем до его нижнего края, иначе кончик торчит над страницей
        const top = header.getBoundingClientRect().top;
        const away = Math.max(header.offsetHeight, logo.getBoundingClientRect().bottom - top) + 2;
        gsap.to(header, {
          y: hide ? -away : 0,
          duration: reduced ? 0 : 0.5,
          ease: "power3.out",
          overwrite: "auto",
        });
      },
    });

    /* Без анимаций лого просто появляется в конце того же отрезка */
    media.add("(prefers-reduced-motion: reduce)", () => {
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
      <div className="@container relative mx-auto flex w-full max-w-480 items-center justify-between p-4 lg:px-[max(var(--container-inset),calc((100%-var(--container-max))/2))] lg:pt-5 lg:pb-10">
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

        <div className="pointer-events-auto relative lg:hidden">
          <SoundButton />
        </div>

        {/*
          Шесть пунктов по макету — 568px при 14px и гэпе 28, и они обязаны
          уместиться в левую половину шапки до лого (50cqw − 80px: полширины
          лого 54 и зазор). Шрифт и гэп считаем от ширины самой шапки, а не
          брейкпоинтами: те в rem, и при уменьшенном шрифте браузера крупное
          меню включалось на узком окне и наезжало на лого.

          30.6 — ширина подписей в em: 51 знак PT Mono по 0.6em. Поменяются
          пункты — пересчитать. Сначала ужимается гэп (28 → 11), потом шрифт
          (14 → 11): на 1024 выходит 11.7px.
        */}
        <nav
          className="text-mono-xs pointer-events-auto relative hidden items-center text-cream lg:flex"
          style={{
            fontSize: "clamp(11px, calc((50cqw - 135px) / 30.6), 14px)",
            gap: "clamp(11px, calc((50cqw - 508px) / 5), 28px)",
          }}
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(event) => {
                event.preventDefault();
                scrollToSection(item.id);
              }}
              className="whitespace-nowrap transition-colors hover:text-white"
            >
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

          На мобильном лого переезжает так же, место — по центру между звуком
          и бургером, 95×64, как в шапке мобильного меню (Figma node 336:505).
        */}
        <div
          ref={slotRef}
          className="absolute top-4 left-1/2 w-[95px] -translate-x-1/2 lg:top-3.5 lg:w-27"
        >
          {/*
            На главной — плавно наверх, со страниц документов — на главную.
            Обычная ссылка, а не `next/link`: переезд лого считается на загрузке.
          */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- нужна полная перезагрузка */}
          <a
            ref={logoRef}
            href="/"
            aria-label="Madame Roche — на главную"
            onClick={(event) => {
              if (!document.getElementById("hero")) return;
              event.preventDefault();
              scrollToSection("hero");
            }}
            className="pointer-events-auto block opacity-0"
          >
            <Image
              src="/images/common/roche-header.svg"
              alt=""
              width={108}
              height={73}
              unoptimized
              className="h-auto w-full"
            />
          </a>
        </div>

        <div className="pointer-events-auto relative lg:hidden">
          <MobileMenu />
        </div>

        <div className="pointer-events-auto relative ml-auto hidden items-center gap-4 lg:flex">
          {/*
            Правая группа тоже должна влезть в полшапки: с телефоном это ~450px,
            то есть шапка от 1060. Уже — телефон прячем, он есть в «Контактах».
          */}
          <ButtonLink href={PHONE_HREF} variant="ghost" size="sm" className="@max-[1060px]:hidden">
            {CONTACTS.phone}
          </ButtonLink>

          <SoundButton />

          <ButtonLink href={CONTACTS.bookingUrl} {...linkTarget(CONTACTS.bookingUrl)} size="sm">
            Забронировать стол
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
