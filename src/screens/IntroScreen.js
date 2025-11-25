export function IntroScreen({ onStart }) {
  const root = document.createElement("div");
  root.className = "screen";

  root.innerHTML = `
    <h2 class="text-2xl font-bold mb-2">Qoidalar</h2>
    <div class="pill mb-3">
      <div>⭐ Bilaman — shu kartani o‘tkazamiz</div>
      <div>⚠️ Qiyin — keyingi qismga yuboramiz</div>
      <div>🔁 Keyinroq — sessiya oxiriga qaytariladi</div>
      <div>☆ Saqlash — MyDeck’ga qo‘shamiz</div>
    </div>
    <button
      class="btn btn-soft"
      id="startBtn"
      style="background:linear-gradient(135deg,#fce4ec,#a7ffeb);color:#0f172a;font-weight:700;"
    >
      Boshlash →
    </button>
  `;

  root.querySelector("#startBtn").onclick = onStart;
  return root;
}
