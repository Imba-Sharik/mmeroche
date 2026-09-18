import Image from "next/image";
import { FogCanvas, Section, SectionHeading, SectionKicker } from "@/shared/ui";

/** Уходы фото в чёрный по краям — Figma node 114:2424 */
const PHOTO_GRADIENTS = [
  "linear-gradient(0deg, rgb(1,1,1) 0%, rgba(1,1,1,0) 9.7808%)",
  "linear-gradient(0deg, rgba(1,1,1,0) 89.867%, rgb(1,1,1) 100%)",
  "linear-gradient(90deg, rgb(1,1,1) 0%, rgba(1,1,1,0) 9.8908%)",
  "linear-gradient(90deg, rgba(1,1,1,0) 89.652%, rgb(1,1,1) 100%)",
  "linear-gradient(212.32deg, rgba(0,0,0,0.2) 21.385%, rgba(102,102,102,0.2) 100%)",
].join(", ");

/**
 * Дым лежит в макете не внутри секций, а рядом с ними в `main`, и ни один из
 * двух слоёв в «Легенду» не помещается:
 *
 * - «112 1» (114:2607) — y 1049…2649;
 * - «17 1» (114:2447) — повёрнут на 25°, y 1337…4498, то есть лежит на стыке
 *   «Легенды» и «Кухни».
 *
 * Поэтому холст один на оба слоя и выше секции: от y 1049 до y 4497 — 3448px
 * против 1372px «Легенды», отсюда `-2.3%` сверху и высота `251%`. Доли ниже
 * считаны от этой рамки, а не от секции.
 *
 * Кадры взяты рендерами нод, а не исходными картинками: в рендере запечён и
 * поворот, и режим `screen` с прозрачностью 30%. Собирать поворот заново нельзя
 * — кромка повёрнутого прямоугольника режет дым и видна прямой диагональю.
 * Яркость рендера переведена в альфу, поэтому поверх `noir` обычная альфа даёт
 * ровно то же, что `screen`, и слои идут с `alpha: 1`.
 *
 * Рамка холста задана пропорцией кадра и смещением в `vw`, а не долями высоты
 * секции: высота кадра считается от ширины холста, и если рамку мерить высотой
 * секции — на живой странице она оказывается ниже кадра и срезает его по
 * плотному месту, прямой линией через весь экран. `scale: 1` по той же причине.
 */
const FOG_LAYERS = [
  { src: "/images/legend/fog-top.webp", alpha: 1, scale: 1, anchor: true, y: 0.232 },
  { src: "/images/legend/fog-drift.webp", alpha: 1, scale: 1, anchor: true, y: 0.542 },
];

/** Секция «Легенда» — Figma node 114:2414, 1920×1372 */
export function Legend() {
  return (
    <Section id="legend" className="relative flex flex-col items-center py-30 lg:py-45">
      {/* `-z-10` держит холст под содержимым обеих секций: позиционированный
        элемент иначе перекрывает и текст «Легенды», и всю «Кухню», которая
        идёт дальше по потоку и своего стекового контекста не создаёт */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[-1.6vw] -z-10 aspect-1920/3449">
        <FogCanvas layers={FOG_LAYERS} feather={0.08} />
      </div>

      <SectionKicker index="01">О ДОМЕ</SectionKicker>

      <SectionHeading className="mt-8 text-center text-cream">Легенда</SectionHeading>

      <div className="text-mono-base mt-13 max-w-150 text-center text-cream">
        <p>
          Легенда проекта вдохновлена историей Madame Roche — загадочной азиатки, сменившей бурную
          жизнь гонконгского особняка на собственное гастрономическое убежище.
        </p>
        <p className="mt-7">
          Сегодня эта история продолжает жить в атмосфере, интерьере и деталях дома на
          Кожевнической.
        </p>
      </div>

      <p className="mt-7 text-center font-sans text-[16px] leading-6.5 text-ink-dim italic">
        The guest house of the mysterious Asian woman
        <br />
        in the heart of the Eurasian world
      </p>

      {/* Фото с «билетами» поверх левого края — Figma nodes 114:2424—114:2426 */}
      <div className="relative mt-27 w-full max-w-145">
        <div className="relative aspect-580/491 w-full overflow-hidden rounded-lg">
          <Image
            src="/images/legend/photo.webp"
            alt="Мадам Рош"
            fill
            sizes="(max-width: 1024px) 100vw, 580px"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ backgroundImage: PHOTO_GRADIENTS }}
          />
        </div>

        <Image
          src="/images/legend/ticket-1.webp"
          alt=""
          aria-hidden
          width={564}
          height={1003}
          sizes="10vw"
          className="absolute top-[7.1%] left-0 w-[9.8%] -translate-x-1/2 -translate-y-1/2 rotate-[17.6deg]"
        />
        <Image
          src="/images/legend/ticket-2.webp"
          alt=""
          aria-hidden
          width={424}
          height={640}
          sizes="14vw"
          className="absolute top-[15.8%] left-[6.4%] w-[13.1%] -translate-x-1/2 -translate-y-1/2 -rotate-8"
        />
      </div>
    </Section>
  );
}
