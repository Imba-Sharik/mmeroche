import { CONTACTS } from "@/shared/config";
import { Container, Section } from "@/shared/ui";

/**
 * Подвал — Figma node 222:2159, 1464×89.
 * В макете он лежит внутри «Контактов»; у нас это отдельный виджет из layout,
 * поэтому отступ сверху складывается из гэпа секции (40) и её паддинга (32).
 */
export function SiteFooter() {
  return (
    <Section className="pt-18 pb-10">
      <Container className="text-mono-xs flex flex-wrap items-center justify-between gap-4 text-cream">
        <span className="opacity-50">{CONTACTS.legal}</span>
        <span className="font-accent font-light">创意料理</span>
        <span className="opacity-50">{CONTACTS.requisites}</span>
      </Container>
    </Section>
  );
}
