import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Container, Reveal, Section, SectionIntro, WineGlow } from "@/shared/ui";
import { EXPECT_CARDS } from "../model/cards";

/**
 * Секция «Чего ожидать» — Figma node 222:2059, 1920×1237.
 * Якорь `spaces`: пункт меню «Пространства» ведёт сюда (см. shared/config/nav).
 */
export function Expect() {
  return (
    <Section id="spaces" className="pt-64 pb-38">
      {/* Свечение за заголовком — Figma node 222:2060 */}
      <WineGlow x="50%" y={303} />

      <Container className="flex flex-col gap-20">
        <SectionIntro title="чего ожидать">
          В Madame Roche воссоздали эксцентричную и притягательную атмосферу загадочного
          гонконгского особняка для избранных
        </SectionIntro>

        <div className="relative grid gap-8 md:grid-cols-3">
          {/* Маска над второй карточкой — Figma node 222:2080 */}
          <Image
            src="/images/expect/mask.webp"
            alt=""
            aria-hidden
            width={130}
            height={155}
            sizes="15vw"
            className="absolute top-[-70.8px] left-[64.51%] z-10 hidden h-auto w-[8.88%] rotate-[11.4deg] md:block"
          />

          <Reveal>
            {EXPECT_CARDS.map((card) => (
              <article key={card.id} className="flex flex-col items-center gap-6">
                <div className="relative aspect-466/300 w-full overflow-hidden rounded-[16px]">
                  <Image
                    src={card.image}
                    alt={card.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 466px"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col items-center gap-4 px-12 text-center text-cream">
                  <h3 className="text-display-md">{card.title}</h3>
                  <p className="text-mono-sm">{card.text}</p>
                </div>

                <a
                  href={card.href}
                  className="text-mono-sm flex items-center gap-1 p-2.5 text-cream transition-colors hover:text-wine"
                >
                  Подробнее
                  <ArrowUpRight className="size-4 shrink-0" strokeWidth={1.2} />
                </a>
              </article>
            ))}
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
