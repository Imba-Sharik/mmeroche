import Image from "next/image";
import { Container, Section, SectionHeading, WineGlow } from "@/shared/ui";

/** Уходы фото в чёрный по краям — Figma node 222:2022 */
const PHOTO_GRADIENTS = [
  "linear-gradient(0deg, rgb(1,1,1) 0%, rgba(1,1,1,0) 9.7808%)",
  "linear-gradient(0deg, rgba(1,1,1,0) 89.867%, rgb(1,1,1) 100%)",
  "linear-gradient(90deg, rgb(1,1,1) 0%, rgba(1,1,1,0) 9.8908%)",
  "linear-gradient(90deg, rgba(1,1,1,0) 89.652%, rgb(1,1,1) 100%)",
  "linear-gradient(208.23deg, rgba(0,0,0,0.2) 21.385%, rgba(102,102,102,0.2) 100%)",
].join(", ");

/** Секция «Легенда» — Figma node 222:2013, 1920×982 */
export function Legend() {
  return (
    <Section id="legend" className="pt-35 pb-54">
      {/* Свечение слева от текста — Figma node 222:2014 */}
      <WineGlow x="16.458%" y={322} />

      {/*
        Фото вылезает за правое поле контейнера. Режем на этой обёртке, а не на
        секции: по макету бордовое свечение заходит на соседние блоки, и
        `overflow` на секции срезал бы его ровной линией.
      */}
      <div className="relative overflow-hidden">
        <Container className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-45">
          <div className="lg:w-145 lg:shrink-0 lg:pt-38">
            <SectionHeading className="text-cream">легенда</SectionHeading>

            <div className="text-mono-base mt-10 flex flex-col gap-4.5 text-cream">
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
            <p className="mt-5.5 font-note text-base leading-6.5 text-ink-dim italic">
              The guest house of the mysterious Asian woman
              <br />
              in the heart of the Eurasian world
            </p>
          </div>

          {/* Портрет хозяйки — Figma node 222:2022, 870×625, шире правого поля контейнера */}
          <div className="relative aspect-870/625 overflow-hidden rounded-lg lg:-mr-42 lg:flex-1">
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
        </Container>
      </div>
    </Section>
  );
}
