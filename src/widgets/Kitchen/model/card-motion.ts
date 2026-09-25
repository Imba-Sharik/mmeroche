import { useSyncExternalStore } from "react";

/**
 * Как клетка ленты раскрывается карточкой блюда. Переворот клиенту не
 * понравился — собрали варианты на выбор:
 *
 * - `curtain` — карточка поднимается шторкой снизу, фото под ней чуть
 *   приближается;
 * - `iris` — карточка расходится кругом из точки, где вошёл курсор;
 * - `fade` — фото уходит в расфокус, карточка проявляется поверх;
 * - `flip` — прежний 3D-переворот, оставлен для сравнения.
 *
 * TODO: когда клиент выберет, оставить один вариант и убрать переключатель
 * `?card=` вместе с остальными.
 */
export const CARD_MOTIONS = ["curtain", "iris", "fade", "flip"] as const;
export type CardMotion = (typeof CARD_MOTIONS)[number];

export const DEFAULT_CARD_MOTION: CardMotion = "curtain";

const isCardMotion = (value: string | null): value is CardMotion =>
  CARD_MOTIONS.includes(value as CardMotion);

const readFromUrl = (): CardMotion => {
  const value = new URLSearchParams(window.location.search).get("card");
  return isCardMotion(value) ? value : DEFAULT_CARD_MOTION;
};

/** Адрес не меняется без перезагрузки — подписываться не на что */
const subscribe = () => () => {};

/**
 * Вариант из адреса страницы: `/?card=iris#kitchen`. На сервере адреса нет,
 * там всегда вариант по умолчанию, а после гидрации подменяется выбранным.
 */
export function useCardMotion(): CardMotion {
  return useSyncExternalStore(subscribe, readFromUrl, () => DEFAULT_CARD_MOTION);
}
