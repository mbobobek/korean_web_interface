export function CreateDeckScreen({ onBack, onDone }) {
  const root = document.createElement("div");
  root.className = "screen";

  root.innerHTML = `
    <button class="btn btn-soft w-fit mb-3" id="backBtn">← Ortga</button>
    <h2 class="text-2xl font-bold mb-2">Yangi Deck</h2>
    <p class="muted mb-3">Nom kiriting</p>
    <input id="nameInput" class="pill w-full" placeholder="Masalan: Qiyin so'zlar" />
    <div class="mt-3 flex gap-2">
      <button class="btn btn-soft" id="saveBtn" style="background:linear-gradient(135deg,#a7ffeb,#e3f2fd);color:#0f172a;font-weight:700;">Saqlash</button>
      <button class="btn btn-soft" id="cancelBtn">Bekor</button>
    </div>
  `;

  root.querySelector("#saveBtn").onclick = () => {
    const name = root.querySelector("#nameInput").value.trim();
    if (!name) return alert("Nom kiriting");
    onDone(name);
  };
  root.querySelector("#cancelBtn").onclick = onBack;
  root.querySelector("#backBtn").onclick = onBack;

  return root;
}
