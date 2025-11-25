export function LiveQuizMenu({ onBack, onHost, onJoin }) {
  const root = document.createElement("div");
  root.className = "screen";

  root.innerHTML = `
    <div class="flex-between mb-4">
      <h1 class="text-3xl font-bold">Live Quiz</h1>
      <button class="btn btn-soft w-fit" id="backBtn">Ortga</button>
    </div>
    <p class="muted mb-4">Host va Participant alohida sahifalarda.</p>
    <div class="grid-books">
      <button class="pill mode-card" id="hostBtn" style="background:linear-gradient(135deg,#e0f7fa,#80deea);">
        Host panel
      </button>
      <button class="pill mode-card" id="joinBtn" style="background:linear-gradient(135deg,#f3e5f5,#ce93d8);">
        Participant (Join)
      </button>
    </div>
  `;

  root.querySelector("#backBtn").onclick = onBack;
  root.querySelector("#hostBtn").onclick = onHost;
  root.querySelector("#joinBtn").onclick = onJoin;
  return root;
}
