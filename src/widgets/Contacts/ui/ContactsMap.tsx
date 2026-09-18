"use client";

import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CONTACTS } from "@/shared/config";
import { loadYmaps, type LngLat, type YMapInstance } from "@/shared/lib/ymaps";

/** Точка заведения — Figma node 114:2598. TODO: уточнить у клиента точное место входа */
const POINT: LngLat = [37.6455, 55.7265];
const ZOOM = 15;
const ZOOM_RANGE = { min: 12, max: 18 };

/**
 * Карта в «Контактах» на Yandex Maps JS API v3. Тёмная схема ложится в палитру
 * лендинга. Колесо мыши оставляем странице, иначе карта перехватывает прокрутку
 * посреди лендинга, — приближение вынесено на кнопки. Без ключа или при сбое
 * загрузки показываем снимок карты из макета.
 */
export function ContactsMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<YMapInstance | null>(null);
  const zoomRef = useRef(ZOOM);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadYmaps()
      .then((api) => {
        if (cancelled || !containerRef.current) return;

        const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } = api;

        const map = new YMap(containerRef.current, {
          location: { center: POINT, zoom: ZOOM },
          behaviors: ["drag", "pinchZoom", "dblClick"],
          zoomRange: ZOOM_RANGE,
        });
        mapRef.current = map;

        map.addChild(new YMapDefaultSchemeLayer({ theme: "dark" }));
        map.addChild(new YMapDefaultFeaturesLayer({}));

        // Метка ведёт в Яндекс.Карты — туда же, куда кнопка «Построить маршрут»
        const marker = document.createElement("a");
        marker.href = CONTACTS.routeUrl;
        marker.target = "_blank";
        marker.rel = "noreferrer noopener";
        marker.title = `${CONTACTS.brand} — открыть в Яндекс.Картах`;
        marker.className =
          "group pointer-events-auto flex -translate-x-1/2 -translate-y-full cursor-pointer flex-col items-center gap-2";
        marker.innerHTML = `
          <span class="block size-4.5 rounded-full bg-wine shadow-[0_0_0_9px_rgba(118,19,19,0.25)] transition-transform group-hover:scale-110"></span>
          <span class="font-sans text-[20px] whitespace-nowrap text-cream">${CONTACTS.brand}</span>
        `;
        map.addChild(new YMapMarker({ coordinates: POINT, zIndex: 10 }, marker));
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      mapRef.current?.destroy();
      mapRef.current = null;
    };
  }, []);

  const zoomBy = useCallback((delta: number) => {
    const map = mapRef.current;
    if (!map) return;

    const next = Math.min(ZOOM_RANGE.max, Math.max(ZOOM_RANGE.min, zoomRef.current + delta));
    if (next === zoomRef.current) return;

    zoomRef.current = next;
    map.setLocation({ zoom: next, duration: 250 });
  }, []);

  if (failed) {
    return (
      <Image
        src="/images/contacts/map.webp"
        alt="Карта: Кожевническая улица, 16 строение 4"
        fill
        sizes="(max-width: 1024px) 100vw, 576px"
        className="object-cover"
      />
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* Контролы карты рисуются на белом: не даём им унаследовать кремовый цвет текста */}
      <div ref={containerRef} className="h-full w-full text-noir" />

      <div className="absolute top-4 right-4 flex flex-col overflow-hidden rounded-[6px] border border-ink-faint bg-noir/70 backdrop-blur-[10px]">
        <button
          type="button"
          onClick={() => zoomBy(1)}
          aria-label="Приблизить"
          className="flex size-9 items-center justify-center text-cream transition-colors hover:text-wine"
        >
          <Plus className="size-4" strokeWidth={1.5} />
        </button>
        <span aria-hidden className="h-px bg-ink-faint" />
        <button
          type="button"
          onClick={() => zoomBy(-1)}
          aria-label="Отдалить"
          className="flex size-9 items-center justify-center text-cream transition-colors hover:text-wine"
        >
          <Minus className="size-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
