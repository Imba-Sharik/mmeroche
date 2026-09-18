import { SectionHeading, SectionKicker } from "@/shared/ui";
import { StoryCarousel } from "./StoryCarousel";

/** Секция «История» — Figma nodes 114:2505 (заголовок) и 114:2511 (карусель) */
export function Story() {
  return (
    <section id="story" className="relative overflow-hidden px-5 py-9 lg:px-20">
      {/* Бордовое свечение из-за левого края — Figma node 114:2548 */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[52%] -left-85 size-120 bg-wine opacity-54 blur-[160px]"
      />

      {/* Заголовочная группа — Figma node 114:2505 */}
      <div className="relative flex flex-col items-center pt-37.5 pb-33.5">
        <div
          aria-hidden
          className="absolute top-20.25 left-1/2 size-63.75 -translate-x-1/2 bg-wine opacity-54 blur-[110px]"
        />
        <SectionKicker index="05" className="relative">
          ИСТОРИЯ
        </SectionKicker>
        <SectionHeading className="relative mt-6.5 text-center text-cream">
          О madam roche
        </SectionHeading>
      </div>

      <div className="relative">
        <StoryCarousel />
      </div>
    </section>
  );
}
