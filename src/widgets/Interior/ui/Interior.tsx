import { Reveal, Section, SectionIntro, WineGlow } from "@/shared/ui";
import { InteriorGallery } from "./InteriorGallery";

/** Секция «Интерьер» — Figma node 222:2081, 1920×2474 */
export function Interior() {
  return (
    <Section id="interior" className="pt-25 pb-25 lg:pt-50 lg:pb-47">
      {/* Свечение за заголовком — Figma nodes 222:2082 и 336:267 (мобильный, меньше и выше) */}
      <WineGlow x="49.479%" y={276} className="hidden lg:block" />
      <WineGlow x="48.889%" y={149} size={212} className="lg:hidden" />

      <Reveal>
        <SectionIntro title="интерьер" className="px-4 sm:px-5">
          Интерьер ресторана, как азиатская шкатулка, вместил в себя культуры и быт всех мировых
          континентов – здесь яванская древесина
        </SectionIntro>
      </Reveal>

      {/*
        Коллаж идёт во всю ширину экрана, а не по контейнеру — Figma node 222:2081.
        Вне `Reveal`: кадры проявляются сами, по одному, см. `InteriorGallery`.
      */}
      {/* На мобильном своя раскладка коллажа — Figma node 336:246 */}
      <div className="relative mt-8 w-full lg:mt-27">
        <InteriorGallery layout="desktop" className="hidden lg:block" />
        <InteriorGallery layout="mobile" className="mx-auto max-w-120 lg:hidden" />
      </div>
    </Section>
  );
}
