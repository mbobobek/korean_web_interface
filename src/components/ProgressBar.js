export function ProgressBar({ value, total }) {
  const wrap = document.createElement("div");
  wrap.className = "progress-wrap";
  const bar = document.createElement("div");
  bar.className = "progress-bar";
  const percent = total ? Math.round((value / total) * 100) : 0;
  bar.style.width = `${percent}%`;
  wrap.appendChild(bar);
  return wrap;
}
