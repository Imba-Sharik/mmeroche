import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { Button, Container, Section, WineGlow } from "@/shared/ui";

/** Цифры дома — Figma nodes 222:2117, 222:2121, 222:2125 */
const STATS = [
  { value: "03", label: "ЭТАЖА" },
  { value: "04", label: "ПРОСТРАНСТВА" },
  { value: "1100", label: "М² ОБЩАЯ ПЛОЩАДЬ" },
];

/** Секция «Мероприятия и банкеты» — Figma node 222:2110, 1920×669 */
export function Events() {
  return (
    <Section id="events" className="py-30">
      {/* Свечение у левого края, заходит в предыдущую секцию — Figma node 222:2111 */}
      <WineGlow x="11.875%" y={120} />

      {/* Маска поверх цифр — Figma node 222:2133 */}
      <Image
        src="/images/events/mask.webp"
        alt=""
        aria-hidden
        width={115}
        height={163}
        sizes="15vw"
        className="absolute top-83.5 left-[57.58%] z-10 hidden h-auto w-[5.97%] rotate-[-8.59deg] lg:block"
      />

      <Container className="flex flex-col items-center gap-10">
        <h2 className="text-display-lg w-full text-cream">Мероприятия и банкеты</h2>

        <p className="text-mono-base w-full max-w-143.5 text-cream">
          Авторская кухня и барная культура позволяют проводить здесь события любого масштаба — от
          камерных ужинов до закрытых корпоративных мероприятий.
        </p>

        <div className="grid w-full gap-6 sm:grid-cols-3">
          {STATS.map((stat) => (
            <div
              key={stat.value}
              className="flex flex-col gap-3 rounded-lg border border-ink-dim p-6"
            >
              {/* 75px — собственный размер цифр в макете, крупнее дисплейной шкалы */}
              <p className="font-sans text-[clamp(48px,3.9vw,75px)] leading-[0.9] text-cream">
                {stat.value}
              </p>
              <p className="text-mono-sm text-ink-dim">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* TODO: подставить ссылку на файл презентации, когда пришлют */}
        <Button variant="outline">
          Скачать презентацию
          <ArrowDown className="size-4" strokeWidth={1.5} />
        </Button>
      </Container>
    </Section>
  );
}
