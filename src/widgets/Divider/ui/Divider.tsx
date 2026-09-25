import Image from "next/image";
import { GRID } from "@/shared/config";
import { Reveal } from "@/shared/ui";
import { DIVIDERS, type DividerName } from "../model/dividers";

/** Левый край реликвии на мобильном: тот же сдвиг от центра, что в макете 1920, в пикселях */
const offsetFromCenter = (left: string) =>
  `calc(50% + ${(parseFloat(left) / 100) * GRID.designWidth - GRID.designWidth / 2}px)`;

/**
 * Полоса между секциями: линия во всю ширину и реликвии на ней.
 *
 * От `lg` полоса держит пропорцию макета 1920 и масштабируется вместе с
 * реликвиями. На мобильном так нельзя — на 360 они сжимались в 5 раз, до
 * пятнышек. Там полоса своей высоты из макета, реликвии в натуральную
 * величину и стоят на том же расстоянии от центра, что и в макете —
 * мобильный макет (Figma 336:151, 336:168, 336:209) повторяет их один в один.
 */
export function Divider({ variant }: { variant: DividerName }) {
  const { height, line, relics } = DIVIDERS[variant];

  return (
    <div
      aria-hidden
      className="relative h-(--h) w-full lg:aspect-(--ratio) lg:h-auto"
      style={
        {
          "--h": `${height}px`,
          "--ratio": `${GRID.designWidth} / ${height}`,
        } as React.CSSProperties
      }
    >
      <Reveal>
        {/* Линия не сплошная: по краям уходит в ноль, в середине — полный cream */}
        <span
          className="absolute inset-x-0 h-px"
          style={{
            top: line,
            backgroundImage:
              "linear-gradient(90deg, rgb(242 241 224 / 0) 0%, var(--cream) 50%, rgb(242 241 224 / 0) 100%)",
          }}
        />

        {relics.map((relic) => (
          <Image
            key={relic.src}
            src={relic.src}
            alt=""
            width={relic.width}
            height={relic.height}
            sizes="(max-width: 1024px) 120px, 25vw"
            className="absolute left-(--left) h-auto w-(--w) lg:left-(--left-lg) lg:w-(--w-lg)"
            style={
              {
                "--left": offsetFromCenter(relic.left),
                "--left-lg": relic.left,
                "--w": `${relic.width}px`,
                "--w-lg": `${(relic.width / GRID.designWidth) * 100}%`,
                top: relic.top,
                rotate: `${relic.rotate}deg`,
              } as React.CSSProperties
            }
          />
        ))}
      </Reveal>
    </div>
  );
}
