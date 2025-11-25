export function addTilt(el) {
  const height = 20;
  el.addEventListener("pointermove", (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `rotateY(${x / height}deg) rotateX(${-y / height}deg)`;
  });
  el.addEventListener("pointerleave", () => {
    el.style.transform = "rotateY(0deg) rotateX(0deg)";
  });
}
