import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { CONTACTS } from "@/shared/config";
import { Button } from "@/shared/ui";
import { HeroReveal } from "./HeroReveal";
import { ScrollCue } from "./ScrollCue";

/** Первый экран — Figma node 222:1968, 1920×1080; мобильный — 336:105, 360×800 */
export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex h-svh min-h-150 w-full flex-col overflow-hidden bg-noir"
    >
      {/* Снимок зала под затемнением — Figma node 222:1969 (Hero/scrim) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Image
          src="/images/hero/scrim.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[55%_50%]"
        />
        <div className="absolute inset-0 bg-noir/30" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent from-45% to-noir" />
      </div>

      <HeroReveal>
        {/*
          Колонка макета: лого → слоган → адрес → кнопки. Стопка стоит не по
          центру экрана, а выше: верхний отступ 80px «опускает» её ровно на
          макетные 250px от верха секции.
        */}
        <div className="relative flex flex-1 flex-col items-center justify-center px-4 pt-20 sm:px-5">
          {/*
            Лого: в Figma нода повёрнута на −5°, размер до поворота —
            386.673×261.022. Обёртка нужна шапке: от неё она считает, куда и
            во сколько раз ужать своё лого при прокрутке. Поворот держим на
            картинке, чтобы у обёртки была честная невращённая рамка, а
            прозрачность делят между собой два хозяина: проявление первого
            экрана — на картинке, растворение при скролле — на обёртке.
          */}
          {/*
            Мобильный — Figma node 336:107: тот же рисунок 208.8×141, но наклон
            8°, а не 5. Ширина и нахлёст слогана — в долях колонки (328 в
            макете), а не в пикселях: на 320 шрифт мельчает, и фиксированный
            нахлёст подтягивал слоган к лого ближе, чем в макете. В макете
            нахлёст 13px из 328 (низ рамки лого 309, слоган с 296); по просьбе
            Игоря слоган отодвинут — 5px.
          */}
          <span className="js-hero-logo block w-[63.66%] max-w-97 sm:w-[52%]">
            <Image
              src="/images/hero/roche.svg"
              alt="Roche"
              width={387}
              height={261}
              priority
              unoptimized
              className="js-hero-reveal h-auto w-full -rotate-8 sm:-rotate-5"
            />
          </span>

          {/* Слоган заходит под хвост лого — Figma node 222:2005 */}
          <h1 className="js-hero-reveal text-display-xl -mt-[1.5%] text-center leading-none text-cream sm:-mt-[5%] lg:-mt-12">
            {CONTACTS.tagline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          {/*
            Адрес в одну строку. На мобильном 14px — Figma node 336:143: у PT Mono
            знак ровно 0.6em, строка со стрелкой и полями ссылки — 265px.
          */}
          <a
            href={CONTACTS.routeUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="js-hero-reveal text-mono-sm mt-6 inline-flex items-center gap-1.5 p-2.5 whitespace-nowrap sm:text-mono-md text-center text-cream transition-colors hover:text-wine"
          >
            {CONTACTS.address}
            <ArrowUpRight className="size-5 shrink-0" strokeWidth={1.2} />
          </a>

          {/* На мобильном кнопки 192×41 одна под другой, текст 14px — Figma node 336:137 */}
          <div className="js-hero-reveal mt-6 flex flex-col items-center justify-center gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4">
            {/* TODO: навесить переход, когда появится страница меню */}
            <Button
              variant="cream"
              size="lg"
              className="text-mono-sm h-10.25 w-48 sm:text-mono-md sm:h-11.5 sm:w-52.5"
            >
              Посмотреть меню
            </Button>
            {/* TODO: открывать форму брони, когда появится features/booking */}
            <Button
              size="lg"
              className="text-mono-sm h-10.25 w-48 sm:text-mono-md sm:h-11.5 sm:w-52.5"
            >
              Забронировать стол
            </Button>
          </div>
        </div>

        <div className="js-hero-reveal relative flex justify-center pb-15 lg:pb-30">
          <ScrollCue />
        </div>
      </HeroReveal>
    </section>
  );
}
