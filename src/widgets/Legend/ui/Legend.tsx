import Image from "next/image";
import { Reveal, Section, SectionHeading, WineGlow } from "@/shared/ui";

/** Уходы фото в чёрный по краям — Figma node 222:2022 */
const PHOTO_GRADIENTS = [
  "linear-gradient(0deg, rgb(1,1,1) 0%, rgba(1,1,1,0) 9.7808%)",
  "linear-gradient(0deg, rgba(1,1,1,0) 89.867%, rgb(1,1,1) 100%)",
  "linear-gradient(90deg, rgb(1,1,1) 0%, rgba(1,1,1,0) 9.8908%)",
  "linear-gradient(90deg, rgba(1,1,1,0) 89.652%, rgb(1,1,1) 100%)",
  "linear-gradient(208.23deg, rgba(0,0,0,0.2) 21.385%, rgba(102,102,102,0.2) 100%)",
].join(", ");

/**
 * Секция «Легенда» — Figma node 222:2013, 1920×1025.
 * Ряд здесь шире общего контейнера: поля 228 слева и 80 справа, поэтому
 * вместо `Container` свои паддинги.
 */
export function Legend() {
  return (
    <Section id="legend" className="py-25 lg:py-50">
      {/* Свечение слева от текста — Figma node 268:14 */}
      <WineGlow x="17.917%" y={388} />

      <div className="relative flex flex-col items-center gap-12 px-5 lg:flex-row lg:gap-42 lg:pr-20 lg:pl-container">
        <Reveal>
          <div className="lg:w-143.5 lg:shrink-0">
            <SectionHeading className="text-cream">легенда</SectionHeading>

            <div className="text-mono-base mt-10 flex flex-col gap-4.5 text-dop">
              <p>
                В приватных разговорах ходят легенды о загадочной мадам Роче, владелице изысканного
                мужского клуба на Олдрич-стрит в Гонконге.
              </p>
              <p>
                Говорят, в какой‑то момент жизни она сменила плотские удовольствия на
                гастрономические, и в честь этого на карте Замоскворечья появилась новая точка
                притяжения — трехэтажный ресторан и тайный особняк «Madame Roche»
              </p>
            </div>

            {/* Подпись набрана Playfair Display Italic, а не дисплейным шрифтом секций */}
            <p className="mt-6 font-note text-base leading-6.5 text-cream/50 italic">
              The guest house of the mysterious Asian woman
              <br />
              in the heart of the Eurasian world
            </p>
          </div>

          {/* Портрет хозяйки — Figma node 222:2022, 870×625 */}
          <div className="relative aspect-870/625 w-full overflow-hidden rounded-lg lg:flex-1">
            <Image
              src="/images/legend/photo.webp"
              alt="Мадам Роче"
              fill
              sizes="(max-width: 1024px) 100vw, 870px"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ backgroundImage: PHOTO_GRADIENTS }}
            />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
