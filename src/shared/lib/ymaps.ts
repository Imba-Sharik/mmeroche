/**
 * Ленивая загрузка Yandex Maps JS API v3 — тот же подход, что во фронте
 * «Недвижки» (`shared/lib/ymaps.ts`). Скрипт подключается один раз на страницу,
 * промис переиспользуется. Ключ — NEXT_PUBLIC_YANDEX_MAPS_API_KEY, без него
 * карта не рендерится и секция откатывается на статичный снимок из макета.
 */

/** Пара координат в порядке [долгота, широта] — так их ждёт ymaps3 */
export type LngLat = [number, number];

export interface YMapLocationRequest {
  center?: LngLat;
  zoom?: number;
  duration?: number;
}

/** Слои и маркеры добавляются в карту через addChild — детали типов не нужны */
export interface YMapEntity {
  readonly __ymapEntity?: never;
}

export interface YMapInstance {
  addChild(child: YMapEntity): void;
  removeChild(child: YMapEntity): void;
  setLocation(location: YMapLocationRequest): void;
  destroy(): void;
}

export interface YMapsApi {
  ready: Promise<void>;
  YMap: new (
    element: HTMLElement,
    props: {
      location: YMapLocationRequest;
      behaviors?: string[];
      zoomRange?: { min: number; max: number };
    },
  ) => YMapInstance;
  YMapDefaultSchemeLayer: new (props: { theme?: "light" | "dark" }) => YMapEntity;
  YMapDefaultFeaturesLayer: new (props: Record<string, never>) => YMapEntity;
  YMapMarker: new (
    props: { coordinates: LngLat; zIndex?: number },
    element: HTMLElement,
  ) => YMapEntity;
}

declare global {
  interface Window {
    ymaps3?: YMapsApi;
  }
}

export const YMAPS_API_KEY = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY ?? "";

let loading: Promise<YMapsApi> | null = null;

export function loadYmaps(): Promise<YMapsApi> {
  if (loading) return loading;

  loading = new Promise<YMapsApi>((resolve, reject) => {
    if (!YMAPS_API_KEY) {
      reject(new Error("NEXT_PUBLIC_YANDEX_MAPS_API_KEY не задан"));
      return;
    }

    const done = (api?: YMapsApi) => {
      if (!api) {
        reject(new Error("Yandex Maps API не инициализировался"));
        return;
      }
      api.ready.then(() => resolve(api), reject);
    };

    if (window.ymaps3) {
      done(window.ymaps3);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://api-maps.yandex.ru/v3/?apikey=${YMAPS_API_KEY}&lang=ru_RU`;
    script.async = true;
    script.onload = () => done(window.ymaps3);
    script.onerror = () => reject(new Error("Не удалось загрузить Yandex Maps API"));
    document.head.appendChild(script);
  });

  return loading;
}
