/** Сколько пальцу надо пройти, чтобы понять направление жеста, px */
const DECIDE = 8;

/** На сколько миллисекунд вперёд проецируем бросок, выбирая клетку для доводки */
const FLING = 220;

/**
 * Блокировка оси для ленты «Кухни» на мобильном: один жест двигает что-то
 * одно — либо ленту вбок, либо страницу вниз. Нативно палец мог тянуть обе
 * сразу, и лента со страницей ехали наискосок, сбивая друг друга.
 *
 * Направление решаем по первым `DECIDE` пикселям движения и держим до конца
 * касания:
 * - вбок — гасим прокрутку страницы (`preventDefault`) и ведём ленту сами;
 *   `snap` на это время снят, иначе браузер прищёлкивал бы ленту к клетке на
 *   каждом кадре. На отпускании доводим до клетки с учётом скорости броска
 *   и возвращаем `snap`, когда лента доехала;
 * - вниз — страница едет нативно, а ленту на время жеста замораживаем
 *   (`overflow-x: hidden`), чтобы она не ползла вбок заодно.
 *
 * Возвращает функцию снятия обработчиков.
 */
export function lockSwipeAxis(scroller: HTMLElement): () => void {
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let lastX = 0;
  let lastTime = 0;
  let velocity = 0;
  let axis: "x" | "y" | null = null;

  /** Шаг ленты — ширина колонки клеток вместе с зазором */
  const step = () => {
    const track = scroller.firstElementChild as HTMLElement | null;
    const tile = track?.querySelector<HTMLElement>("[tabindex]");
    if (!track || !tile) return scroller.clientWidth;
    return tile.offsetWidth + parseFloat(getComputedStyle(track).columnGap || "0");
  };

  const restoreSnap = () => {
    scroller.style.scrollSnapType = "";
  };

  const onStart = (event: TouchEvent) => {
    const touch = event.touches[0];
    startX = lastX = touch.clientX;
    startY = touch.clientY;
    startLeft = scroller.scrollLeft;
    lastTime = event.timeStamp;
    velocity = 0;
    axis = null;
  };

  const onMove = (event: TouchEvent) => {
    if (event.touches.length > 1) return;
    const touch = event.touches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;

    if (!axis) {
      if (Math.hypot(dx, dy) < DECIDE) return;
      axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (axis === "x") scroller.style.scrollSnapType = "none";
      else scroller.style.overflowX = "hidden";
    }

    if (axis !== "x") return;

    event.preventDefault();
    scroller.scrollLeft = startLeft - dx;

    const dt = event.timeStamp - lastTime;
    if (dt > 0) velocity = (touch.clientX - lastX) / dt;
    lastX = touch.clientX;
    lastTime = event.timeStamp;
  };

  const onEnd = () => {
    if (axis === "x") {
      const size = step();
      const projected = scroller.scrollLeft - velocity * FLING;
      const target = Math.round(projected / size) * size;

      scroller.scrollTo({ left: target, behavior: "smooth" });
      // `snap` возвращаем, когда лента доехала: раньше он прищёлкнул бы её рывком
      scroller.addEventListener("scrollend", restoreSnap, { once: true });
      window.setTimeout(restoreSnap, 700);
    }

    if (axis === "y") scroller.style.overflowX = "";
    axis = null;
  };

  scroller.addEventListener("touchstart", onStart, { passive: true });
  scroller.addEventListener("touchmove", onMove, { passive: false });
  scroller.addEventListener("touchend", onEnd, { passive: true });
  scroller.addEventListener("touchcancel", onEnd, { passive: true });

  return () => {
    scroller.removeEventListener("touchstart", onStart);
    scroller.removeEventListener("touchmove", onMove);
    scroller.removeEventListener("touchend", onEnd);
    scroller.removeEventListener("touchcancel", onEnd);
    scroller.removeEventListener("scrollend", restoreSnap);
    scroller.style.scrollSnapType = "";
    scroller.style.overflowX = "";
  };
}
