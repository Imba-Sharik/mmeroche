import { FogCanvas, Section, SectionHeading, SectionKicker } from "@/shared/ui";
import { SpacesCarousel } from "./SpacesCarousel";

/**
 * Дым «89 1» (114:2609) — y 3917…5575, то есть начинается ещё в ленте блюд
 * «Кухни» и гаснет к снимкам пространств. Секция вместе с кадрами занимает
 * y 4568…6327, отсюда `-33.9vw` сверху; высота рамки — пропорция кадра.
 *
 * В `main` этот слой лежит последним, поверх всех фреймов, поэтому холст идёт
 * над содержимым (`z-10`), а не под ним, как в «Легенде».
 *
 * Кадр — рендер ноды: в нём запечён режим `screen` с прозрачностью 30%,
 * яркость переведена в альфу (подробнее в `widgets/Legend`).
 */
const FOG_LAYERS = [{ src: "/images/spaces/fog.webp", alpha: 1, scale: 1, anchor: true }];

/** Секция «Четыре пространства» — Figma node 114:2457, 1920×679 */
export function Spaces() {
  return (
    <Section id="spaces" className="relative flex flex-col items-center pt-61 pb-57">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[-33.9vw] z-10 aspect-1920/1658">
        <FogCanvas layers={FOG_LAYERS} feather={0.08} />
      </div>

      {/* Бордовое свечение за заголовком — Figma node 114:2463 */}
      <div
        aria-hidden
        className="absolute top-66.5 left-1/2 size-52.5 -translate-x-1/2 bg-wine opacity-54 blur-[90px]"
      />

      <SectionKicker index="03" className="relative">
        ПРОСТРАНСТВА
      </SectionKicker>

      <SectionHeading className="relative mt-9.5 text-center text-cream">
        Четыре пространства
      </SectionHeading>

      <p className="text-mono-sm relative mt-10 text-center text-cream">
        Четыре разных настроения,
        <br />
        объединённых одной историей
      </p>

      {/* Карточка пространства — Figma node 114:2464 */}
      <div className="mt-40 w-full self-stretch">
        <SpacesCarousel />
      </div>
    </Section>
  );
}
