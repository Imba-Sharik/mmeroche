"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGsapLayout } from "@/shared/lib";
import { SPACES, type Space } from "../model/spaces";

/** Высота кадра, svh — по макету 574 из 1080 */
const FRAME = 53;
/**
 * Шаг диагонали между соседними кадрами. По отдельности шаг по X и по Y меньше
 * размера кадра, но вместе дают расстояние больше его диагонали — кадры идут
 * встык по линии и не накладываются.
 */
const STEP_X = 30;
const STEP_Y = 45;
/** Яркость кадров, которые сейчас не в центре */
const DIMMED = 0.55;

/** Смена этапа играет своим временем, а не по скорости прокрутки */
const MOVE = { duration: 1.4, ease: "power3.out" } as const;
/** Размах подписи под маской, yPercent */
const LINE_TRAVEL = 150;

/**
 * Линия закольцована: перед первым пространством стоит последнее, после
 * последнего — первое. За счёт хвостов на каждом этапе в кадре три снимка.
 */
const FRAMES = [SPACES[SPACES.length - 1], ...SPACES, SPACES[0]];

/** Подпись пространства: номер слева, колонка справа — Figma nodes 114:2469, 114:2470 */
function SpaceInfo({ space }: { space: Space }) {
  return (
    <>
      <div className="js-space-info absolute bottom-[12%] left-[20.3%] overflow-hidden">
        <span className="js-space-line block pb-[0.08em] font-sans text-[clamp(48px,3.9vw,75px)] leading-[1.05] text-wine">
          {space.number}
        </span>
      </div>

      <div className="js-space-info absolute top-[23.4%] left-[73.7%] flex w-[22%] min-w-80 flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="overflow-hidden">
            <p className="js-space-line text-mono-xs text-ink-dim">{space.meta}</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="overflow-hidden">
              <h3 className="js-space-line pb-[0.08em] font-sans text-[clamp(32px,2.9vw,55px)] leading-[1.05] text-cream">
                {space.name}
              </h3>
            </div>
            <div className="overflow-hidden">
              <p className="js-space-line text-mono-sm max-w-71 text-ink-dim">
                {space.description}
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden">
          <dl className="js-space-line flex w-69.25 items-center overflow-hidden rounded-[8px] border border-ink-dim">
            {space.capacity.map((item, position) => (
              <div
                key={item.label}
                className={`flex flex-1 flex-col items-center justify-center gap-1.5 p-3 ${
                  position === 0 ? "border-r border-ink-dim" : ""
                }`}
              >
                <dd className="font-sans text-[32px] leading-[0.9] text-cream">{item.value}</dd>
                <dt className="text-mono-xs text-ink-dim">{item.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </>
  );
}

/**
 * Пространства — Figma node 114:2464.
 *
 * Четыре этапа внутри запиненной секции. Снимки стоят одной диагональной линией
 * и переезжают из нижнего правого угла в верхний левый: активный оказывается по
 * центру, соседи выглядывают из углов. Подписи закреплены на своих местах —
 * меняется только их содержимое: старая уходит под маску вверх, новая приезжает
 * снизу из размытия. На мобильных — обычный список.
 */
export function SpacesCarousel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  useGsapLayout(() => {
    const section = sectionRef.current;
    const rail = railRef.current;
    if (!section || !rail) return;

    const media = gsap.matchMedia();
    const steps = SPACES.length - 1;

    media.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const frames = gsap.utils.toArray<HTMLElement>(".js-space-frame", rail);
      const infos = gsap.utils.toArray<HTMLElement>(".js-space-info", section);
      const linesOf = (info: HTMLElement) =>
        gsap.utils.toArray<HTMLElement>(".js-space-line", info);
      /** У каждого пространства две подписи: номер слева и колонка справа */
      const infosOf = (index: number) => [infos[index * 2], infos[index * 2 + 1]].filter(Boolean);

      let active = 0;
      const stepX = () => (STEP_X * window.innerWidth) / 100;
      const stepY = () => (STEP_Y * window.innerHeight) / 100;

      /** Раскладка линии: нулевой кадр — хвост перед первым пространством */
      const layout = () => {
        frames.forEach((frame, position) => {
          gsap.set(frame, {
            xPercent: -50,
            yPercent: -50,
            x: (position - 1) * stepX(),
            y: (position - 1) * stepY(),
          });
        });
        gsap.set(rail, { x: -active * stepX(), y: -active * stepY() });
      };

      const dim = (index: number, animate: boolean) => {
        frames.forEach((frame, position) => {
          const value = position - 1 === index ? 1 : DIMMED;
          if (animate) gsap.to(frame, { autoAlpha: value, overwrite: "auto", ...MOVE });
          else gsap.set(frame, { autoAlpha: value });
        });
      };

      layout();
      dim(0, false);

      // Подписи остальных пространств ждут своего этапа под нижним краем масок
      SPACES.forEach((_, index) => {
        if (index === 0) return;
        infosOf(index).forEach((info) =>
          gsap.set(linesOf(info), { yPercent: LINE_TRAVEL, autoAlpha: 0, filter: "blur(10px)" }),
        );
      });

      const show = (index: number) => {
        if (index === active) return;
        const previous = active;
        active = index;

        gsap.to(rail, { x: -index * stepX(), y: -index * stepY(), overwrite: "auto", ...MOVE });
        dim(index, true);

        infosOf(previous).forEach((info) =>
          gsap.to(linesOf(info), {
            yPercent: -LINE_TRAVEL,
            autoAlpha: 0,
            filter: "blur(10px)",
            overwrite: "auto",
            ...MOVE,
          }),
        );
        infosOf(index).forEach((info) =>
          gsap.fromTo(
            linesOf(info),
            { yPercent: LINE_TRAVEL, autoAlpha: 0, filter: "blur(10px)" },
            {
              yPercent: 0,
              autoAlpha: 1,
              filter: "blur(0px)",
              stagger: 0.05,
              overwrite: "auto",
              ...MOVE,
            },
          ),
        );
      };

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${steps * window.innerHeight}`,
        pin: true,
        invalidateOnRefresh: true,
        snap: { snapTo: 1 / steps, duration: 0.4, ease: "power2.inOut" },
        // Прокрутка выбирает этап, временем анимации управляет show()
        onUpdate: (self) => show(Math.round(self.progress * steps)),
        onRefresh: layout,
      });
    });

    // Первый этап собирается из-под масок, когда секция вошла на треть экрана
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(gsap.utils.toArray<HTMLElement>(".js-space-line", section).slice(0, 5), {
        yPercent: LINE_TRAVEL,
        autoAlpha: 0,
        filter: "blur(10px)",
        stagger: 0.05,
        scrollTrigger: { trigger: section, start: "top bottom-=33.33%", once: true },
        ...MOVE,
      });
    });

    return () => {
      media.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <div ref={sectionRef} className="relative w-full lg:h-svh lg:overflow-hidden">
      {/* Линия снимков: позиции задаёт GSAP, в разметке только точка отсчёта */}
      <div ref={railRef} className="hidden lg:absolute lg:inset-0 lg:block">
        {FRAMES.map((space, position) => (
          <div
            key={`${space.number}-${position}`}
            className="js-space-frame absolute top-1/2 left-1/2 aspect-square overflow-hidden rounded-[8px]"
            style={{ height: `${FRAME}svh` }}
          >
            <Image
              src={space.photo.src}
              alt={space.photo.alt}
              fill
              sizes="574px"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div className="hidden lg:block">
        {SPACES.map((space) => (
          <SpaceInfo key={space.number} space={space} />
        ))}
      </div>

      {/* Мобильная раскладка: кадр и подпись под ним */}
      <div className="flex flex-col gap-16 lg:hidden">
        {SPACES.map((space) => (
          <article key={space.number} className="flex flex-col gap-6">
            <div className="relative aspect-square w-full overflow-hidden rounded-[8px]">
              <Image
                src={space.photo.src}
                alt={space.photo.alt}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-mono-xs text-ink-dim">
                {space.number} · {space.meta}
              </p>
              <h3 className="font-sans text-[32px] leading-[0.9] text-cream">{space.name}</h3>
              <p className="text-mono-sm text-ink-dim">{space.description}</p>
            </div>
            <dl className="flex w-69.25 items-center overflow-hidden rounded-[8px] border border-ink-dim">
              {space.capacity.map((item, position) => (
                <div
                  key={item.label}
                  className={`flex flex-1 flex-col items-center justify-center gap-1.5 p-3 ${
                    position === 0 ? "border-r border-ink-dim" : ""
                  }`}
                >
                  <dd className="font-sans text-[32px] leading-[0.9] text-cream">{item.value}</dd>
                  <dt className="text-mono-xs text-ink-dim">{item.label}</dt>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}
