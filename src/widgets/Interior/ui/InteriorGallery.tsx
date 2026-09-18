import Image from "next/image";

/**
 * Россыпь снимков зала — Figma node 114:2489, холст 1920×3692.
 * Координаты держим в процентах от холста, поэтому сетка тянется по ширине.
 * Кадры с left > 100% в макете лежат за правым краем — они ждут параллакса
 * (GSAP), пока просто обрезаются контейнером.
 */
const PHOTOS = [
  {
    src: "/images/interior/ceiling.webp",
    alt: "Зал с расписным потолком",
    left: "42.81%",
    top: "0%",
    width: "53.02%",
    ratio: "1018/700",
  },
  {
    src: "/images/interior/hall.webp",
    alt: "Столик у окна",
    left: "4.17%",
    top: "19.5%",
    width: "23.18%",
    ratio: "445/400",
  },
  {
    src: "/images/interior/tall.webp",
    alt: "",
    left: "112.29%",
    top: "19.5%",
    width: "14.38%",
    ratio: "276/634",
  },
  {
    src: "/images/interior/wide.webp",
    alt: "",
    left: "127.71%",
    top: "19.5%",
    width: "50.73%",
    ratio: "974/635",
  },
  {
    src: "/images/interior/tables.webp",
    alt: "Сервированные столы",
    left: "42.81%",
    top: "24.92%",
    width: "37.55%",
    ratio: "721/600",
  },
  {
    src: "/images/interior/wide.webp",
    alt: "Общий вид зала и бара",
    left: "11.88%",
    top: "47.13%",
    width: "76.25%",
    ratio: "1464/800",
  },
  {
    src: "/images/interior/hall.webp",
    alt: "Уголок зала",
    left: "42.81%",
    top: "74.76%",
    width: "29.84%",
    ratio: "573/400",
  },
  {
    src: "/images/interior/wide.webp",
    alt: "",
    left: "19.64%",
    top: "86.13%",
    width: "14.38%",
    ratio: "1/1",
  },
];

/** Дым поверх снимков — Figma nodes 114:2502—114:2504 */
const SMOKE = [
  {
    src: "/images/interior/smoke-c.webp",
    left: "-20.36%",
    top: "12.22%",
    width: "143.75%",
    opacity: 0.4,
    rotate: "0deg",
  },
  {
    src: "/images/interior/smoke-a.webp",
    left: "-4.32%",
    top: "68.2%",
    width: "119.9%",
    opacity: 0.3,
    rotate: "180deg",
  },
  {
    src: "/images/interior/smoke-b.webp",
    left: "-6.61%",
    top: "-14.82%",
    width: "110.38%",
    opacity: 0.3,
    rotate: "-177.11deg",
  },
];

export function InteriorGallery() {
  return (
    <div className="relative aspect-1920/3692 w-full overflow-hidden">
      {/* Бордовые свечения — Figma nodes 114:2500, 114:2501 */}
      <div
        aria-hidden
        className="absolute top-[33.05%] -left-[18.96%] w-[25.36%] bg-wine opacity-54 blur-[140px]"
        style={{ aspectRatio: "1/1" }}
      />
      <div
        aria-hidden
        className="absolute top-[80.47%] left-[94.06%] w-[19.69%] bg-wine opacity-54 blur-[120px]"
        style={{ aspectRatio: "1/1" }}
      />

      {PHOTOS.map((photo, index) => (
        <div
          key={`${photo.src}-${index}`}
          className="absolute overflow-hidden rounded-[8px]"
          style={{ left: photo.left, top: photo.top, width: photo.width, aspectRatio: photo.ratio }}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 1024px) 60vw, 50vw"
            className="object-cover"
          />
        </div>
      ))}

      {/* Полароид поверх кадров — Figma node 114:2499 */}
      <Image
        src="/images/interior/polaroid.webp"
        alt=""
        aria-hidden
        width={500}
        height={623}
        sizes="10vw"
        className="absolute top-[18.95%] left-[41.43%] w-[8.48%] -translate-x-1/2 -translate-y-1/2 rotate-[13.55deg]"
      />

      {/* Квадратный кадр с наклоном — Figma node 114:2498 */}
      <Image
        src="/images/interior/square.webp"
        alt="Зал крупным планом"
        width={1254}
        height={1254}
        sizes="40vw"
        className="absolute top-[72.33%] left-[40.29%] w-[38.8%] -translate-x-1/2 -translate-y-1/2 rotate-[-3.82deg] rounded-[8px]"
      />

      {SMOKE.map((smoke, index) => (
        <Image
          key={`${smoke.src}-${index}`}
          src={smoke.src}
          alt=""
          aria-hidden
          width={2000}
          height={1390}
          sizes="150vw"
          className="pointer-events-none absolute max-w-none mix-blend-screen"
          style={{
            left: smoke.left,
            top: smoke.top,
            width: smoke.width,
            opacity: smoke.opacity,
            rotate: smoke.rotate,
          }}
        />
      ))}
    </div>
  );
}
