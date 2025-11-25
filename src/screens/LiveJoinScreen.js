import { createSocket } from "../utils/socketClient.js";

export function LiveJoinScreen({ onBack }) {
  const root = document.createElement("div");
  root.className = "screen quiz-live";

  const socket = createSocket();
  let joinedPin = null;
  let countdownTimer = null;

  const header = document.createElement("div");
  header.className = "flex-between mb-3";
  header.innerHTML = `
    <div>
      <div class="muted text-xs uppercase tracking-wide">Live Quiz</div>
      <h2 class="text-2xl font-bold">Participant</h2>
    </div>
    <button class="btn btn-soft w-fit" id="backBtn">Ortga</button>
  `;
  header.querySelector("#backBtn").onclick = () => {
    socket.disconnect();
    onBack();
  };

  const conn = document.createElement("div");
  conn.className = "pill status-pill warn mb-3";
  const setConn = (txt, state = "warn") => {
    conn.textContent = txt;
    conn.classList.remove("ok", "warn");
    conn.classList.add(state === "ok" ? "ok" : "warn");
  };

  const panel = document.createElement("div");
  panel.className = "panel";
  panel.innerHTML = `
    <div class="flex gap-2 mb-2 wrap">
      <label class="pill input label">
        <span class="label-text">PIN</span>
        <input id="pinInput" class="pill input" inputmode="numeric" pattern="[0-9]*" maxlength="6" placeholder="6 digit PIN" aria-label="PIN" />
      </label>
      <label class="pill input label">
        <span class="label-text">Name</span>
        <input id="nameInput" class="pill input" maxlength="20" placeholder="Your name" aria-label="Name" />
      </label>
      <button class="btn btn-soft w-fit" id="joinBtn" disabled aria-label="Join quiz">Join</button>
    </div>
    <div id="joinStatus" class="muted text-sm mb-3" aria-live="polite">PIN kiriting va join qiling.</div>
    <div id="questionBox" class="pill mb-2 hidden" aria-live="polite"></div>
    <div id="optionsBox" class="quiz-options"></div>
    <div id="progressBox" class="progress mt-2 hidden"><div class="progress-bar" id="qProgress"></div></div>
    <div id="answerStatus" class="mt-2" aria-live="polite"></div>
    <div class="mt-3">
      <div class="font-semibold mb-1">Leaderboard</div>
      <div id="playerLb" class="quiz-lb"></div>
    </div>
  `;

  const banner = document.createElement("div");
  banner.className = "banner hidden";
  banner.textContent = "Connection lost. Reconnecting...";

  root.appendChild(header);
  root.appendChild(conn);
  root.appendChild(banner);
  root.appendChild(panel);

  const pinInput = panel.querySelector("#pinInput");
  const nameInput = panel.querySelector("#nameInput");
  const joinBtn = panel.querySelector("#joinBtn");
  const joinStatus = panel.querySelector("#joinStatus");
  const questionBox = panel.querySelector("#questionBox");
  const optionsBox = panel.querySelector("#optionsBox");
  const progressWrap = panel.querySelector("#progressBox");
  const progressBar = panel.querySelector("#qProgress");
  const answerStatus = panel.querySelector("#answerStatus");
  const playerLb = panel.querySelector("#playerLb");
  const optionButtons = [];
  const savedName = typeof localStorage !== "undefined" ? localStorage.getItem("quiz_name") : "";
  if (savedName) nameInput.value = savedName;

  function setJoinButtonState() {
    const pinOk = /^\d{6}$/.test(pinInput.value.trim());
    const nameOk = (nameInput.value || "").trim().length > 0;
    joinBtn.disabled = !(pinOk && nameOk);
  }

  function renderLb(list) {
    playerLb.innerHTML = "";
    list.forEach((p, idx) => {
      const row = document.createElement("div");
      row.className = "pill quiz-summary-row";
      row.innerHTML = `<div class="font-bold">${idx + 1}. ${p.name}</div><div class="muted text-sm">Score: ${p.score}</div>`;
      playerLb.appendChild(row);
    });
  }

  function handleQuestion(q) {
    questionBox.classList.remove("hidden");
    progressWrap.classList.remove("hidden");
    questionBox.innerHTML = `
      <div class="font-bold text-lg mb-1">Savol ${q.idx + 1}/${q.total}</div>
      <div>${q.prompt}</div>
    `;
    optionsBox.innerHTML = "";
    answerStatus.innerHTML = "";
    optionButtons.length = 0;

    q.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "pill quiz-option";
      btn.textContent = opt;
      btn.onclick = () => {
        // Lock all buttons after first attempt
        optionButtons.forEach((b) => (b.disabled = true));
        socket.emit("answer", { pin: joinedPin, answer: opt }, (res) => {
          if (!res?.ok) {
            answerStatus.innerHTML = `<div class="pill error-pill">Yuborilmadi: ${res?.reason || "xato"}</div>`;
            return;
          }
          const correctBtn = optionButtons.find((b) => b.textContent === res.right);
          if (res.correct) {
            btn.classList.add("quiz-option-correct", "quiz-anim-correct");
            answerStatus.innerHTML = `<div class="pill success-pill">To'g'ri! +${res.gained || 0}${res.streak ? ` (Streak ${res.streak})` : ""}</div>`;
          } else {
            btn.classList.add("quiz-option-wrong", "quiz-anim-wrong");
            if (correctBtn) correctBtn.classList.add("quiz-option-correct");
            const penalty = res.penalty ? `-${res.penalty}` : "0";
            answerStatus.innerHTML = `<div class="pill error-pill">Xato. To'g'ri: ${res.right} (Penalty ${penalty})</div>`;
          }
        });
      };
      optionButtons.push(btn);
      optionsBox.appendChild(btn);
    });

    if (countdownTimer) clearInterval(countdownTimer);
    const totalMs = q.deadline - Date.now();
    const tick = () => {
      const left = Math.max(0, q.deadline - Date.now());
      const pct = Math.max(0, Math.min(1, left / totalMs || 1));
      progressBar.style.width = `${pct * 100}%`;
      if (left <= 0) clearInterval(countdownTimer);
    };
    tick();
    countdownTimer = setInterval(tick, 200);
  }

  function showBanner(message, type = "warn") {
    banner.textContent = message;
    banner.classList.remove("hidden", "ok", "warn");
    banner.classList.add(type === "ok" ? "ok" : "warn");
  }

  function hideBanner() {
    banner.classList.add("hidden");
  }

  joinBtn.onclick = () => {
    const pin = (pinInput.value || "").trim();
    const name = (nameInput.value || "").trim() || "Guest";
    if (!/^\d{6}$/.test(pin)) {
      joinStatus.textContent = "PIN (6 raqam) kiriting";
      return;
    }
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("quiz_name", name);
    }
    socket.emit("join", { pin, name }, (res) => {
      if (!res?.ok) {
        joinStatus.textContent = `Join xato: ${res?.reason || "topilmadi"}`;
        return;
      }
      joinedPin = pin;
      joinStatus.textContent = `Ulandingiz (PIN ${pin}). Savolni kuting.`;
      pinInput.disabled = true;
      nameInput.disabled = true;
      joinBtn.disabled = true;
    });
  };

  pinInput.oninput = setJoinButtonState;
  nameInput.oninput = setJoinButtonState;
  setJoinButtonState();

  socket.on("connect", () => {
    setConn("Socket: online", "ok");
    hideBanner();
  });
  socket.on("disconnect", () => {
    setConn("Socket: uzildi. Reconnect kutilmoqda...", "warn");
    showBanner("Connection lost. Trying to reconnect...", "warn");
  });
  socket.on("question", (q) => handleQuestion(q));
  socket.on("leaderboard", (lb) => renderLb(lb || []));
  if (socket.io) {
    socket.io.on("reconnect", () => {
      hideBanner();
      setConn("Socket: online", "ok");
    });
    socket.io.on("reconnect_failed", () => showBanner("Reconnect failed. Refresh and try again.", "warn"));
  }
  socket.on("session:end", () => {
    if (countdownTimer) clearInterval(countdownTimer);
    answerStatus.innerHTML = `<div class="pill">Sessiya tugadi</div>`;
  });

  return root;
}
