import { askTutor } from "../utils/api.js";

// ChatGPT-style UI: sidebar + centered chat, fully responsive.
export function TutorScreen({ onBack }) {
  const root = document.createElement("div");
  root.className = "screen p-0";

  const style = document.createElement("style");
  style.textContent = `
    :root {
      --glass-bg: rgba(255, 255, 255, 0.75);
      --glass-border: rgba(148, 163, 184, 0.35);
      --bg-main: #f8fafc;
      --bg-accent: #eef2ff;
    }
    .tutor-shell { display: grid; grid-template-columns: 220px 1fr; min-height: calc(100vh - 120px); background: linear-gradient(135deg, var(--bg-main), var(--bg-accent)); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(15, 23, 42, 0.12); }
    .tutor-sidebar { padding: 16px; background: rgba(255,255,255,0.85); border-right: 1px solid var(--glass-border); backdrop-filter: blur(10px); display: flex; flex-direction: column; gap: 12px; }
    .tutor-logo { font-weight: 800; font-size: 18px; letter-spacing: 0.4px; }
    .tutor-nav { display: flex; flex-direction: column; gap: 8px; }
    .tutor-btn { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; border: 1px solid var(--glass-border); background: var(--glass-bg); cursor: pointer; transition: all 0.2s ease; font-weight: 600; text-align: left; }
    .tutor-btn:hover { background: rgba(226, 232, 240, 0.9); }
    .tutor-main { padding: 20px; display: flex; flex-direction: column; gap: 16px; min-width: 0; }
    .tutor-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
    .tutor-title h1 { font-size: 22px; font-weight: 800; }
    .tutor-chat { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 12px; min-height: 60vh; }
    .tutor-messages { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
    .tutor-bubble { max-width: 80%; padding: 12px 14px; border-radius: 14px; font-size: 14px; line-height: 1.5; word-break: break-word; white-space: pre-wrap; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08); }
    .tutor-bubble.assistant { background: #e2e8f0; color: #0f172a; align-self: flex-start; }
    .tutor-bubble.user { background: #2563eb; color: #fff; align-self: flex-end; }
    .tutor-input { display: flex; gap: 10px; }
    .tutor-input input { flex: 1; padding: 12px 14px; border-radius: 12px; border: 1px solid var(--glass-border); background: var(--glass-bg); }
    .tutor-input button { padding: 12px 16px; border-radius: 12px; border: none; background: #2563eb; color: #fff; font-weight: 700; cursor: pointer; transition: background 0.2s ease; }
    .tutor-input button:hover { background: #1d4ed8; }
    .tutor-suggestions { display: flex; flex-wrap: wrap; gap: 8px; }
    .tutor-chip { padding: 8px 10px; border-radius: 10px; border: 1px solid var(--glass-border); background: var(--glass-bg); font-size: 12px; cursor: pointer; }
    @media (max-width: 1024px) { .tutor-shell { grid-template-columns: 1fr; } .tutor-sidebar { flex-direction: row; flex-wrap: wrap; gap: 8px; align-items: center; } }
    @media (max-width: 640px) { .tutor-input { flex-direction: column; } .tutor-bubble { max-width: 100%; } .tutor-chat { min-height: 70vh; } }
  `;
  root.appendChild(style);

  const suggestions = [
    "Koreyscha gap tuzib bering",
    "Tarjimani tekshirib bering",
    "Bu grammatikani tushuntiring",
    "Talaffuz bo'yicha maslahat",
  ];

  root.innerHTML = `
    <div class="tutor-shell">
      <aside class="tutor-sidebar">
        <div class="tutor-logo">HanDo AI</div>
        <div class="tutor-nav">
          <button class="tutor-btn" id="backBtn">⬅️ Orqaga</button>
          <button class="tutor-btn" id="homeBtn">🏠 Home</button>
          <button class="tutor-btn" id="lessonsBtn">📚 Lessons</button>
          <button class="tutor-btn" id="themeBtn">🌗 Tema</button>
        </div>
      </aside>

      <main class="tutor-main">
        <div class="tutor-header">
          <div class="tutor-title">
            <p class="text-xs text-slate-500 mb-1">HanDo AI</p>
            <h1>HanDo AI Tutor</h1>
          </div>
        </div>

        <section class="tutor-chat">
          <div id="messages" class="tutor-messages"></div>
          <form id="chatForm" class="tutor-input">
            <input id="promptInput" type="text" placeholder="Savol yoki so'rov yozing..." autocomplete="off" />
            <button id="sendBtn" type="submit">Yuborish</button>
          </form>
          <div id="suggestions" class="tutor-suggestions"></div>
        </section>
      </main>
    </div>
  `;

  const messagesEl = root.querySelector("#messages");
  const form = root.querySelector("#chatForm");
  const input = root.querySelector("#promptInput");
  const sendBtn = root.querySelector("#sendBtn");
  const backBtn = root.querySelector("#backBtn");
  const homeBtn = root.querySelector("#homeBtn");
  const lessonsBtn = root.querySelector("#lessonsBtn");
  const themeBtn = root.querySelector("#themeBtn");
  const suggestionsEl = root.querySelector("#suggestions");

  const messages = [{ role: "assistant", content: "HanDo AI: Koreys tiliga oid savolingizni kutyapman!" }];

  renderMessages();
  renderSuggestions();

  backBtn.onclick = (e) => {
    e.preventDefault();
    onBack();
  };
  homeBtn.onclick = (e) => {
    e.preventDefault();
    onBack();
  };
  lessonsBtn.onclick = (e) => {
    e.preventDefault();
    onBack();
  };
  themeBtn.onclick = (e) => {
    e.preventDefault();
    document.body.classList.toggle("dark");
  };

  form.onsubmit = async (e) => {
    e.preventDefault();
    const prompt = input.value.trim();
    if (!prompt) return;
    input.value = "";
    messages.push({ role: "user", content: prompt });
    renderMessages();
    toggleSend(true);

    let answer = "HanDo AI: Koreys tiliga oid savolingizni kutyapman!";
    try {
      const response = await askTutor({ prompt });
      if (response?.answer) answer = response.answer;
    } catch (_err) {
      // fallback to placeholder
    }
    messages.push({ role: "assistant", content: answer });
    renderMessages();
    toggleSend(false);
  };

  function renderMessages() {
    messagesEl.innerHTML = "";
    messages.forEach((m) => {
      const bubble = document.createElement("div");
      bubble.className = `tutor-bubble ${m.role === "user" ? "user" : "assistant"}`;
      bubble.innerText = m.content;
      messagesEl.appendChild(bubble);
    });
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function renderSuggestions() {
    suggestionsEl.innerHTML = "";
    suggestions.forEach((text) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "tutor-chip";
      chip.innerText = text;
      chip.onclick = () => {
        input.value = text;
        input.focus();
      };
      suggestionsEl.appendChild(chip);
    });
  }

  function toggleSend(disabled) {
    sendBtn.disabled = disabled;
    sendBtn.innerText = disabled ? "Yuklanmoqda..." : "Yuborish";
  }

  return root;
}
