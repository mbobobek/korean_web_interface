import { SessionCard } from "../components/SessionCard.js";
import { ProgressBar } from "../components/ProgressBar.js";
import { store } from "../state/store.js";

export function SessionScreen({ onBack, onSelect, onFull, legend = true, title }) {
  const root = document.createElement("div");
  root.className = "screen";

  const total = store.sessions.flat().length;

  root.innerHTML = `
    <button class="btn btn-soft w-fit mb-3" id="backBtn">Ortga</button>
    <h2 class="text-xl font-bold mb-1">${title || `${store.book} | ${store.gwa}-bo'lim`}</h2>
    <p class="muted mb-3">Jami so'zlar: ${total} ta</p>
    ${onFull ? `<button class="btn btn-soft w-fit mb-3" id="fullBtn">To'liq (barchasi)</button>` : ""}
    <div id="list" class="flex flex-col gap-2 mb-3"></div>
    ${
      legend
        ? `<div class="tags">
      <span>Bilaman</span><span>Qiyin</span><span>Keyinroq</span>
    </div>`
        : ""
    }
  `;

  const list = root.querySelector("#list");
  store.sessions.forEach((session, idx) => {
    list.appendChild(
      SessionCard({
        index: idx,
        count: session.length,
        onClick: () => onSelect(idx),
      })
    );
  });

  root.appendChild(ProgressBar({ value: 0, total: total || 1 }));

  root.querySelector("#backBtn").onclick = onBack;
  if (onFull) {
    const fb = root.querySelector("#fullBtn");
    if (fb) fb.onclick = onFull;
  }
  return root;
}
