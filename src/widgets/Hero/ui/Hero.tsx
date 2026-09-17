import Image from "next/image";
import { CONTACTS } from "@/shared/config";
import { ScrollCue } from "./ScrollCue";

/** Виньетка макета: затемнение + уходы в чёрный по всем четырём краям (Figma node 114:2372) */
const SCRIM_GRADIENTS = [
  "linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.5) 100%)",
  "linear-gradient(0deg, rgb(1,1,1) 0%, rgba(1,1,1,0) 17.201%)",
  "linear-gradient(0deg, rgba(1,1,1,0) 81.376%, rgb(1,1,1) 100%)",
  "linear-gradient(90deg, rgb(1,1,1) 0%, rgba(1,1,1,0) 40.652%)",
  "linear-gradient(90deg, rgba(1,1,1,0) 59.348%, rgb(1,1,1) 100%)",
].join(", ");

/** Первый экран — Figma node 114:2371, 1920×1080 */
export function Hero() {
  return (
    <section className="relative h-svh min-h-[600px] w-full overflow-hidden bg-noir">
      {/* Фон: фото в режиме luminosity, поверх — виньетка */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 overflow-hidden mix-blend-luminosity">
          <Image
            src="/images/hero-scrim.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[55%_50%]"
          />
        </div>
        <div className="absolute inset-0" style={{ backgroundImage: SCRIM_GRADIENTS }} />
        {/* Бордовое свечение за лого — Figma node 114:2373 */}
        <div className="absolute top-[29.3%] left-1/2 h-[48.8%] w-[26.7vw] max-w-[512px] -translate-x-1/2 rounded-full bg-wine opacity-30 blur-[60px]" />
      </div>

      {/* Центральный блок: иероглифы → адрес → лого */}
      <div className="absolute top-[35%] left-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center px-5">
        <p className="font-accent text-center text-[13px] leading-[28px] font-light tracking-[2.6px] text-ink-dim">
          秘
          <br />
          密
          <br />之<br />地
        </p>

        <p className="text-mono-base mt-[11%] text-center text-ink-dim">{CONTACTS.address}</p>

        {/* TODO: MADAME набран временным Playfair — с приходом «a RomanusTitul»
            свериться с макетом, положение Roche считается от ширины этой строки */}
        <div className="relative mt-[6.6%] inline-block">
          <h1 className="font-sans text-[clamp(56px,10vw,192px)] leading-[0.51] text-cream">
            MADAME
          </h1>
          <Image
            src="/images/roche.svg"
            alt="Roche"
            width={349}
            height={236}
            priority
            unoptimized
            className="absolute top-[43%] left-[19.2%] w-[61.5%] -rotate-5"
          />
        </div>
      </div>

      <p className="font-accent absolute bottom-[14.4%] left-1/2 -translate-x-1/2 text-[13px] leading-none font-light tracking-[5.2px] text-wine">
        创 意 料 理
      </p>

      <div className="absolute bottom-[5.5%] left-1/2 -translate-x-1/2">
        <ScrollCue />
      </div>
    </section>
  );
}
