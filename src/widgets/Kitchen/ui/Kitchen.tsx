import { ArrowRight } from "lucide-react";
import { Button, Container, Section, SectionHeading, WineGlow } from "@/shared/ui";
import { KitchenGrid } from "./KitchenGrid";

/** Секция «Кухня» — Figma node 222:2023, 1920×1080 */
export function Kitchen() {
  return (
    <Section id="kitchen" className="pt-65 pb-36">
      {/* Свечение за текстовой колонкой — Figma node 222:2024 */}
      <WineGlow x="14.688%" y={308} />

      {/*
        Сетка блюд шире экрана, её приходится обрезать. Режем на этой обёртке,
        а не на секции: по макету бордовое свечение заходит на соседние блоки,
        и `overflow` на секции срезал бы его ровной линией.
      */}
      <div className="relative overflow-hidden">
        <Container className="flex flex-col gap-12 lg:flex-row lg:items-start">
          <div className="flex flex-col gap-10 lg:w-127.5 lg:shrink-0">
            <SectionHeading className="text-cream">кухня</SectionHeading>

            <div className="flex flex-col gap-8">
              <div className="text-mono-base flex flex-col gap-4.5 text-cream">
                <p>
                  Меню строится на необычных контрастах, игре текстур и огне как способе
                  приготовления и отражении характера дома.
                </p>
                <p>
                  Madame Roche привыкла знать обо всем, что появляется в её доме, — еда не
                  исключение. Здесь предпочитают продукты от фермеров, самостоятельно делают масло и
                  сметану и пекут ремесленный хлеб
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

          {/* Сетка блюд уходит за правый край экрана — Figma node 222:2039 */}
          <KitchenGrid />
        </Container>
      </div>
    </Section>
  );
}
