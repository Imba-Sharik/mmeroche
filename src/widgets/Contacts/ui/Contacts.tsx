import Image from "next/image";
import { CONTACTS, PHONE_HREF } from "@/shared/config";
import { ButtonLink, Section, SectionHeading, SectionKicker } from "@/shared/ui";
import { ContactsMap } from "./ContactsMap";

/** Секция «Найти особняк» — Figma node 114:2576, 1920×1327 */
export function Contacts() {
  return (
    <Section id="contacts" className="relative flex flex-col items-center pt-37.5 pb-27">
      {/* Бордовое свечение за заголовком — Figma node 114:2577 */}
      <div
        aria-hidden
        className="absolute top-35 left-1/2 size-63.75 -translate-x-1/2 bg-wine opacity-54 blur-[110px]"
      />

      <SectionKicker index="06" className="relative">
        КОНТАКТЫ
      </SectionKicker>

      <SectionHeading className="relative mt-6 text-center text-cream">
        Найти особняк
      </SectionHeading>

      <div className="relative mt-14 flex flex-wrap items-center justify-center gap-4">
        <ButtonLink href={CONTACTS.routeUrl} target="_blank" rel="noreferrer noopener">
          Построить маршрут
        </ButtonLink>
        <ButtonLink href={PHONE_HREF} variant="outline">
          Позвонить
        </ButtonLink>
      </div>

      <div className="mt-24 grid w-full gap-16 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-10">
        <div className="lg:pl-42">
          {/* Снимок с билетом над колонкой контактов — Figma nodes 114:2579, 114:2580 */}
          <div className="relative mb-10 h-46 w-48">
            <Image
              src="/images/contacts/photo.webp"
              alt=""
              aria-hidden
              width={448}
              height={624}
              sizes="15vw"
              className="absolute top-0 left-0 w-29 rotate-[-10.73deg] opacity-78"
            />
            <Image
              src="/images/contacts/ticket.webp"
              alt=""
              aria-hidden
              width={221}
              height={325}
              sizes="10vw"
              className="absolute top-4 left-21.5 w-17 rotate-[18.27deg]"
            />
          </div>

          <dl className="flex flex-col gap-6">
            <div>
              <dt className="text-mono-xs text-[10px] text-cream opacity-50">АДРЕС</dt>
              <dd className="text-mono-base mt-2 text-cream">
                {CONTACTS.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-mono-xs text-[10px] text-cream opacity-50">ГРАФИК</dt>
              <dd className="text-mono-base mt-2 text-cream">
                {CONTACTS.hours.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-mono-xs text-[10px] text-cream opacity-50">ТЕЛЕФОН</dt>
              <dd className="text-mono-base mt-2 text-cream">
                <a href={PHONE_HREF} className="transition-colors hover:text-wine">
                  {CONTACTS.phone}
                </a>
              </dd>
            </div>
          </dl>

          <p className="text-mono-xs mt-8 text-cream opacity-50">
            {CONTACTS.links.map((link, index) => (
              <span key={link.label}>
                {index > 0 && " · "}
                <a href={link.href} className="transition-opacity hover:opacity-70">
                  {link.label}
                </a>
              </span>
            ))}
          </p>
        </div>

        {/* Карта — Figma node 114:2598 */}
        <div className="relative aspect-576/370 w-full overflow-hidden rounded-[8px] lg:w-xl">
          <ContactsMap />
        </div>
      </div>
    </Section>
  );
}
