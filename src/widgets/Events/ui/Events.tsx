import { ArrowDown } from "lucide-react";
import { Button, FogCanvas, Section, SectionHeading, SectionKicker } from "@/shared/ui";

/** Цифры зала — Figma nodes 114:2555, 114:2560, 114:2565 */
const STATS = [
  { hieroglyph: "叁", value: "03", label: "ЭТАЖА" },
  { hieroglyph: "肆", value: "04", label: "ПРОСТРАНСТВА" },
  { hieroglyph: "一千一百", value: "1100", label: "М² ОБЩАЯ ПЛОЩАДЬ" },
];

/**
 * Дым «59 1» (114:2575). Высота рамки — пропорция кадра.
 *
 * По макету слой стоит на y 12048 при секции y 11898…13249, то есть `7.8vw`
 * сверху (координата снята подгонкой кадра к рендеру: нода повёрнута —
 * инспектор Figma показывает 2465×1471 и `rotate(162.034deg)` — а метаданные
 * отдают размер и точку **до** поворота, отсюда промах почти на тысячу
 * пикселей).
 *
 * Подняли на 28vw выше макета по просьбе. Плотная часть кадра лежит на 40…60%
 * его высоты (864…1296px от верха), поэтому при макетном положении дым садился
 * на нижнюю треть секции; со сдвигом он приходится на заголовок и цифры зала.
 *
 * Кадр — рендер ноды, яркость переведена в альфу (подробнее в `widgets/Legend`).
 */
const FOG_LAYERS = [{ src: "/images/events/fog.webp", alpha: 1, scale: 1, anchor: true }];

/** Секция «Мероприятия и банкеты» — Figma node 114:2549, 1920×2160 */
export function Events() {
  return (
    <Section id="events" className="relative flex flex-col items-center pt-63 pb-60">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[-20vw] z-10 aspect-1920/2160">
        <FogCanvas layers={FOG_LAYERS} feather={0.08} />
      </div>

      {/* Бордовое свечение за заголовком — Figma node 114:2554 */}
      <div
        aria-hidden
        className="absolute top-63 left-1/2 size-63.75 -translate-x-1/2 bg-wine opacity-54 blur-[110px]"
      />

      <SectionKicker index="05" className="relative">
        СОБЫТИЯ
      </SectionKicker>

      <SectionHeading className="relative mt-11.5 text-center text-[clamp(32px,2.9vw,55px)] text-cream">
        Мероприятия и банкеты
      </SectionHeading>

      <p className="text-mono-sm relative mt-11 max-w-116 text-center text-cream">
        Авторская кухня и барная культура позволяют проводить здесь события любого масштаба — от
        камерных ужинов до закрытых корпоративных мероприятий.
      </p>

      {/* TODO: подставить ссылку на файл презентации, когда пришлют */}
      <Button variant="outline" className="relative mt-11 rounded-[8px]">
        Скачать презентацию
        <ArrowDown className="size-4" strokeWidth={1.5} />
      </Button>

      <dl className="relative mt-30 flex w-full max-w-143 flex-col">
        {STATS.map((stat) => (
          <div
            key={stat.value}
            className="flex h-42 flex-col items-center justify-center gap-3 border-b border-ink-dim"
          >
            <p className="font-accent text-[16px] leading-none font-black text-wine">
              {stat.hieroglyph}
            </p>
            <dd className="font-sans text-[clamp(48px,3.9vw,75px)] leading-[0.9] text-cream">
              {stat.value}
            </dd>
            <dt className="text-mono-sm text-ink-dim">{stat.label}</dt>
          </div>
        ))}
      </dl>
    </Section>
  );
}
