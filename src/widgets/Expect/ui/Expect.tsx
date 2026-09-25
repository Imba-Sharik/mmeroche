import Image from "next/image";
import { Container, Reveal, Section, SectionIntro, WineGlow } from "@/shared/ui";
import { EXPECT_CARDS } from "../model/cards";
import { SpaceDialog } from "./SpaceDialog";

/** Маска проявляется после фото карточки, секунды */
const MASK_DELAY = 0.6;

/**
 * Секция «Чего ожидать» — Figma node 222:2059, 1920×1237.
 * Якорь `spaces`: пункт меню «Пространства» ведёт сюда (см. shared/config/nav).
 */
export function Expect() {
  return (
    <Section id="spaces" className="py-25 lg:py-50">
      {/* Свечение за заголовком — Figma node 222:2060 */}
      <WineGlow x="49.479%" y={271} />

      <Container className="flex flex-col gap-18">
        <Reveal>
          <SectionIntro title="чего ожидать">
            В Madame Roche воссоздали эксцентричную и притягательную атмосферу загадочного
            гонконгского особняка для избранных
          </SectionIntro>
        </Reveal>

        <div className="relative grid gap-8 md:grid-cols-3">
          {/*
            Маска над второй карточкой — Figma node 222:2080. Появляется после
            фото, а не вместе с ним — так просил дизайнер (комментарий в макете).
          */}
          <Reveal delay={MASK_DELAY}>
            <Image
              src="/images/expect/mask.webp"
              alt=""
              aria-hidden
              width={130}
              height={155}
              sizes="15vw"
              className="absolute top-[-63.7px] left-[64.756%] z-10 hidden h-auto w-[8.882%] rotate-[11.4deg] md:block"
            />
          </Reveal>

          {/*
            `h-full` у карточки и `mt-auto` у ссылки: в макете карточки одной
            высоты и «Подробнее» стоят на одной линии, хотя тексты разной длины.
          */}
          <Reveal>
            {EXPECT_CARDS.map((card) => (
              <article key={card.id} className="relative flex h-full flex-col items-center gap-6">
                {/*
                  На мобильном карточки столбиком, и маска сидит на углу фото
                  «Лаборатории» — Figma node 336:245: тот же кадр 130×155 и
                  наклон 11.4°, частично за правым краем. Привязана к правому
                  краю карточки и вылезает на 20px, а не на макетные 52: на 320
                  маска почти целиком уходила за экран.
                */}
                {card.id === "laboratory" && (
                  <Reveal delay={MASK_DELAY}>
                    <Image
                      src="/images/expect/mask.webp"
                      alt=""
                      aria-hidden
                      width={130}
                      height={155}
                      sizes="130px"
                      className="absolute top-[-47.76px] -right-5 z-10 h-auto w-32.5 rotate-[11.4deg] md:hidden"
                    />
                  </Reveal>
                )}

                <div className="relative aspect-466/300 w-full overflow-hidden rounded-[16px]">
                  <Image
                    src={card.image}
                    alt={card.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 466px"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col items-center gap-4 text-center text-cream sm:px-6 lg:px-12">
                  {/* В макете заголовок в одну строку и чуть шире колонки текста */}
                  <h3 className="text-display-md lg:whitespace-nowrap">{card.title}</h3>
                  <p className="text-mono-sm text-dop">{card.text}</p>
                </div>

                {/* «Подробнее» открывает модалку с полным описанием пространства */}
                <SpaceDialog card={card} />
              </article>
            ))}
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
