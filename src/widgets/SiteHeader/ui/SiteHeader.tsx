import Image from "next/image";
import { Music2 } from "lucide-react";
import { BOOKING_PHONE_HREF, CONTACTS, NAV_ITEMS } from "@/shared/config";
import { Button, ButtonLink } from "@/shared/ui";

/** Шапка — Figma node 222:1985, 1920×96: навигация слева, действия справа */
export function SiteHeader() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="relative mx-auto flex w-full max-w-480 items-center justify-between px-5 pt-5 pb-10 lg:px-57">
        {/* Дымка под шапкой — заливка ноды 222:1985 */}
        <Image
          src="/images/common/header-bg.webp"
          alt=""
          aria-hidden
          fill
          priority
          className="pointer-events-none object-cover"
        />

        <nav className="text-mono-sm pointer-events-auto relative hidden items-center gap-7 text-cream lg:flex">
          {NAV_ITEMS.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="transition-colors hover:text-wine">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="pointer-events-auto relative ml-auto flex items-center gap-4">
          <ButtonLink href={BOOKING_PHONE_HREF} variant="ghost" size="sm" className="hidden sm:flex">
            {CONTACTS.bookingPhone}
          </ButtonLink>

          {/* TODO: подключить к фоновому аудио, когда появится features/ambient-sound */}
          <button
            type="button"
            aria-label="Включить звук"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-ink-dim text-cream transition-colors hover:border-cream"
          >
            <Music2 className="size-4" strokeWidth={1.5} />
          </button>

          {/* TODO: открывать форму брони, когда появится features/booking */}
          <Button size="sm">Забронировать стол</Button>
        </div>
      </div>
    </header>
  );
}
