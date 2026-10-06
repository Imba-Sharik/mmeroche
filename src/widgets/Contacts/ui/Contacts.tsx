import Image from "next/image";
import { CONTACTS, linkTarget, PHONE_HREF } from "@/shared/config";
import { ButtonLink, Container, CUTOUT_DELAY, Reveal, Section, WineGlow } from "@/shared/ui";
import { ContactsMap } from "./ContactsMap";

/** Блоки контактов — Figma nodes 222:2140, 222:2143, 222:2146 */
const BLOCKS = [
  { label: "АДРЕС", lines: CONTACTS.addressLines },
  { label: "ГРАФИК", lines: CONTACTS.hours },
] as const;

/** Секция «Найти особняк» — Figma node 222:2134, 1920×774; мобильная — 336:295 */
export function Contacts() {
  return (
    <Section id="contacts" className="pt-25 lg:pt-50">
      {/* Свечение у левого края — Figma node 222:2135, 399×399 */}
      <WineGlow x="14.974%" y={252.5} size={399} />

      <Container className="flex flex-col gap-10">
        <Reveal>
          {/*
            Заголовок — в левой колонке, а не над рядом: так карта справа
            тянется на всю высоту колонки и встаёт верхом вровень с ним.
          */}
          <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
            <div className="flex w-full flex-col gap-10 lg:w-105">
              <h2 data-split="chars" className="text-display-xl text-cream lg:whitespace-nowrap">
                Найти особняк
              </h2>

              <div className="flex flex-col gap-7">
                {BLOCKS.map((block) => (
                  <div key={block.label} className="flex flex-col gap-2">
                    <p className="text-mono-xs text-dop opacity-50">{block.label}</p>
                    {/*
                    `pre-wrap`, а не `pre`: переводы строк и двойные пробелы
                    в графике держим, но длинной строке даём перенестись — на
                    узком экране адрес распирал страницу вширь.
                  */}
                    <p className="text-mono-md leading-[1.4] whitespace-pre-wrap text-cream lg:text-mono-base">
                      {block.lines.join("\n")}
                    </p>
                  </div>
                ))}

                <div className="flex flex-col gap-2">
                  <p className="text-mono-xs text-dop opacity-50">ТЕЛЕФОН</p>
                  <p className="text-mono-md leading-[1.4] text-cream lg:text-mono-base">
                    <a href={PHONE_HREF} className="transition-colors hover:text-white">
                      {CONTACTS.phone}
                    </a>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <ButtonLink
                    href={CONTACTS.routeUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    variant="route"
                  >
                    Построить маршрут
                  </ButtonLink>
                  <ButtonLink href={PHONE_HREF} variant="outline">
                    Позвонить
                  </ButtonLink>
                </div>

                <p className="text-mono-xs text-cream opacity-50">
                  {CONTACTS.links.map((link, index) => (
                    <span key={link.label}>
                      {index > 0 && "  ·  "}
                      <a
                        href={link.href}
                        {...linkTarget(link.href)}
                        className="transition-opacity hover:opacity-70"
                      >
                        {link.label}
                      </a>
                    </span>
                  ))}
                </p>
              </div>
            </div>

            <div className="relative w-full lg:w-207">
              {/*
                Карта — Figma node 222:2155, 828×352; на мобильном 328×352 (336:316).
                На десктопе высота не по макету, а по левой колонке — от заголовка
                до ссылок.
              */}
              <div className="relative aspect-328/352 w-full overflow-hidden rounded-lg lg:aspect-auto lg:h-full">
                <ContactsMap />
              </div>

              {/*
                Голова Будды сидит на верхнем углу карты — Figma node 225:2201.
                Размер и вылет считаем от карты: она фиксированной ширины, и от
                долей экрана голова мельчала и сползала с угла.

                По макету голова 79px (9.541%) — по просьбе увеличена до 22%
                ширины карты (~182px) и сдвинута ниже и левее.

                На мобильном карта узкая, и от тех же долей голова выходила ~70px
                и почти целиком висела над картой — там она крупнее (42%) и ниже.

                Проявляется после карты, как все вырезки.
              */}
              <Reveal delay={CUTOUT_DELAY}>
                <Image
                  src="/images/contacts/mask.webp"
                  alt=""
                  aria-hidden
                  width={182}
                  height={277}
                  sizes="20vw"
                  className="absolute top-[-8%] left-[-16%] z-10 h-auto w-[42%] rotate-[-12.49deg] lg:top-[-20%] lg:left-[-10%] lg:w-[22%]"
                />
              </Reveal>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
