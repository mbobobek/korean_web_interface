export function SessionCard({ index, count, onClick }) {
  const btn = document.createElement("button");
  btn.className = "session-card";
  btn.innerHTML = `
    <div>
      <div class="font-semibold">Session ${index + 1}</div>
      <div class="muted">${count} ta so'z</div>
    </div>
    <div class="text-lg">→</div>
  `;
  btn.onclick = onClick;
  return btn;
}
