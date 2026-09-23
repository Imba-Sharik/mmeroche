import Image from "next/image";
import { CONTACTS, PHONE_HREF } from "@/shared/config";
import { ButtonLink, Container, Reveal, Section, WineGlow } from "@/shared/ui";
import { ContactsMap } from "./ContactsMap";

/** Блоки контактов — Figma nodes 222:2140, 222:2143, 222:2146 */
const BLOCKS = [
  { label: "АДРЕС", lines: CONTACTS.addressLines },
  { label: "ГРАФИК", lines: CONTACTS.hours },
] as const;

/** Секция «Найти особняк» — Figma node 222:2134, 1920×774 */
export function Contacts() {
  return (
    <Section id="contacts" className="pt-50">
      {/* Свечение у левого края — Figma node 222:2135, 399×399 */}
      <WineGlow x="14.974%" y={252.5} size={399} />

      <Container className="flex flex-col gap-10">
        <Reveal>
          <h2 className="text-display-xl text-cream">Найти особняк</h2>

          <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex w-full flex-col gap-7 lg:w-105">
              {BLOCKS.map((block) => (
                <div key={block.label} className="flex flex-col gap-2">
                  <p className="text-mono-xs text-dop opacity-50">{block.label}</p>
                  <p className="text-mono-base whitespace-pre text-cream">
                    {block.lines.join("\n")}
                  </p>
                </div>
              ))}

              <div className="flex flex-col gap-2">
                <p className="text-mono-xs text-dop opacity-50">ТЕЛЕФОН</p>
                <p className="text-mono-base text-cream">
                  <a href={PHONE_HREF} className="transition-colors hover:text-wine">
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
                    <a href={link.href} className="transition-opacity hover:opacity-70">
                      {link.label}
                    </a>
                  </span>
                ))}
              </p>
            </div>

            <div className="relative w-full lg:w-207">
              {/* Карта — Figma node 222:2155, 828×352 */}
              <div className="relative aspect-828/352 w-full overflow-hidden rounded-lg">
                <ContactsMap />
              </div>

              {/*
                Голова Будды сидит на верхнем углу карты — Figma node 225:2201.
                Размер и вылет считаем от карты: она фиксированной ширины, и от
                долей экрана голова мельчала и сползала с угла.

                По макету голова 79px (9.541%) — по просьбе увеличена до 22%
                ширины карты (~182px) и сдвинута ниже и левее.
              */}
              <Image
                src="/images/contacts/mask.webp"
                alt=""
                aria-hidden
                width={182}
                height={277}
                sizes="20vw"
                className="absolute top-[-20%] left-[-10%] z-10 h-auto w-[22%] rotate-[-12.49deg]"
              />
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
