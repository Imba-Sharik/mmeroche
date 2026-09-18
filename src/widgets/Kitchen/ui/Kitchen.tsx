import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button, Section, SectionHeading, SectionKicker } from "@/shared/ui";
import { KitchenGallery } from "./KitchenGallery";

/** Секция «Кухня» — Figma node 114:2427, 1920×1036 */
export function Kitchen() {
  return (
    <Section id="kitchen" className="relative flex flex-col items-center pt-35">
      {/* Карточка-оберег висит над секцией, наезжая на «Легенду» — Figma node 114:2446 */}
      <Image
        src="/images/kitchen/card.webp"
        alt=""
        aria-hidden
        width={380}
        height={250}
        sizes="10vw"
        className="absolute -top-2 left-[51%] w-[5.4%] min-w-18 -translate-x-1/2 -translate-y-1/2 rotate-[24.27deg]"
      />

      <div className="relative flex w-full max-w-130 flex-col items-center gap-7">
        {/* Бордовое свечение за заголовком — Figma node 114:2430 */}
        <div
          aria-hidden
          className="absolute top-9.75 left-[29.8%] size-52.5 bg-wine opacity-54 blur-[90px]"
        />

        <SectionKicker index="02">МЕНЮ И БАР</SectionKicker>

        <div className="relative flex w-full flex-col items-center gap-6">
          <SectionHeading className="text-center text-cream">Кухня</SectionHeading>

          <p className="text-mono-base text-center text-cream">
            В основе меню — авторский comfort food, качественные локальные продукты, сезонные
            ингредиенты и собственная выпечка.
          </p>

          {/* TODO: навесить переходы, когда появятся страницы меню и бара */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button>
              Меню кухни
              <ArrowRight className="size-4" strokeWidth={1.5} />
            </Button>
            <Button variant="outline">
              Бар
              <ArrowRight className="size-4" strokeWidth={1.5} />
            </Button>
          </div>
        </div>
      </div>

      {/* Коллаж из бумаг — Figma node 114:2428, нижним краем заходит в следующую секцию */}
      <div className="relative mt-17 -mb-30 w-[34.6%] min-w-75 rotate-[-4.86deg]">
        <Image
          src="/images/kitchen/collage.webp"
          alt="Заметка мадам с рецептами"
          width={1254}
          height={1254}
          sizes="(max-width: 1024px) 80vw, 664px"
          className="h-auto w-full"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-b from-transparent from-50% to-black/80"
        />
      </div>

      {/* Лента блюд — Figma node 114:2448 */}
      <div className="-mx-5 mt-30 self-stretch lg:-mx-(--container-inset)">
        <KitchenGallery />
      </div>
    </Section>
  );
}
