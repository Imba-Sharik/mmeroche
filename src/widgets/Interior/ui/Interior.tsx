import { Reveal, Section, SectionIntro, WineGlow } from "@/shared/ui";
import { InteriorGallery } from "./InteriorGallery";

/** Секция «Интерьер» — Figma node 222:2081, 1920×2474 */
export function Interior() {
  return (
    <Section id="interior" className="pt-50 pb-47">
      {/* Свечение за заголовком — Figma node 222:2082 */}
      <WineGlow x="49.479%" y={276} />

      <Reveal>
        <SectionIntro title="интерьер" className="px-5">
          Интерьер ресторана, как азиатская шкатулка, вместил в себя культуры и быт всех мировых
          континентов – здесь яванская древесина
        </SectionIntro>

        {/* Коллаж идёт во всю ширину экрана, а не по контейнеру — Figma node 222:2081 */}
        <div className="mt-27 w-full">
          <InteriorGallery />
        </div>
      </Reveal>
    </Section>
  );
}
