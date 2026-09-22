import Image from "next/image";
import { GRID } from "@/shared/config";
import { DIVIDERS, type DividerName } from "../model/dividers";

/** Полоса между секциями: линия во всю ширину и реликвии на ней */
export function Divider({ variant }: { variant: DividerName }) {
  const { height, line, relics } = DIVIDERS[variant];

  return (
    <div
      aria-hidden
      className="relative w-full"
      style={{ aspectRatio: `${GRID.designWidth} / ${height}` }}
    >
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
          sizes="25vw"
          className="absolute h-auto"
          style={{
            left: relic.left,
            top: relic.top,
            width: `${(relic.width / GRID.designWidth) * 100}%`,
            rotate: `${relic.rotate}deg`,
          }}
        />
      ))}
    </div>
  );
}
