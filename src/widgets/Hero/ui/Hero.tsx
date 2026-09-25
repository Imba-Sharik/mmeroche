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
          <span className="js-hero-logo block w-[73%] max-w-97 sm:w-[52%]">
            <Image
              src="/images/hero/roche.svg"
              alt="Roche"
              width={387}
              height={261}
              priority
              unoptimized
              className="js-hero-reveal h-auto w-full -rotate-5"
            />
          </span>

          {/* Слоган заходит под хвост лого — Figma node 222:2005 */}
          <h1 className="js-hero-reveal text-display-xl -mt-7 text-center leading-none text-cream sm:-mt-[5%] lg:-mt-12">
            {CONTACTS.tagline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          {/*
            Адрес в одну строку, как в макете. Уже 360 шрифт идёт за шириной
            (4.45vw, до макетных 16px): на 320 при 16px строка не влезала.
          */}
          <a
            href={CONTACTS.routeUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="js-hero-reveal mt-6 inline-flex items-center gap-1.5 px-0 py-2.5 font-ui text-[length:min(4.45vw,16px)] leading-[1.2] whitespace-nowrap sm:px-2.5 text-center text-cream transition-colors hover:text-wine"
          >
            {CONTACTS.address}
            <ArrowUpRight className="size-5 shrink-0" strokeWidth={1.2} />
          </a>

          {/* На мобильном кнопки во всю ширину, одна под другой — Figma node 336:137 */}
          <div className="js-hero-reveal mt-6 flex w-full flex-col items-center justify-center gap-4 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap">
            {/* TODO: навесить переход, когда появится страница меню */}
            <Button variant="cream" size="lg" className="w-full sm:w-52.5">
              Посмотреть меню
            </Button>
            {/* TODO: открывать форму брони, когда появится features/booking */}
            <Button size="lg" className="w-full sm:w-52.5">
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
