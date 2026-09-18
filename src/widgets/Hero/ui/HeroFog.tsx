"use client";

import { useEffect, useRef } from "react";

/**
 * Слой дыма — в макете он один. Рисуем на холсте, поэтому браузеру нечего
 * композитить по отдельности и швов на стыке полупрозрачных слоёв не бывает.
 *
 * `scale` — во сколько раз кадр крупнее холста, `alpha` — плотность,
 * `drift` — амплитуда медленного хода (доля холста), `speed` — его скорость,
 * `reach` — насколько слой уводит курсор (доля холста).
 */
const LAYERS = [{ scale: 1.35, alpha: 0.7, drift: 0.02, speed: 0.05, reach: 0.016, flip: false }];

const FOG_SRC = "/images/hero/fog.webp";

/**
 * Туман первого экрана — Figma node 114:2608 («59 1» поверх Hero).
 *
 * Дым живёт сам по себе — слои медленно расходятся по синусоиде — и тянется за
 * курсором с запаздыванием. При `prefers-reduced-motion` рисуется один
 * неподвижный кадр.
 */
export function HeroFog() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const image = new window.Image();

    let frame = 0;
    let width = 0;
    let height = 0;
    /** Куда тянется дым и где он сейчас — разница между ними и даёт запаздывание */
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();

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

      LAYERS.forEach((layer, index) => {
        const phase = (time / 1000) * layer.speed + index * 1.7;
        const offsetX = Math.sin(phase) * layer.drift * width + current.x * layer.reach * width;
        const offsetY =
          Math.cos(phase * 0.8) * layer.drift * height * 0.6 + current.y * layer.reach * height;

        const frameWidth = width * layer.scale;
        const frameHeight = frameWidth * (image.height / image.width);
        const left = (width - frameWidth) / 2 + offsetX;
        const top = (height - frameHeight) / 2 + offsetY;

        context.save();
        context.globalAlpha = layer.alpha;

        if (layer.flip) {
          // Второй слой разворачиваем, чтобы рисунок дыма не повторял первый
          context.translate(width / 2, height / 2);
          context.rotate(Math.PI);
          context.translate(-width / 2, -height / 2);
        }

        context.drawImage(image, left, top, frameWidth, frameHeight);
        context.restore();
      });

      if (!calm) frame = requestAnimationFrame(draw);
    };

    const onPointerMove = (event: PointerEvent) => {
      target.x = -(event.clientX / window.innerWidth - 0.5);
      target.y = -(event.clientY / window.innerHeight - 0.5);
    };

    const onResize = () => {
      resize();
      if (calm) draw(0);
    };

    image.onload = () => {
      resize();
      if (calm) draw(0);
      else frame = requestAnimationFrame(draw);
    };
    image.src = FOG_SRC;

    window.addEventListener("resize", onResize);
    if (!calm) window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
