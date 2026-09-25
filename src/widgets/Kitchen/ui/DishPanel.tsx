import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";
import type { Dish } from "../model/dishes";

/**
 * Карта происхождения растворяется к краям плашки — Figma node 222:2043.
 *
 * В макете это четыре градиента к `#131313` поверх карты. Повторять их нельзя:
 * они заливают свой прямоугольник, а карточка под ними в этом углу ближе к
 * `#101010` — по периметру плашки вылезала кромка. Поэтому вместо заливки
 * гасим саму карту маской: фон карточки остаётся нетронутым, шва нет.
 *
 * Непрозрачность 7% подобрана под макет: там карта идёт в полную силу, но
 * градиенты перекрывают плашку процентов на 94, и в центре остаётся как раз
 * столько.
 */
const ORIGIN_MASK = "radial-gradient(ellipse at center, #000 25%, transparent 85%)";

interface DishPanelProps {
  dish: Dish;
  className?: string;
}

/**
 * Раскрытая карточка блюда — Figma node 222:2042, 460×320.
 *
 * `js-dish-lines` и `js-dish-cta` — хуки для появления текста, см. `DishTile`.
 */
export function DishPanel({ dish, className }: DishPanelProps) {
  return (
    <article
      className={cn("relative size-full overflow-hidden rounded-xl", className)}
      style={{
        backgroundImage: "linear-gradient(127.38deg, rgb(27,27,27) 0%, rgb(16,16,16) 100%)",
      }}
    >
      {/*
        В макете колонка текста 334px, но там и описание в три строки. Описания
        из меню — 250–310 знаков, поэтому текст идёт на всю ширину карточки.
        Мобильная карточка — Figma node 336:191, 328×400: поля 16/24, заголовок
        20px с межстрочным 1.2, описание 14px с 1.4.

        Блок текста кончается над кнопкой и плашкой страны (`bottom-28`, 112px
        — плашка 100 и зазор), а описание внутри прокручивается: на узком
        телефоне заголовок встаёт в три строки, и текст наезжал на «Хочу».
        Низ описания затухает, чтобы было видно, что текст продолжается; под
        затуханием отступ в строку — последнюю можно докрутить до чистого фона.
        Колесо внутри описания Lenis не перехватывает — `data-lenis-prevent`.
      */}
      <div className="absolute inset-x-4 top-6 bottom-28 flex flex-col gap-3 text-cream lg:inset-x-8 lg:top-8 lg:gap-4">
        <h3 className="js-dish-lines text-display-sm shrink-0 leading-[1.2] lg:leading-none">
          {dish.title}
        </h3>
        <div
          data-lenis-prevent
          className="min-h-0 overflow-y-auto overscroll-contain [mask-image:linear-gradient(to_bottom,#000_calc(100%-1.5em),transparent)] [scrollbar-width:none]"
        >
          <p className="js-dish-lines text-mono-sm pb-[1.5em] leading-[1.4] text-dop lg:leading-[1.2]">
            {dish.description}
          </p>
        </div>
      </div>

      {/* TODO: вести на блюдо в меню, когда появится страница */}
      {/*
        Появление анимируем на обёртке, а не на кнопке: у `Button` свой
        `transition-opacity` для наведения, и он догонял каждый кадр GSAP —
        кнопка проявлялась рывками.
      */}
      <div className="js-dish-cta absolute bottom-6 left-4 lg:bottom-8 lg:left-8">
        <Button variant="outline">
          Хочу
          <ArrowRight className="size-4" strokeWidth={1.5} />
        </Button>
      </div>

      {/*
        Откуда блюдо — Figma node 241:1114, плашка 154×101 в углу карточки.
        На мобильном карточка вертикальная, и доли дали бы вытянутую плашку —
        там она просто 150×100 (Figma node 336:199).
      */}
      <div aria-hidden className="absolute right-0 bottom-0 h-25 w-37.5 lg:h-[31.6%] lg:w-[33.5%]">
        <Image
          src={dish.origin.map}
          alt=""
          fill
          sizes="160px"
          className="object-cover opacity-[0.07]"
          style={{ maskImage: ORIGIN_MASK, WebkitMaskImage: ORIGIN_MASK }}
        />
        <Image
          src="/images/kitchen/map-pin.svg"
          alt=""
          width={20}
          height={23}
          unoptimized
          className="absolute top-[22.8%] left-[44.2%] w-[13%]"
        />
        <span className="text-display-xs absolute inset-x-0 top-[50.5%] text-center text-cream">
          {dish.origin.label}
        </span>
      </div>
    </article>
  );
}
