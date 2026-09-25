import { ArrowRight } from "lucide-react";
import {
  Button,
  ProgressiveBlur,
  Reveal,
  Section,
  SectionHeading,
  WineGlow,
  type BlurStep,
} from "@/shared/ui";
import { KitchenGrid } from "./KitchenGrid";

/**
 * Размытие у краёв ленты: клетки не обрываются линией обрезки, а уходят
 * в расфокус. Сильнее, чем в шапке, — под ним фото, а не тёмный фон.
 */
const EDGE_BLUR: BlurStep[] = [
  { blur: 4, fade: "100%" },
  { blur: 6, fade: "65%" },
  { blur: 10, fade: "40%" },
  { blur: 14, fade: "20%" },
];

/**
 * Секция «Кухня» — Figma node 222:2023, 1920×1080.
 * Правого поля у секции нет: сетка блюд шире экрана и намеренно уходит за край.
 */
export function Kitchen() {
  return (
    <Section id="kitchen" className="py-25 lg:py-50">
      {/* Свечение за текстовой колонкой — Figma node 222:2024 */}
      <WineGlow x="15.208%" y={265} />

      {/*
        Лента шире экрана — обрезаем её здесь, а не на секции: свечение по макету
        заходит на соседние блоки, а `overflow` на секции срезал бы его линией.

        Именно `clip`, а не `hidden`: блок с `hidden` браузер умеет прокручивать
        сам. На мобильном тап по клетке у края фокусировал её, и браузер,
        показывая её, сдвигал вбок всю обёртку — заголовок и кнопки уезжали
        вместе с лентой.
      */}
      <div className="relative overflow-clip">
        <div className="flex flex-col gap-10 px-4 sm:px-5 lg:flex-row lg:items-start lg:gap-30 lg:pr-0 lg:pl-container">
          <Reveal>
            <div className="js-kitchen-title lg:w-127.5 lg:shrink-0">
              {/*
                Отдельный слой под растворение, когда лента наезжает на колонку:
                прозрачность самой колонки занята проявлением из `Reveal`.
              */}
              <div className="js-kitchen-fade flex flex-col gap-5 lg:gap-10">
                <SectionHeading className="text-cream">кухня</SectionHeading>

                <div className="flex flex-col gap-8">
                  <div className="text-mono-md flex flex-col gap-4 leading-[1.4] text-dop lg:text-mono-base lg:gap-4.5">
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
                  {/* На мобильном кнопки делят ширину поровну — Figma node 336:180 */}
                  <div className="flex flex-wrap items-center gap-3 lg:gap-4">
                    <Button className="flex-1 px-3 lg:w-40 lg:flex-none lg:px-5.5">
                      Меню кухни
                      <ArrowRight className="size-4" strokeWidth={1.5} />
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 px-3 lg:w-40 lg:flex-none lg:px-5.5"
                    >
                      Барная карта
                      <ArrowRight className="size-4" strokeWidth={1.5} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Сетка блюд уходит за правый край экрана — Figma node 222:2039 */}
          <KitchenGrid />
        </div>

        {/* Поверх ленты (у неё z-10), только там, где она едет вбок */}
        <ProgressiveBlur
          side="left"
          steps={EDGE_BLUR}
          className="absolute inset-y-0 left-0 z-20 hidden w-40 lg:block"
        />
        <ProgressiveBlur
          side="right"
          steps={EDGE_BLUR}
          className="absolute inset-y-0 right-0 z-20 hidden w-40 lg:block"
        />
      </div>
    </Section>
  );
}
