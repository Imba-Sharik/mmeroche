import { CONTACTS } from "@/shared/config";
import { typograf } from "@/shared/lib";
import { Container, Section } from "@/shared/ui";

/**
 * Подвал — Figma node 222:2159, 1464×89.
 * В макете он лежит внутри «Контактов»; у нас это отдельный виджет из layout,
 * поэтому отступ сверху складывается из гэпа секции (40) и её паддинга (32).
 * На мобильном (Figma node 336:321) всё столбиком по левому краю через 12px,
 * реквизиты — тоже по строке на пункт.
 */
export function SiteFooter() {
  return (
    <Section className="pt-18 pb-10">
      <Container className="text-mono-xs flex flex-col items-start gap-3 text-cream lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-4">
        {/* Прозрачность на частях, а не на обёртке: иначе ссылка не смогла бы стать ярче при наведении */}
        <span>
          <span className="opacity-50">{CONTACTS.legal} · </span>
          <a
            href={CONTACTS.group.url}
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-50 transition-opacity hover:opacity-100"
          >
            {CONTACTS.group.label}
          </a>
        </span>
        <span className="font-accent font-light">创意料理</span>
        {/* На десктопе пункты через два пробела моноширинного — `2ch` */}
        <span className="flex flex-col gap-3 opacity-50 lg:flex-row lg:gap-[2ch]">
          {CONTACTS.requisites.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </span>
        {/*
          Обычная ссылка, а не `next/link`: шапка считает переезд лого один раз
          на загрузке и при переходе без перезагрузки осталась бы с главной.
        */}
        <a href="/personal-data" className="opacity-50 transition-opacity hover:opacity-100">
          Обработка персональных данных
        </a>
        {/* Оговорка к звёздочке у Instagram в «Контактах» */}
        <p className="opacity-30 lg:basis-full">{typograf(CONTACTS.metaNotice)}</p>
      </Container>
    </Section>
  );
}
