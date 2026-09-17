const FALLBACK_URL = "http://localhost:3000";

/**
 * Базовый URL для metadataBase. `new URL()` падает на пустой строке и на хосте
 * без схемы (`mmeroche.ru`), а такой билд валится ещё на сборе конфигурации —
 * поэтому значение из окружения нормализуем и в крайнем случае откатываем на localhost.
 */
export function getSiteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return new URL(FALLBACK_URL);

  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    return new URL(withScheme);
  } catch {
    return new URL(FALLBACK_URL);
  }
}
