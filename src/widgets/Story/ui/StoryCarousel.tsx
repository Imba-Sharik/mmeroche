"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { STORY_SLIDES } from "../model/slides";

/** Карусель историй — Figma nodes 114:2518—114:2543 */
export function StoryCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-10">
          {STORY_SLIDES.map((slide) => (
            <article
              key={slide.id}
              className="relative aspect-1760/1052 max-h-[85svh] min-h-130 w-full shrink-0 overflow-hidden rounded-lg"
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 1760px"
                className="object-cover"
              />
              <div aria-hidden className="absolute inset-0 bg-black/70" />

              <div className="absolute top-1/2 left-1/2 flex w-full max-w-160 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-8 p-5 text-center">
                <h3 className="text-center font-sans text-[clamp(32px,2.9vw,55px)] leading-[1.05] text-balance text-cream uppercase">
                  {slide.title}
                </h3>
                <div className="text-mono-base flex max-w-106 flex-col gap-6.5 text-ink-dim">
                  {slide.paragraphs.map((text) => (
                    <p key={text} className="text-center text-pretty">
                      {text}
                    </p>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={scrollNext}
        aria-label="Следующая история"
        className="absolute top-1/2 right-5 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-wine p-3 text-cream backdrop-blur-[20px] transition-opacity hover:opacity-80"
      >
        <ArrowRight className="size-5" strokeWidth={1.5} />
      </button>

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
        {STORY_SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => scrollTo(index)}
            aria-label={`История ${index + 1}`}
            aria-current={index === selected}
            className={cn(
              "h-1 w-7.5 rounded-sm transition-colors",
              index === selected ? "bg-wine" : "bg-cream/20",
            )}
          />
        ))}
      </div>
    </div>
  );
}
