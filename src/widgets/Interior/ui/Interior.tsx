import { FogCanvas, Section, SectionHeading, SectionKicker } from "@/shared/ui";
import { InteriorGallery } from "./InteriorGallery";

/**
 * Три слоя дыма подряд, от заголовка до «Истории»:
 *
 * - «60 1» (114:2503) — y 6304…7831, накрывает заголовок;
 * - «150 1» (114:2504) — y 7199…9118;
 * - «112 1» (114:2502) — y 9266…10866, уходит в заголовок «Истории».
 *
 * Все три лежат в макете внутри фрейма со снимками, последними, то есть поверх
 * них — холст идёт над содержимым. Кадры — рендеры нод, яркость переведена в
 * альфу (подробнее в `widgets/Legend`).
 *
 * Рамка холста — от 6304 до 10866 при секции с y 6327, отсюда `-1.2vw` сверху
 * и пропорция `1920/4562`. Доли `y` считаны от этой рамки.
 *
 * Координаты слоёв брал из экспорта нод, а не из `x`/`y` в метаданных: у
 * повёрнутых слоёв там левый край уезжает за 1920, хотя в кадре они видны во
 * всю ширину.
 */
const FOG_LAYERS = [
  { src: "/images/interior/fog-upper.webp", alpha: 1, scale: 1, anchor: true, y: 0.167 },
  { src: "/images/interior/fog-mid.webp", alpha: 1, scale: 1, anchor: true, y: 0.407 },
  { src: "/images/interior/fog-lower.webp", alpha: 1, scale: 1, anchor: true, y: 0.825 },
];

/** Секция «Интерьер» — Figma node 114:2483, 1920×841 */
export function Interior() {
  // Снизу секция не отступает: в макете фрейм со снимками (114:2489) кончается
  // там же, где начинается «История», а пустое поле под нижним кадром — это
  // последние 6.4% самой рамки галереи
  return (
    <Section id="interior" className="relative flex flex-col items-center pt-37.5">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[-1.2vw] z-10 aspect-1920/4562">
        <FogCanvas layers={FOG_LAYERS} feather={0.08} />
      </div>

      {/* Бордовое свечение за заголовком — Figma node 114:2488 */}
      <div
        aria-hidden
        className="absolute top-25.5 left-1/2 size-60.25 -translate-x-1/2 bg-wine opacity-54 blur-[110px]"
      />

      <SectionKicker index="04" className="relative">
        УБРАНСТВА
      </SectionKicker>

      <SectionHeading className="relative mt-6.5 text-center text-cream">Интерьер</SectionHeading>

      {/* Россыпь снимков зала — Figma node 114:2489 */}
      <div className="-mx-5 mt-37.5 self-stretch lg:-mx-(--container-inset)">
        <InteriorGallery />
      </div>
    </Section>
  );
}
