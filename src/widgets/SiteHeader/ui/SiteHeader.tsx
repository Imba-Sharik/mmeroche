import Image from "next/image";
import { Music2 } from "lucide-react";
import { CONTACTS, NAV_ITEMS } from "@/shared/config";

/** Шапка — Figma node 114:2397 (Header/inner), 1920×96, поля 80px */
export function SiteHeader() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="relative mx-auto flex w-full max-w-480 items-center justify-between px-5 pt-5 pb-6 lg:px-20 lg:pb-10">
        {/* Дымка под шапкой — Figma fill node 114:2397 */}
        <Image
          src="/images/header-bg.webp"
          alt=""
          aria-hidden
          fill
          priority
          className="pointer-events-none object-cover"
        />

        <div className="pointer-events-auto relative flex items-center gap-4">
          <span className="text-mono-sm text-cream">{CONTACTS.brand}</span>
          <span aria-hidden className="size-1 bg-wine" />
          <span className="text-mono-sm text-cream">{CONTACTS.city}</span>
        </div>

        <nav className="pointer-events-auto relative hidden items-center gap-7 lg:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-mono-sm text-cream transition-colors hover:text-wine"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="pointer-events-auto relative flex items-center gap-4">
          {/* TODO: подключить к фоновому аудио, когда появится features/ambient-sound */}
          <button
            type="button"
            aria-label="Включить звук"
            className="flex size-9 items-center justify-center rounded-[5px] bg-cream text-wine transition-opacity hover:opacity-80"
          >
            <Music2 className="size-4" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            className="text-mono-sm flex h-9 items-center rounded-[5px] bg-wine px-5 text-cream transition-opacity hover:opacity-90"
          >
            Забронировать стол
          </button>
        </div>
      </div>
    </header>
  );
}
