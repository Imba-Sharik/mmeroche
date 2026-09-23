import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { CONTACTS } from "@/shared/config";
import { Button } from "@/shared/ui";
import { HeroReveal } from "./HeroReveal";
import { ScrollCue } from "./ScrollCue";

/** Первый экран — Figma node 222:1968, 1920×1080 */
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
        <div className="relative flex flex-1 flex-col items-center justify-center px-5 pt-20">
          {/*
            Лого: в Figma нода повёрнута на −5°, размер до поворота —
            386.673×261.022. Обёртка нужна шапке: от неё она считает, куда и
            во сколько раз ужать своё лого при прокрутке. Поворот держим на
            картинке, чтобы у обёртки была честная невращённая рамка, а
            прозрачность делят между собой два хозяина: проявление первого
            экрана — на картинке, растворение при скролле — на обёртке.
          */}
          <span className="js-hero-logo block w-[52%] max-w-97">
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
          <h1 className="js-hero-reveal text-display-xl -mt-[5%] text-center leading-none text-cream lg:-mt-12">
            {CONTACTS.tagline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <a
            href={CONTACTS.routeUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="js-hero-reveal text-mono-md mt-8 inline-flex items-center gap-1.5 p-2.5 text-center text-cream transition-colors hover:text-wine"
          >
            {CONTACTS.address}
            <ArrowUpRight className="size-5 shrink-0" strokeWidth={1.2} />
          </a>

          <div className="js-hero-reveal mt-8 flex flex-wrap items-center justify-center gap-4">
            {/* TODO: навесить переход, когда появится страница меню */}
            <Button variant="cream" size="lg" className="w-52.5">
              Посмотреть меню
            </Button>
            {/* TODO: открывать форму брони, когда появится features/booking */}
            <Button size="lg" className="w-52.5">
              Забронировать стол
            </Button>
          </div>
        </div>

        <div className="js-hero-reveal relative flex justify-center pb-30">
          <ScrollCue />
        </div>
      </HeroReveal>
    </section>
  );
}
