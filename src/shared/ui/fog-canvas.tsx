"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/shared/lib/utils";

export interface FogLayer {
  /** Кадр дыма из макета */
  src: string;
  /** Плотность — прозрачность слоя в Figma */
  alpha?: number;
  /** Ширина кадра в долях ширины холста */
  scale?: number;
  /** Наклон кадра, градусы по часовой */
  rotate?: number;
  /** Центр кадра в долях холста: 0.5 / 0.5 — ровно посередине */
  x?: number;
  y?: number;
  /** Амплитуда медленного хода, доля холста */
  drift?: number;
  /** Скорость хода */
  speed?: number;
  /** Насколько слой уводит курсор, доля холста */
  reach?: number;
  /**
   * Кадр прибит к холсту и не двигается вовсе.
   *
   * Слои секций взяты рендерами нод, обрезанными рамкой макета, и совпадают с
   * холстом по краям — сдвигать их некуда. Уйдёт вбок — у края обнажается
   * полоса; уйдёт вниз — холст срежет то, что вылезло за рамку, и срез виден
   * прямой линией. Ход считается в долях холста, а он бывает в несколько
   * экранов высотой, так что «медленный» сдвиг доходит до сотни пикселей.
   *
   * Первому экрану не нужен: там кадр в 1.35 ширины экрана, запас есть.
   */
  anchor?: boolean;
}

/**
 * Потолок площади растра. Холст тумана бывает в несколько экранов высотой, и
 * на retina он вырастает до сотни мегабайт; дым низкочастотный, недобор
 * плотности точек на нём не виден. Первому экрану запаса хватает с избытком.
 */
const MAX_PIXELS = 9_000_000;

/** Значения первого экрана: слой без наклона по центру холста */
const DEFAULTS = {
  alpha: 0.7,
  scale: 1.35,
  rotate: 0,
  x: 0.5,
  y: 0.5,
  drift: 0.02,
  speed: 0.05,
  reach: 0.016,
  anchor: false,
};

interface FogCanvasProps {
  layers: FogLayer[];
  /**
   * Доля высоты, на которой дым гаснет к границам холста: число — на обе сразу,
   * объект — по краям раздельно.
   *
   * Рамку холста нельзя совместить с макетом: там высоты секций фиксированные,
   * у нас набираются содержимым, и на живой странице граница уезжает на сотню
   * пикселей. Всё, что вышло за неё, холст режет начисто, и срез читается
   * полосой — хватает альфы в пару единиц. Растушёвка снимает это на корню: у
   * границы содержимого просто нет, где бы она ни оказалась.
   *
   * Край, совпадающий с концом страницы, не гасим: за ним ничего нет, а под
   * растушёвку попала бы как раз плотная часть кадра. Первому экрану она не
   * нужна вовсе — там холст во весь экран и краёв не видно.
   */
  feather?: number | { top?: number; bottom?: number };
  className?: string;
}

/**
 * Дым секции. Все слои пишем в один холст, а не в стопку полупрозрачных
 * `<Image>`: полноэкранные полупрозрачные слои браузер композитит по
 * отдельности и режет на тайлы — на стыке видны прямоугольные швы.
 *
 * Дым живёт сам по себе — слои расходятся по синусоиде — и тянется за
 * курсором с запаздыванием. За кадром цикл останавливается, при
 * `prefers-reduced-motion` рисуется один неподвижный кадр.
 */
export function FogCanvas({ layers, feather = 0, className }: FogCanvasProps) {
  const featherKey = JSON.stringify(feather);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Массив приходит литералом на каждый рендер — сравниваем по составу
  const signature = JSON.stringify(layers);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const specs: Required<FogLayer>[] = (JSON.parse(signature) as FogLayer[]).map((layer) => ({
      ...DEFAULTS,
      ...layer,
    }));
    const raw: number | { top?: number; bottom?: number } = JSON.parse(featherKey);
    const edges =
      typeof raw === "number"
        ? { top: raw, bottom: raw }
        : { top: raw.top ?? 0, bottom: raw.bottom ?? 0 };
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let frame = 0;
    let ready = false;
    let onscreen = false;
    let width = 0;
    let height = 0;
    /** Куда тянется дым и где он сейчас — разница между ними и даёт запаздывание */
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    let pending = specs.length;
    const images = specs.map((layer) => {
      const image = new window.Image();

      image.onload = () => {
        pending -= 1;
        if (pending > 0) return;

        ready = true;
        resize();
        sync();
      };
      image.src = layer.src;

      return image;
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const area = rect.width * rect.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(MAX_PIXELS / area));

      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);

      // Догоняем курсор плавно: резкий отклик читается как рывок всего дыма
      current.x += (target.x - current.x) * 0.04;
      current.y += (target.y - current.y) * 0.04;

      specs.forEach((layer, index) => {
        const image = images[index];
        if (!image.complete || !image.naturalWidth) return;

        // Разбег по фазе, иначе слои ходят синхронно и читаются как один
        const phase = (time / 1000) * layer.speed + index * 1.7;
        const offsetX = layer.anchor
          ? 0
          : Math.sin(phase) * layer.drift * width + current.x * layer.reach * width;
        const offsetY = layer.anchor
          ? 0
          : Math.cos(phase * 0.8) * layer.drift * height * 0.6 + current.y * layer.reach * height;

        const frameWidth = width * layer.scale;
        const frameHeight = frameWidth * (image.naturalHeight / image.naturalWidth);

        context.save();
        context.globalAlpha = layer.alpha;
        context.translate(layer.x * width + offsetX, layer.y * height + offsetY);
        if (layer.rotate) context.rotate((layer.rotate * Math.PI) / 180);
        context.drawImage(image, -frameWidth / 2, -frameHeight / 2, frameWidth, frameHeight);
        context.restore();
      });

      context.save();
      context.globalCompositeOperation = "destination-out";
      [
        [edges.top, 0, 1],
        [edges.bottom, height, -1],
      ].forEach(([share, from, dir]) => {
        if (share <= 0) return;

        const band = height * share;
        const ramp = context.createLinearGradient(0, from, 0, from + dir * band);
        ramp.addColorStop(0, "rgba(0,0,0,1)");
        ramp.addColorStop(1, "rgba(0,0,0,0)");
        context.fillStyle = ramp;
        context.fillRect(0, dir > 0 ? from : from - band, width, band);
      });
      context.restore();

      if (!calm && onscreen) frame = requestAnimationFrame(draw);
    };

    /** Цикл крутим только пока секция в кадре — за его пределами он не виден */
    const sync = () => {
      if (!ready) return;

      cancelAnimationFrame(frame);
      if (calm || !onscreen) draw(0);
      else frame = requestAnimationFrame(draw);
    };

    const onPointerMove = (event: PointerEvent) => {
      target.x = -(event.clientX / window.innerWidth - 0.5);
      target.y = -(event.clientY / window.innerHeight - 0.5);
    };

    const onResize = () => {
      resize();
      sync();
    };

    const observer = new IntersectionObserver(([entry]) => {
      onscreen = entry.isIntersecting;
      sync();
    });
    observer.observe(canvas);

    window.addEventListener("resize", onResize);
    if (!calm) window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [signature, featherKey]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}
