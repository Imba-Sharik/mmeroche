import { Section, SectionHeading, SectionKicker } from "@/shared/ui";
import { InteriorGallery } from "./InteriorGallery";

/** Секция «Интерьер» — Figma node 114:2483, 1920×841 */
export function Interior() {
  return (
    <Section id="interior" className="relative flex flex-col items-center pt-37.5 pb-70">
      {/* Бордовое свечение за заголовком — Figma node 114:2488 */}
      <div
        aria-hidden
        className="absolute top-25.5 left-1/2 size-60.25 -translate-x-1/2 bg-wine opacity-54 blur-[110px]"
      />

      <SectionKicker index="04" className="relative">
        УБРАНСТВА
      </SectionKicker>

      <SectionHeading className="relative mt-6.5 text-center text-cream">Интерьер</SectionHeading>

      {/* Россыпь снимков зала — Figma node 114:2489 */}
      <div className="-mx-5 mt-37.5 self-stretch lg:-mx-(--container-inset)">
        <InteriorGallery />
      </div>
    </Section>
  );
}
