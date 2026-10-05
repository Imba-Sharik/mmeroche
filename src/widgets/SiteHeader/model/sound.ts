import { useSyncExternalStore } from "react";

/**
 * Включён ли звук. Кнопок три (шапка на десктопе, на мобильном и в меню),
 * поэтому состояние общее, а не своё у каждой. По умолчанию выключен:
 * браузер всё равно не даст играть без жеста пользователя.
 *
 * TODO: включать и глушить фоновое аудио, когда клиент даст музыку.
 */
let enabled = false;
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function toggleSound() {
  enabled = !enabled;
  listeners.forEach((listener) => listener());
}

export function useSoundEnabled() {
  return useSyncExternalStore(
    subscribe,
    () => enabled,
    () => false,
  );
}
