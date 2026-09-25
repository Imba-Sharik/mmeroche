import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { Button, Container, Reveal, Section, WineGlow } from "@/shared/ui";
import { CountUp } from "./CountUp";

/** Цифры дома — Figma nodes 222:2117, 222:2121, 222:2125 */
const STATS = [
  { value: "03", label: "ЭТАЖА" },
  { value: "04", label: "ПРОСТРАНСТВА" },
  { value: "1100", label: "М² ОБЩАЯ ПЛОЩАДЬ" },
];

/** Секция «Мероприятия и банкеты» — Figma node 222:2110, 1920×829 */
export function Events() {
  return (
    <Section id="events" className="py-25 lg:py-50">
      {/* Свечение у левого края, заходит в предыдущую секцию — Figma node 222:2111 */}
      <WineGlow x="14.896%" y={214.5} size={356} />

      <Container className="flex flex-col items-center gap-10">
        {/*
          Маска поверх цифр — Figma node 222:2133. Доли считаем от контейнера,
          а не от экрана: контейнер упирается в 1464px, и от ширины окна маска
          уезжала мимо карточек.
        */}
        <Image
          src="/images/events/mask.webp"
          alt=""
          aria-hidden
          width={115}
          height={163}
          sizes="15vw"
          className="absolute top-[216.6px] left-[60.28%] z-10 hidden h-auto w-[7.827%] rotate-[-8.59deg] lg:block"
        />
        <Reveal>
          <h2 className="text-display-xl w-full text-cream">Мероприятия и банкеты</h2>

          {/* Лид прижат влево: контейнер центрирует детей, а по макету он стоит
              по левому краю заголовка — Figma node 222:2114 */}
          {/* На мобильном между заголовком и лидом 20px, а не общие 40 — Figma node 336:273 */}
          <p className="text-mono-md -mt-5 w-full max-w-143.5 self-start leading-[1.4] text-dop lg:text-mono-base lg:mt-0">
            Авторская кухня и барная культура позволяют проводить здесь события любого масштаба — от
            камерных ужинов до закрытых корпоративных мероприятий.
          </p>

          <div className="relative grid w-full gap-6 sm:grid-cols-3 lg:gap-8">
            {/*
              Маска на мобильном — Figma node 336:294: у левого края на второй
              карточке, наполовину за краем экрана. Живёт в столбике карточек,
              чтобы держаться за них, а не за верх секции.
            */}
            <Image
              src="/images/events/mask.webp"
              alt=""
              aria-hidden
              width={115}
              height={163}
              sizes="90px"
              className="absolute top-39.5 -left-6 z-10 h-auto w-22 rotate-[-8.59deg] sm:hidden"
            />

            {STATS.map((stat, index) => (
              <div
                key={stat.value}
                className="flex flex-col items-center gap-4 rounded-lg border border-ink-muted p-4 lg:items-start lg:p-6"
              >
                {/* Цифры набираются от нуля, карточки вразбег — см. `CountUp` */}
                <p className="text-display-2xl text-cream">
                  <CountUp value={stat.value} delay={index * 0.15} />
                </p>
                <p className="text-mono-sm text-dop">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* TODO: подставить ссылку на файл презентации, когда пришлют */}
          <Button variant="outline" className="w-full sm:w-auto">
            Скачать презентацию
            <ArrowDown className="size-4" strokeWidth={1.5} />
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}
