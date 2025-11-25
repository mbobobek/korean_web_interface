export function EndScreen({ store, onHome, onRetryHard }) {
  const root = document.createElement("div");
  root.className = "screen text-center";

  const total = store.stats.know.length + store.stats.hard.length + store.stats.later.length;
  const ratio = total ? Math.round((store.stats.know.length / total) * 100) : 0;
  const message = ratio >= 80 ? "Ajoyib!" : ratio >= 50 ? "Yaxshi davom et!" : "Keling, takrorlaymiz!";

  root.innerHTML = `
    <h2 class="text-3xl font-bold mb-2">Yakun</h2>
    <p class="muted mb-4">${message}</p>
    <div class="pill mb-4">
      ⭐ Bilganlar: ${store.stats.know.length}<br/>
      ⚠ Qiyinlar: ${store.stats.hard.length}<br/>
      🔁 Keyinroqlar: ${store.stats.later.length}<br/>
      Jami: ${total}
    </div>
    <div class="flex flex-col gap-2 max-w-xs mx-auto">
      <button class="btn btn-soft" id="retryHard">⚠ Qiyinlarni qayta o‘qish</button>
      <button class="btn btn-soft" id="homeBtn">🏠 Bosh menyu</button>
    </div>
  `;

  root.querySelector("#retryHard").onclick = onRetryHard;
  root.querySelector("#homeBtn").onclick = onHome;

  return root;
}
