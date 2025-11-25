export function GwaScreen({ book, onBack, onSelectGwa }) {
  const root = document.createElement("div");
  root.className = "screen";

  root.innerHTML = `
    <button class="btn btn-soft w-fit mb-3" id="backBtn">← Ortga</button>
    <h2 class="text-2xl font-bold mb-1">${book}</h2>
    <p class="muted mb-3">Bo'lim (과) ni tanlang</p>
    <div class="grid-gwa">
      ${Array.from(
        { length: 8 },
        (_, i) => `
        <button class="pill" data-gwa="${i + 1}" style="background:linear-gradient(135deg,#e3f2fd,#a7ffeb);">
          ${i + 1} 과
        </button>
      `
      ).join("")}
    </div>
  `;

  root.querySelector("#backBtn").onclick = onBack;
  root.querySelectorAll("[data-gwa]").forEach((btn) => {
    btn.onclick = () => onSelectGwa(Number(btn.dataset.gwa));
  });

  return root;
}
