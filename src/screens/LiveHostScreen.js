import { store } from "../state/store.js";
import { fetchWords } from "../utils/api.js";
import { createSocket } from "../utils/socketClient.js";
import { buildQuestions } from "../utils/quizBuilder.js";
import { smartChunk } from "../utils/smartChunk.js";

const sampleWords = [
  { kr: "안녕하세요", uz: "Salom" },
  { kr: "감사합니다", uz: "Rahmat" },
  { kr: "사랑", uz: "Sevgi" },
  { kr: "학교", uz: "Maktab" },
  { kr: "물", uz: "Suv" },
  { kr: "친구", uz: "Do'st" },
];

function getDeckOptions() {
  return (store.decks || []).filter((d) => d.words && d.words.length);
}

export function LiveHostScreen({ onBack }) {
  const root = document.createElement("div");
  root.className = "screen quiz-live";

  const socket = createSocket();
  let pin = null;
  let loadedWords = [];
  let sessions = [];
  let countdownTimer = null;

  const header = document.createElement("div");
  header.className = "flex-between mb-3";
  header.innerHTML = `
    <div>
      <div class="muted text-xs uppercase tracking-wide">Live Quiz</div>
      <h2 class="text-2xl font-bold">Host panel</h2>
    </div>
    <button class="btn btn-soft w-fit" id="backBtn">Back</button>
  `;
  header.querySelector("#backBtn").onclick = () => {
    socket.disconnect();
    onBack();
  };

  const conn = document.createElement("div");
  conn.className = "pill mb-2";
  const setConn = (txt) => (conn.textContent = txt);

  const grid = document.createElement("div");
  grid.className = "quiz-grid";

  const banner = document.createElement("div");
  banner.className = "banner hidden";
  banner.textContent = "Connection lost. Reconnecting...";

  const left = document.createElement("div");
  left.className = "panel";
  left.innerHTML = `
    <h3 class="text-xl font-bold mb-2">Question source</h3>
    <div class="flex gap-2 mb-2 wrap">
      <label class="pill input radio"><input type="radio" name="src" value="book" checked /> Book/Gwa</label>
      <label class="pill input radio"><input type="radio" name="src" value="deck" /> MyDeck</label>
      <label class="pill input radio"><input type="radio" name="src" value="sample" /> Sample</label>
    </div>
    <div class="flex gap-2 mb-2 wrap" id="bookWrap">
      <select id="bookSel" class="pill input select">
        ${["1A", "1B", "2A", "2B"].map((b) => `<option value="${b}">${b}</option>`).join("")}
      </select>
      <select id="gwaSel" class="pill input select">
        ${Array.from({ length: 8 }, (_, i) => `<option value="${i + 1}">${i + 1}-bo'lim</option>`).join("")}
      </select>
    </div>
    <div class="mb-2" id="deckWrap" style="display:none;">
      <select id="deckSel" class="pill input select">
        ${
          getDeckOptions()
            .map((d) => `<option value="${d.id}">${d.name} (${d.words.length})</option>`)
            .join("") || `<option>No deck</option>`
        }
      </select>
    </div>
    <div class="mb-2">
      <label class="pill input select" style="width:100%;">
        <span>Session</span>
        <select id="sessionSel" class="pill input select" style="width:100%; margin-top:6px;">
          <option value="all">All words</option>
        </select>
      </label>
    </div>
    <div class="flex gap-2 mb-2 wrap">
      <label class="pill input select">
        <span>Question count</span>
        <input id="countInput" type="number" min="1" class="pill input" style="width:120px; margin-top:6px;" placeholder="All" />
      </label>
      <label class="pill input radio">
        <input type="checkbox" id="shuffleChk" checked /> Shuffle questions
      </label>
    </div>
    <div class="flex gap-2 mb-2 wrap">
      <button class="btn btn-soft w-fit" id="loadBtn">Load words</button>
      <span id="loadStatus" class="muted text-sm">Not loaded</span>
    </div>
  `;

  const right = document.createElement("div");
  right.className = "panel";
  right.innerHTML = `
    <h3 class="text-xl font-bold mb-2">Session controls</h3>
    <div class="pill mb-2" id="pinBox">PIN: ---</div>
    <div class="flex gap-2 mb-2 wrap">
      <button class="btn btn-soft w-fit" id="createBtn">Create session</button>
      <button class="btn btn-soft w-fit" id="startBtn" disabled>Start (auto)</button>
    </div>
    <div class="pill mb-2" id="hostStatus">Status: waiting</div>
    <div class="muted text-sm mb-2">Questions auto-advance after time is up.</div>
    <div>
      <div class="font-semibold mb-1">Leaderboard</div>
      <div id="hostLb" class="quiz-lb"></div>
    </div>
  `;

  const nowPanel = document.createElement("div");
  nowPanel.className = "panel host-now";
  nowPanel.innerHTML = `
    <div class="flex-between mb-2">
      <div class="font-semibold">Now playing</div>
      <div class="flex gap-2">
        <span class="badge" id="playerCount">0 players</span>
        <span class="badge" id="pinBadge">PIN: ---</span>
      </div>
    </div>
    <div class="muted text-sm" id="nowInfo">Waiting to start...</div>
    <div class="progress mt-2 hidden" id="nowProgress"><div class="progress-bar" id="nowBar"></div></div>
  `;

  grid.appendChild(left);
  grid.appendChild(right);

  root.appendChild(header);
  root.appendChild(conn);
  root.appendChild(banner);
  root.appendChild(grid);
  root.appendChild(nowPanel);

  const loadStatus = left.querySelector("#loadStatus");
  const bookWrap = left.querySelector("#bookWrap");
  const deckWrap = left.querySelector("#deckWrap");
  const bookSel = left.querySelector("#bookSel");
  const gwaSel = left.querySelector("#gwaSel");
  const deckSel = left.querySelector("#deckSel");
  const sessionSel = left.querySelector("#sessionSel");
  const countInput = left.querySelector("#countInput");
  const shuffleChk = left.querySelector("#shuffleChk");
  const loadBtn = left.querySelector("#loadBtn");

  const pinBox = right.querySelector("#pinBox");
  const hostStatus = right.querySelector("#hostStatus");
  const hostLb = right.querySelector("#hostLb");
  const createBtn = right.querySelector("#createBtn");
  const startBtn = right.querySelector("#startBtn");

  const pinBadge = nowPanel.querySelector("#pinBadge");
  const playerCount = nowPanel.querySelector("#playerCount");
  const nowInfo = nowPanel.querySelector("#nowInfo");
  const nowProgress = nowPanel.querySelector("#nowProgress");
  const nowBar = nowPanel.querySelector("#nowBar");

  function renderLb(list) {
    hostLb.innerHTML = "";
    list.forEach((p, idx) => {
      const row = document.createElement("div");
      row.className = "pill quiz-summary-row";
      row.innerHTML = `<div class="font-bold">${idx + 1}. ${p.name}</div><div class="muted text-sm">Score: ${p.score}</div>`;
      hostLb.appendChild(row);
    });
  }

  function getSrc() {
    const checked = left.querySelector("input[name='src']:checked");
    return checked ? checked.value : "book";
  }

  left.querySelectorAll("input[name='src']").forEach((input) => {
    input.onchange = () => {
      const val = getSrc();
      bookWrap.style.display = val === "book" ? "flex" : "none";
      deckWrap.style.display = val === "deck" ? "block" : "none";
    };
  });

  function updateStartState() {
    startBtn.disabled = !pin || !loadedWords.length;
  }

  function renderSessions() {
    sessionSel.innerHTML = `<option value="all">All words (${loadedWords.length})</option>`;
    sessions.forEach((s, idx) => {
      const opt = document.createElement("option");
      opt.value = String(idx);
      opt.textContent = `Session ${idx + 1} (${s.length})`;
      sessionSel.appendChild(opt);
    });
    const deckRadio = left.querySelector("input[name='src'][value='deck']");
    if (deckRadio) deckRadio.disabled = getDeckOptions().length === 0;
    updateStartState();
  }

  function getActiveWords() {
    const val = sessionSel.value;
    if (val === "all") return loadedWords;
    const idx = Number(val);
    return sessions[idx] || [];
  }

  function buildQuiz() {
    const active = getActiveWords();
    if (!active.length) return [];
    const limit = Number(countInput.value) || active.length;
    const shuffleQuestions = !!shuffleChk.checked;
    return buildQuestions(active, { limit, shuffleQuestions });
  }

  async function loadWords() {
    const src = getSrc();
    loadStatus.textContent = "Loading...";
    let words = [];
    try {
      if (src === "book") {
        words = await fetchWords(bookSel.value, Number(gwaSel.value));
      } else if (src === "deck") {
        const deck = getDeckOptions().find((d) => d.id === deckSel.value);
        words = deck?.words || [];
      } else {
        words = sampleWords;
      }

      loadedWords = words;
      sessions = smartChunk(words);
      renderSessions();

      const sessInfo = sessions.map((s, i) => `S${i + 1}:${s.length}`).join(" • ");
      loadStatus.textContent = words.length
        ? `Words loaded: ${words.length}${sessInfo ? " (" + sessInfo + ")" : ""}`
        : "No words found";
    } catch (err) {
      console.error(err);
      loadedWords = [];
      sessions = [];
      renderSessions();
      loadStatus.textContent = "Load error (API or network)";
    }
  }

  loadBtn.onclick = loadWords;
  sessionSel.onchange = updateStartState;

  createBtn.onclick = () => {
    socket.emit("session:create", null, ({ pin: p }) => {
      pin = p;
      pinBox.textContent = `PIN: ${pin}`;
      pinBadge.textContent = `PIN: ${pin}`;
      hostStatus.textContent = "Status: session created";
      updateStartState();
    });
  };

  startBtn.onclick = () => {
    if (!pin) {
      hostStatus.textContent = "Create a session first";
      return;
    }
    const questions = buildQuiz();
    if (!questions.length) {
      hostStatus.textContent = "Load words first";
      return;
    }
    socket.emit("session:start", { pin, questions }, (res) => {
      if (!res?.ok) {
        hostStatus.textContent = `Start error: ${res?.reason || "unknown"}`;
        return;
      }
      hostStatus.textContent = "Started. Questions will auto-advance.";
    });
  };

  function startHostCountdown(deadline) {
    if (countdownTimer) clearInterval(countdownTimer);
    const totalMs = deadline - Date.now();
    if (totalMs <= 0) {
      nowProgress.classList.add("hidden");
      return;
    }
    nowProgress.classList.remove("hidden");
    const tick = () => {
      const left = Math.max(0, deadline - Date.now());
      const pct = Math.max(0, Math.min(1, left / totalMs));
      nowBar.style.width = `${pct * 100}%`;
      if (left <= 0 && countdownTimer) {
        clearInterval(countdownTimer);
        nowProgress.classList.add("hidden");
      }
    };
    tick();
    countdownTimer = setInterval(tick, 200);
  }

  socket.on("connect", () => setConn("Socket: connected"));
  socket.on("disconnect", () => {
    setConn("Socket: disconnected");
    banner.textContent = "Connection lost. Trying to reconnect...";
    banner.classList.remove("hidden");
  });
  socket.on("leaderboard", (lb) => {
    const list = lb || [];
    playerCount.textContent = `${list.length} player${list.length === 1 ? "" : "s"}`;
    renderLb(list);
  });
  socket.on("session:end", (data) => {
    hostStatus.textContent = data?.reason === "host-left" ? "Session ended (host left)" : "Session ended";
    nowInfo.textContent = "Waiting to start...";
    nowProgress.classList.add("hidden");
    if (countdownTimer) clearInterval(countdownTimer);
  });

  socket.on("question", (q) => {
    nowInfo.textContent = `Question ${q.idx + 1}/${q.total}`;
    startHostCountdown(q.deadline);
  });

  if (socket.io) {
    socket.io.on("reconnect", () => {
      banner.classList.add("hidden");
      setConn("Socket: connected");
    });
    socket.io.on("reconnect_failed", () => {
      banner.textContent = "Reconnect failed. Refresh the page.";
      banner.classList.remove("hidden");
    });
  }

  return root;
}
