import { CONTACTS } from "@/shared/config";
import { Section } from "@/shared/ui";

/** Подвал — Figma node 114:2602, высота 89px */
export function SiteFooter() {
  return (
    <Section className="flex h-22 items-center lg:px-94">
      <div className="text-mono-xs flex w-full flex-wrap items-center justify-between gap-4 text-cream">
        <span className="opacity-50">{CONTACTS.legal}</span>
        <span className="font-accent font-light">创意料理</span>
        <span className="opacity-50">{CONTACTS.requisites}</span>
      </div>
    </Section>
  );
}
