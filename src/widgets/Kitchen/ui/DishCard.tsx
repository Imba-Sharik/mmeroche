import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";

/** Уходы плашки происхождения в фон карточки — Figma node 222:2043 */
const ORIGIN_GRADIENTS = [
  "linear-gradient(270deg, rgb(19,19,19) 0%, rgba(19,19,19,0) 100%)",
  "linear-gradient(270deg, rgba(19,19,19,0) 0%, rgb(19,19,19) 100%)",
  "linear-gradient(180deg, rgba(19,19,19,0) 0%, rgb(19,19,19) 100%)",
  "linear-gradient(180deg, rgb(19,19,19) 0%, rgba(19,19,19,0) 100%)",
].join(", ");

/**
 * Карточка блюда в ленте — Figma node 222:2042, 460×320.
 * TODO: «карбонара» — единственное блюдо из макета, остальное ждёт меню кухни.
 */
export function DishCard({ className }: { className?: string }) {
  return (
    <article
      className={cn("relative aspect-460/320 overflow-hidden rounded-xl", className)}
      style={{ backgroundImage: "linear-gradient(127.38deg, rgb(27,27,27) 0%, rgb(16,16,16) 100%)" }}
    >
      <div className="absolute top-8 left-8 flex max-w-83.5 flex-col gap-4 text-cream">
        <h3 className="text-display-sm">карбонара от путника Афелия</h3>
        <p className="text-mono-sm">
          Это блюдо — тёплый привет из детства, где каждая ложка наполнена уютом и ароматами свежих,
          отборных продуктов, приготовленных с любовью и вниманием к сезону.
        </p>
      </div>

      {/* Курсор из макета — намёк, что карточка кликабельна (Figma node 222:2047) */}
      <Image
        src="/images/kitchen/cursor.svg"
        alt=""
        aria-hidden
        width={31}
        height={31}
        unoptimized
        className="absolute top-[57.9%] left-[42.3%] w-[6.7%] rotate-5"
      />

      {/* TODO: вести на блюдо в меню, когда появится страница */}
      <Button variant="outline" className="absolute bottom-8 left-8">
        Хочу
        <ArrowRight className="size-4" strokeWidth={1.5} />
      </Button>

      {/* Откуда блюдо — Figma node 241:1114, плашка 154×101 в углу карточки */}
      <div aria-hidden className="absolute right-0 bottom-0 h-[31.6%] w-[33.5%]">
        <Image
          src="/images/kitchen/origin.webp"
          alt=""
          fill
          sizes="160px"
          className="object-cover opacity-10"
        />
        <div className="absolute inset-0" style={{ backgroundImage: ORIGIN_GRADIENTS }} />
        <Image
          src="/images/kitchen/map-pin.svg"
          alt=""
          width={20}
          height={23}
          unoptimized
          className="absolute top-[22.8%] left-[44.2%] w-[13%]"
        />
        <span className="text-display-sm absolute inset-x-0 top-[50.5%] text-center text-cream">
          Мексика
        </span>
      </div>
    </article>
  );
}
