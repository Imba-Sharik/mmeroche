import Image from "next/image";
import { DishPanel } from "./DishPanel";
import type { Dish } from "../model/dishes";

/**
 * Клетка ленты: лежит фотографией, по наведению разворачивается карточкой.
 *
 * Переворот — настоящий 3D: у клетки своя перспектива, внутренний слой хранит
 * объём (`transform-3d`), обе стороны прячут изнанку. Клетка фокусируемая, а
 * раскрытие висит на `focus-within` — так карточка открывается и с клавиатуры,
 * и по тапу на тач-экране, где наведения нет.
 */
export function DishTile({ dish }: { dish: Dish }) {
  return (
    <div
      tabIndex={0}
      className="group relative aspect-460/320 rounded-xl outline-none perspective-distant focus-visible:ring-1 focus-visible:ring-ink-muted"
    >
      <div className="relative size-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform-3d group-focus-within:transform-[rotateY(180deg)] group-hover:transform-[rotateY(180deg)] motion-reduce:transition-none">
        <div className="absolute inset-0 overflow-hidden rounded-xl backface-hidden">
          <Image
            src={dish.photo}
            alt={dish.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 460px"
            className="object-cover"
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
        </div>

        <div className="absolute inset-0 backface-hidden transform-[rotateY(180deg)]">
          <DishPanel dish={dish} />
        </div>
      </div>
    </div>
  );
}
