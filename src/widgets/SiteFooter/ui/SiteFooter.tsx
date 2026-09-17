import { Section } from "@/shared/ui";

export function SiteFooter() {
  return (
    <Section className="py-10">
      <div className="flex flex-wrap items-center justify-between gap-5 border-t border-line pt-6 text-sm text-ink-muted">
        <span>© {new Date().getFullYear()} Mmeroche</span>
      </div>
    </Section>
  );
}
