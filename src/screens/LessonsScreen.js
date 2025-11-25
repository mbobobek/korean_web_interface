export function LessonsScreen({ onBack } = {}) {
  const root = document.createElement("div");
  root.className = "screen";
  const wrap = document.createElement("div");
  wrap.className = "p-6 max-w-3xl mx-auto rounded-3xl bg-white/40 backdrop-blur-xl shadow";
  wrap.innerHTML = `
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-bold">Lessons</h2>
      <button class="pill px-3 py-2 bg-slate-800 text-white" id="backBtn">Orqaga</button>
    </div>
    <p class="text-slate-600">Darslar sahifasi hozircha placeholder. Bu yerga kontent qo'shishingiz mumkin.</p>
  `;
  wrap.querySelector("#backBtn").onclick = (e) => {
    e.preventDefault();
    onBack?.();
  };
  root.appendChild(wrap);
  return root;
}

export default LessonsScreen;
