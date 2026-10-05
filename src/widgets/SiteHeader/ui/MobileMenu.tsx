"use client";

import Image from "next/image";
import { Equal, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useRef, useState } from "react";
import { CONTACTS, linkTarget, MOBILE_NAV_ITEMS, PHONE_HREF } from "@/shared/config";
import { typograf } from "@/shared/lib";
import { ButtonLink, getLenis, scrollToSection } from "@/shared/ui";
import { SoundButton } from "./SoundButton";

/** Бордовая квадратная кнопка шапки: бургер и крестик — Figma nodes 336:476, 336:448 */
const SQUARE_BUTTON =
  "flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-wine text-cream transition-opacity hover:opacity-80";

/** Подпись над блоком контактов: 10px, капс, полупрозрачная */
function InfoBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 text-cream">
      <p className="font-ui text-[10px] leading-[1.2] uppercase opacity-50">{label}</p>
      <div className="text-mono-md leading-[1.4]">{children}</div>
    </div>
  );
}

/**
 * Мобильное меню — Figma node 336:437. Бургер в шапке открывает его на весь
 * экран: сверху та же строка шапки (звук, кремовое лого, крестик), под ней
 * пункты секций, дальше контакты и бронь.
 *
 * Пункт меню сперва закрывает меню, а везёт к секции, только когда оно
 * полностью растворилось. Пока меню на экране (и 0.3 с его исчезания),
 * Radix держит блокировку прокрутки: Lenis уже ехал, а страница стояла —
 * и после закрытия прыгала на середину пути и доезжала хвост.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  /** Секция, к которой едем, когда меню закроется */
  const pendingRef = useRef<string | null>(null);

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    const lenis = getLenis();
    if (next) lenis?.stop();
    else lenis?.start();
  };

  const goTo = (id: string) => {
    pendingRef.current = id;
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger aria-label="Открыть меню" className={SQUARE_BUTTON}>
        <Equal className="size-4" strokeWidth={1.5} />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Content
          aria-describedby={undefined}
          /*
            Срабатывает, когда меню уже размонтировано — после анимации
            исчезания. Фокус не возвращаем на бургер: он дёргал бы страницу
            к шапке. Кадр ждём, чтобы Radix успел снять блокировку прокрутки.
          */
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            const id = pendingRef.current;
            pendingRef.current = null;
            if (id) requestAnimationFrame(() => scrollToSection(id));
          }}
          data-lenis-prevent
          className="fixed inset-0 z-60 flex flex-col overflow-y-auto overscroll-contain bg-black duration-300 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 lg:hidden"
        >
          <Dialog.Title className="sr-only">Меню</Dialog.Title>

          <div className="flex shrink-0 items-start justify-between px-4 pt-4">
            <SoundButton />
            <Image
              src="/images/common/roche-header.svg"
              alt="Madame Roche"
              width={95}
              height={64}
              unoptimized
              // Наклон тот же, что у лого в шапке на мобильном (`tilt` в SiteHeader)
              className="h-16 w-auto -rotate-8 sm:-rotate-5"
            />
            <Dialog.Close aria-label="Закрыть меню" className={SQUARE_BUTTON}>
              <X className="size-4" strokeWidth={1.5} />
            </Dialog.Close>
          </div>

          <nav className="flex flex-col items-center gap-7 border-b border-cream/20 px-4 py-8 font-sans text-2xl leading-none text-cream uppercase">
            {MOBILE_NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(event) => {
                  event.preventDefault();
                  goTo(item.id);
                }}
                className="transition-colors hover:text-wine"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-5 px-4 py-6">
            <InfoBlock label="Адрес">
              {CONTACTS.addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </InfoBlock>
            <InfoBlock label="График">
              {CONTACTS.hours.map((line) => (
                <p key={line} className="whitespace-pre">
                  {line}
                </p>
              ))}
            </InfoBlock>
            <InfoBlock label="Телефон">
              <a href={PHONE_HREF}>{CONTACTS.phone}</a>
            </InfoBlock>

            <ButtonLink
              href={CONTACTS.bookingUrl}
              {...linkTarget(CONTACTS.bookingUrl)}
              size="lg"
              className="w-full"
            >
              Забронировать стол
            </ButtonLink>

            <p className="text-mono-xs text-cream/50">
              {CONTACTS.links.map((link, index) => (
                <span key={link.label}>
                  {index > 0 && " · "}
                  <a
                    href={link.href}
                    {...linkTarget(link.href)}
                    className="transition-colors hover:text-cream"
                  >
                    {link.label}
                  </a>
                </span>
              ))}
            </p>
            <p className="text-mono-xs -mt-2 text-cream/30">{typograf(CONTACTS.metaNotice)}</p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
