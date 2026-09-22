import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { CONTACTS } from "@/shared/config";
import { Button } from "@/shared/ui";
import { HeroReveal } from "./HeroReveal";
import { ScrollCue } from "./ScrollCue";

/** Первый экран — Figma node 222:1968, 1920×1080 */
export function Hero() {
  return (
    <section className="relative flex h-svh min-h-150 w-full flex-col overflow-hidden bg-noir">
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
          Колонка макета: лого → слоган → адрес → кнопки. В макете стопка стоит
          на 42px выше середины экрана — отсюда нижний отступ вдвое больше.
        */}
        <div className="relative flex flex-1 flex-col items-center justify-center px-5 pt-24 pb-21">
          {/* Лого: в Figma нода повёрнута на −5°, размер до поворота — 386.673×261.022 */}
          <Image
            src="/images/hero/roche.svg"
            alt="Roche"
            width={387}
            height={261}
            priority
            unoptimized
            className="js-hero-reveal h-auto w-[52%] max-w-97 -rotate-5"
          />

          {/* Слоган заходит под хвост лого — Figma node 222:2005 */}
          <h1 className="js-hero-reveal text-display-lg -mt-[3.5%] text-center text-cream lg:-mt-10">
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
            className="js-hero-reveal text-mono-md mt-6 inline-flex items-center gap-1.5 p-2.5 text-center text-cream transition-colors hover:text-wine"
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

        <div className="js-hero-reveal relative flex justify-center pb-12">
          <ScrollCue />
        </div>
      </HeroReveal>
    </section>
  );
}
