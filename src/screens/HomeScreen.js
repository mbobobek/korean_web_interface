export function HomeScreen({ onFlash, onTypeCheck, onTest, onLiveQuiz, onAi }) {
  const root = document.createElement("div");
  root.className = "screen";

  root.innerHTML = `
    <h1 class="text-3xl font-bold mb-4">Korean Bot</h1>
    <div class="grid-books">
      <button class="pill mode-card" id="flashBtn" style="background:linear-gradient(135deg,#fce4ec,#e1bee7);">
        Flashcards
      </button>
      <button class="pill mode-card" id="typeBtn" style="background:linear-gradient(135deg,#e3f2fd,#a7ffeb);">
        Type & Check
      </button>
      <button class="pill mode-card" id="testBtn" style="background:linear-gradient(135deg,#fff4e6,#ffe0b2);">
        Test (MCQ)
      </button>
      <button class="pill mode-card" id="liveBtn" style="background:linear-gradient(135deg,#e0f7fa,#80deea);">
        Live Quiz (Socket)
      </button>
      <button class="pill mode-card" id="aiBtn" style="background:linear-gradient(135deg,#e3f2fd,#c5d8ff);">
        HanDoAI Chat
      </button>
    </div>
  `;

  root.querySelector("#flashBtn").onclick = onFlash;
  root.querySelector("#typeBtn").onclick = onTypeCheck;
  root.querySelector("#testBtn").onclick = onTest;
  root.querySelector("#liveBtn").onclick = onLiveQuiz;
  root.querySelector("#aiBtn").onclick = onAi;

  return root;
}
