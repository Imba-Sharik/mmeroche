import { FogCanvas, SectionHeading, SectionKicker } from "@/shared/ui";
import { StoryCarousel } from "./StoryCarousel";

/**
 * Дым «59 1» (114:2369) — y 10471…11942, почти ровно рамка секции
 * (y 10440…11898), отсюда `1.6vw` сверху; высота рамки — пропорция кадра.
 *
 * Этот слой в `main` стоит первым, то есть лежит под всеми фреймами, — холст
 * идёт под содержимым (`-z-10`). Поэтому в макете дым виден только по краям от
 * заголовка и вдоль полей карусели: сам кадр карусели его закрывает.
 *
 * Кадр — рендер ноды, яркость переведена в альфу (подробнее в `widgets/Legend`).
 */
const FOG_LAYERS = [{ src: "/images/story/fog.webp", alpha: 1, scale: 1, anchor: true }];

/** Секция «История» — Figma nodes 114:2505 (заголовок) и 114:2511 (карусель) */
export function Story() {
  return (
    <section id="story" className="relative overflow-hidden px-5 py-9 lg:px-20">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[1.6vw] -z-10 aspect-1920/1471">
        <FogCanvas layers={FOG_LAYERS} feather={0.08} />
      </div>

      {/* Заголовочная группа — Figma node 114:2505 */}
      <div className="relative flex flex-col items-center pt-37.5 pb-33.5">
        <div
          aria-hidden
          className="absolute top-20.25 left-1/2 size-63.75 -translate-x-1/2 bg-wine opacity-54 blur-[110px]"
        />
        <SectionKicker index="05" className="relative">
          ИСТОРИЯ
        </SectionKicker>
        <SectionHeading className="relative mt-6.5 text-center text-cream">
          О madam roche
        </SectionHeading>
      </div>

      <div className="relative">
        {/*
          Бордовое свечение из-за левого края — Figma node 114:2548. В макете
          оно лежит внутри фрейма карусели (480×480 в точке −341, 554), поэтому
          и здесь живёт рядом с ней, а размеры считаются в долях ширины: в
          пикселях оно на узком окне вылезало за секцию.

          От макета сознательно отступаем: там пятно кончается в 19px от низа
          фрейма, размытие не помещается и его срезает рамка. У нас секция с
          `overflow-hidden`, и этот срез читается полосой, поэтому пятно взято
          меньше и поднято — так, чтобы размытие целиком укладывалось в
          карусель: 12vw ореола сверху и 18.8vw снизу.
        */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-[18vw] left-[-14vw] size-[18vw] bg-wine opacity-54 blur-[6vw]"
        />

        <StoryCarousel />
      </div>
    </section>
  );
}
