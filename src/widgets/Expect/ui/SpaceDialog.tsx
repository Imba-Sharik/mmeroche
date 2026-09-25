"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Dialog } from "radix-ui";
import { useCallback, useRef } from "react";
import { getLenis } from "@/shared/ui";
import type { ExpectCard } from "../model/cards";

/**
 * Градиент над текстом показываем, только пока ниже есть что читать:
 * докрутил до конца или текст влез целиком — его нет, и последние строки не
 * остаются в затухании. Считаем прямо в DOM, на прокрутке и при смене
 * размера, — перерисовывать модалку на каждое событие прокрутки незачем.
 */
function useFadeWhileMoreBelow() {
  const fadeRef = useRef<HTMLDivElement>(null);

  const scrollerRef = useCallback((scroller: HTMLDivElement | null) => {
    if (!scroller) return;

    const check = () => {
      const moreBelow = scroller.scrollTop + scroller.clientHeight < scroller.scrollHeight - 1;
      fadeRef.current?.classList.toggle("opacity-0", !moreBelow);
    };

    check();
    scroller.addEventListener("scroll", check, { passive: true });
    const observer = new ResizeObserver(check);
    observer.observe(scroller);

    return () => {
      scroller.removeEventListener("scroll", check);
      observer.disconnect();
    };
  }, []);

  return { scrollerRef, fadeRef };
}

/** Пока модалка открыта, Lenis стоит: иначе колесо крутило бы страницу под подложкой */
function toggleLenis(open: boolean) {
  const lenis = getLenis();
  if (open) lenis?.stop();
  else lenis?.start();
}

/**
 * «Подробнее» на карточке пространства и модалка с полным описанием —
 * Figma nodes 334:28 (десктоп) и 336:537 (мобильный).
 *
 * На мобильном панель на весь экран с полями 8px, крестик под ней у нижнего
 * края; на десктопе панель 664px по центру, крестик тоже под ней. Длинный
 * текст прокручивается внутри панели и затухает книзу градиентом к фону
 * (в мобильном макете — Rectangle 92). Прокрутке текста Lenis не мешает —
 * у блока `data-lenis-prevent`.
 */
export function SpaceDialog({ card }: { card: ExpectCard }) {
  const { scrollerRef, fadeRef } = useFadeWhileMoreBelow();

  return (
    <Dialog.Root onOpenChange={toggleLenis}>
      <Dialog.Trigger className="text-mono-sm mt-auto flex cursor-pointer items-center gap-1 p-2.5 text-cream transition-colors hover:text-wine">
        Подробнее
        <ArrowUpRight className="size-4 shrink-0" strokeWidth={1.2} />
      </Dialog.Trigger>

      <Dialog.Portal>
        {/* Подложка — Figma node 334:70: чёрный 25% и размытие страницы */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/25 backdrop-blur-[10px] duration-300 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />

        <Dialog.Content
          // Отдельного описания у модалки нет — весь текст и есть содержимое
          aria-describedby={undefined}
          className="fixed inset-x-2 top-2 bottom-4 z-50 flex flex-col items-center gap-4 outline-none duration-300 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:max-h-[calc(100dvh-40px)] sm:w-166 sm:-translate-x-1/2 sm:-translate-y-1/2"
        >
          <div className="flex min-h-0 w-full flex-1 flex-col gap-6 overflow-hidden rounded-[32px] bg-[#141414] p-4 sm:flex-initial sm:rounded-[56px] sm:p-8">
            <div className="relative h-60 w-full shrink-0 overflow-hidden rounded-2xl sm:h-75 sm:rounded-3xl">
              <Image
                src={card.image}
                alt={card.alt}
                fill
                sizes="(max-width: 640px) 100vw, 600px"
                className="object-cover"
              />
            </div>

            <div className="relative flex min-h-0 flex-col">
              <div
                ref={scrollerRef}
                data-lenis-prevent
                className="flex min-h-0 flex-col gap-4 overflow-y-auto overscroll-contain [scrollbar-width:none]"
              >
                <Dialog.Title className="text-display-md text-cream">{card.title}</Dialog.Title>
                <div className="text-mono-sm flex flex-col gap-4 leading-[1.4] text-dop">
                  {card.details.map((paragraph) => (
                    <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div
                ref={fadeRef}
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[#141414] to-transparent opacity-0 transition-opacity duration-300"
              />
            </div>
          </div>

          {/* Крестик — Figma node 334:86, под панелью */}
          <Dialog.Close className="shrink-0 cursor-pointer rounded-full transition-opacity hover:opacity-80">
            <Image
              src="/images/expect/close.svg"
              alt="Закрыть"
              width={44}
              height={44}
              unoptimized
            />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
