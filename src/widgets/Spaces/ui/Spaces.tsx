import { Section, SectionHeading, SectionKicker } from "@/shared/ui";
import { SpacesCarousel } from "./SpacesCarousel";

/** Секция «Четыре пространства» — Figma node 114:2457, 1920×679 */
export function Spaces() {
  return (
    <Section id="spaces" className="relative flex flex-col items-center pt-61 pb-57">
      {/* Бордовое свечение за заголовком — Figma node 114:2463 */}
      <div
        aria-hidden
        className="absolute top-66.5 left-1/2 size-52.5 -translate-x-1/2 bg-wine opacity-54 blur-[90px]"
      />

      <SectionKicker index="03" className="relative">
        ПРОСТРАНСТВА
      </SectionKicker>

      <SectionHeading className="relative mt-9.5 text-center text-cream">
        Четыре пространства
      </SectionHeading>

      <p className="text-mono-sm relative mt-10 text-center text-cream">
        Четыре разных настроения,
        <br />
        объединённых одной историей
      </p>

      {/* Карточка пространства — Figma node 114:2464 */}
      <div className="mt-40 w-full self-stretch">
        <SpacesCarousel />
      </div>
    </Section>
  );
}
