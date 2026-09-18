import { CONTACTS } from "@/shared/config";
import { FogCanvas, Section } from "@/shared/ui";

/**
 * Дым «16 1» (114:2606) — y 12620…14414, то есть до самого низа макета.
 *
 * Живёт в подвале, а не в «Контактах»: в Figma подвал лежит внутри фрейма
 * «Контактов», у нас это отдельный виджет из `layout`, и `bottom-0` внутри
 * секции оказывался на 88px выше конца страницы. Здесь рамка цепляется за низ
 * по-настоящему, а вверх уходит в «Контакты» — как в макете.
 *
 * Нижний край не гасим: за ним страница кончается, а под растушёвку попала бы
 * как раз плотная часть кадра — она лежит в нижних 15%.
 *
 * Координата снята подгонкой к рендеру макета: нода повёрнута, а метаданные
 * отдают размер и точку до поворота (подробнее в `widgets/Events`). Кадр —
 * рендер ноды, яркость переведена в альфу (подробнее в `widgets/Legend`).
 */
const FOG_LAYERS = [{ src: "/images/contacts/fog.webp", alpha: 1, scale: 1, anchor: true }];

/** Подвал — Figma node 114:2602, высота 89px */
export function SiteFooter() {
  return (
    <Section className="relative flex h-22 items-center lg:px-94">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 aspect-1920/1794"
      >
        <FogCanvas layers={FOG_LAYERS} feather={{ top: 0.08 }} />
      </div>

      <div className="text-mono-xs flex w-full flex-wrap items-center justify-between gap-4 text-cream">
        <span className="opacity-50">{CONTACTS.legal}</span>
        <span className="font-accent font-light">创意料理</span>
        <span className="opacity-50">{CONTACTS.requisites}</span>
      </div>
    </Section>
  );
}
