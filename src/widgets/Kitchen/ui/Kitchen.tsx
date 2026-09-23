import { ArrowRight } from "lucide-react";
import { Button, Reveal, Section, SectionHeading, WineGlow } from "@/shared/ui";
import { KitchenGrid } from "./KitchenGrid";

/**
 * Секция «Кухня» — Figma node 222:2023, 1920×1080.
 * Правого поля у секции нет: сетка блюд шире экрана и намеренно уходит за край.
 */
export function Kitchen() {
  return (
    <Section id="kitchen" className="py-50">
      {/* Свечение за текстовой колонкой — Figma node 222:2024 */}
      <WineGlow x="15.208%" y={265} />

      {/*
        Лента шире экрана — обрезаем её здесь, а не на секции: свечение по макету
        заходит на соседние блоки, а `overflow` на секции срезал бы его линией.
      */}
      <div className="relative overflow-hidden">
        <div className="flex flex-col gap-12 px-5 lg:flex-row lg:items-start lg:gap-30 lg:pr-0 lg:pl-container">
          <Reveal>
            <div className="js-kitchen-title flex flex-col gap-10 lg:w-127.5 lg:shrink-0">
              <SectionHeading className="text-cream">кухня</SectionHeading>

              <div className="flex flex-col gap-8">
                <div className="text-mono-base flex flex-col gap-4.5 text-dop">
                  <p>
                    Madame Roche привыкла знать обо всем, что появляется в её доме, — еда не
                    исключение.
                  </p>
                  <p>
                    Здесь предпочитают продукты от фермеров, самостоятельно делают масло и сметану
                    и пекут ремесленный хлеб
                  </p>
                </div>

                {/* TODO: навесить переходы, когда появятся страницы меню и бара */}
                <div className="flex flex-wrap items-center gap-4">
                  <Button className="w-40">
                    Меню кухни
                    <ArrowRight className="size-4" strokeWidth={1.5} />
                  </Button>
                  <Button variant="outline" className="w-40">
                    Барная карта
                    <ArrowRight className="size-4" strokeWidth={1.5} />
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Сетка блюд уходит за правый край экрана — Figma node 222:2039 */}
          <KitchenGrid />
        </div>
      </div>
    </Section>
  );
}
