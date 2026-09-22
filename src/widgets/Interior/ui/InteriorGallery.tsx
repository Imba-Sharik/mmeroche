import Image from "next/image";
import { WineGlow } from "@/shared/ui";
import {
  INTERIOR_CANVAS,
  INTERIOR_GLOW,
  INTERIOR_PHOTOS,
  type InteriorPhoto,
} from "../model/photos";

function CollagePhoto({ photo }: { photo: InteriorPhoto }) {
  return (
    <div
      className="absolute"
      style={{
        left: photo.left,
        top: photo.top,
        width: photo.width,
        aspectRatio: photo.ratio,
        rotate: photo.rotate ? `${photo.rotate}deg` : undefined,
        opacity: photo.opacity,
      }}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        aria-hidden={photo.alt === "" || undefined}
        fill
        sizes="(max-width: 1024px) 50vw, 40vw"
        className="object-cover"
      />
    </div>
  );
}

/** Коллаж снимков зала — Figma node 222:2081, холст 1920×1830 */
export function InteriorGallery() {
  const under = INTERIOR_PHOTOS.slice(0, INTERIOR_GLOW.after);
  const over = INTERIOR_PHOTOS.slice(INTERIOR_GLOW.after);

  return (
    <div className="relative w-full" style={{ aspectRatio: INTERIOR_CANVAS }}>
      {under.map((photo) => (
        <CollagePhoto key={photo.src} photo={photo} />
      ))}

      {/* Свечение под ворохом записок — Figma node 222:2106 */}
      <WineGlow x={INTERIOR_GLOW.x} y={INTERIOR_GLOW.y} size={INTERIOR_GLOW.size} />

      {over.map((photo) => (
        <CollagePhoto key={photo.src} photo={photo} />
      ))}
    </div>
  );
}
