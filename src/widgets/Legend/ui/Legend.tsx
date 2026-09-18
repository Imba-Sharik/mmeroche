import Image from "next/image";
import { Section, SectionHeading, SectionKicker } from "@/shared/ui";

/** Уходы фото в чёрный по краям — Figma node 114:2424 */
const PHOTO_GRADIENTS = [
  "linear-gradient(0deg, rgb(1,1,1) 0%, rgba(1,1,1,0) 9.7808%)",
  "linear-gradient(0deg, rgba(1,1,1,0) 89.867%, rgb(1,1,1) 100%)",
  "linear-gradient(90deg, rgb(1,1,1) 0%, rgba(1,1,1,0) 9.8908%)",
  "linear-gradient(90deg, rgba(1,1,1,0) 89.652%, rgb(1,1,1) 100%)",
  "linear-gradient(212.32deg, rgba(0,0,0,0.2) 21.385%, rgba(102,102,102,0.2) 100%)",
].join(", ");

/** Секция «Легенда» — Figma node 114:2414, 1920×1372 */
export function Legend() {
  return (
    <Section id="legend" className="flex flex-col items-center py-30 lg:py-45">
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
