export function attachSwipe(el, { onLeft, onRight }) {
  let startX = null;
  el.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });
  el.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (dx < -50 && onLeft) onLeft();
    if (dx > 50 && onRight) onRight();
    startX = null;
  });
}
