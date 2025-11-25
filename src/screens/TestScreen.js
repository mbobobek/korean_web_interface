import { ttsKorean } from "../utils/helpers.js";

function shuffle(list) {
  return [...list]
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

function pickOptions(words, current, count = 4) {
  const pool = words.filter((w) => w !== current);
  const sorted = pool.sort(
    (a, b) => Math.abs(a.uz.length - current.uz.length) - Math.abs(b.uz.length - current.uz.length)
  );
  const candidates = [current, ...sorted.slice(0, count - 1)];
  return shuffle(candidates);
}

export function TestScreen({ words = [], onBack }) {
  let index = 0;
  let correct = 0;
  const total = words.length;
  const answers = [];
  const root = document.createElement("div");
  root.className = "screen quiz-screen";

  const renderEmpty = () => {
    root.innerHTML = `<div class="pill">So'zlar topilmadi. Ortga qayting.</div>`;
    const btn = document.createElement("button");
    btn.className = "btn btn-soft w-fit mt-3";
    btn.textContent = "Ortga";
    btn.onclick = onBack;
    root.appendChild(btn);
  };

  const renderSummary = () => {
    const percent = total ? Math.round((correct / total) * 100) : 0;
    root.innerHTML = `
      <h2 class="text-2xl font-bold mb-2">Test yakuni</h2>
      <div class="pill mb-3">
        To'g'ri: ${correct} / ${total} (${percent}%)
      </div>
      <div class="mb-2 font-semibold">Xato javoblar</div>
    `;

    const wrong = answers.filter((a) => !a.correct);
    if (!wrong.length) {
      root.innerHTML += `<div class="pill">Barcha javoblar to'g'ri. Zo'r!</div>`;
    } else {
      const list = document.createElement("div");
      list.className = "quiz-summary";
      wrong.forEach(({ word, chosen }) => {
        const row = document.createElement("div");
        row.className = "pill quiz-summary-row";
        row.innerHTML = `
          <div class="font-bold">${word.kr}</div>
          <div class="muted text-sm">Siz: ${chosen?.uz || "-"}</div>
          <div class="text-sm font-semibold">To'g'ri: ${word.uz}</div>
        `;
        list.appendChild(row);
      });
      root.appendChild(list);
    }

    const backBtn = document.createElement("button");
    backBtn.className = "btn btn-soft w-fit mt-3";
    backBtn.textContent = "Ortga";
    backBtn.onclick = onBack;
    root.appendChild(backBtn);
  };

  const renderQuestion = () => {
    if (!total) return renderEmpty();

    const word = words[index];
    const options = pickOptions(words, word);
    let locked = false;

    root.innerHTML = "";

    const header = document.createElement("div");
    header.className = "flex-between mb-3";
    header.innerHTML = `
      <div>
        <div class="muted text-xs uppercase tracking-wide">Test</div>
        <div class="font-bold">Savol ${index + 1} / ${total}</div>
      </div>
      <div class="flex gap-2">
        <button class="btn btn-soft w-fit" id="ttsBtn">Tinglash</button>
        <button class="btn btn-soft w-fit" id="backBtn">Ortga</button>
      </div>
    `;

    const body = document.createElement("div");
    body.innerHTML = `
      <div class="pill mb-2 text-center text-xl font-bold">${word.kr}</div>
      <p class="muted mb-2 text-sm">To'g'ri tarjimani tanlang</p>
    `;
    const optionsWrap = document.createElement("div");
    optionsWrap.className = "quiz-options";

    const feedback = document.createElement("div");
    feedback.id = "feedback";
    feedback.className = "mt-3";

    const footer = document.createElement("div");
    footer.className = "quiz-meta mt-3";
    const progress = document.createElement("div");
    progress.className = "muted text-xs";
    progress.textContent = `To'g'ri: ${correct} / ${total}`;
    const nextBtn = document.createElement("button");
    nextBtn.className = "btn btn-soft w-fit";
    nextBtn.textContent = index + 1 >= total ? "Natijani ko'rish" : "Keyingi";
    nextBtn.disabled = true;
    footer.appendChild(progress);
    footer.appendChild(nextBtn);

    const buttons = [];
    options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "pill quiz-option";
      btn.dataset.correct = opt.uz === word.uz ? "true" : "false";
      btn.innerHTML = `
        <div class="text-sm font-semibold">${opt.uz}</div>
      `;
      btn.onclick = () => {
        if (locked) return;
        locked = true;
        const isCorrect = opt.uz === word.uz;
        answers.push({ word, chosen: opt, correct: isCorrect });
        if (isCorrect) {
          correct += 1;
          btn.classList.add("quiz-option-correct");
          feedback.innerHTML = `<div class="pill success-pill">To'g'ri!</div>`;
        } else {
          btn.classList.add("quiz-option-wrong");
          const correctBtn = buttons.find((b) => b.dataset.correct === "true");
          if (correctBtn) correctBtn.classList.add("quiz-option-correct");
          feedback.innerHTML = `
            <div class="pill error-pill">
              Xato. To'g'ri javob: <strong>${word.uz}</strong>
            </div>
          `;
        }

        buttons.forEach((b) => (b.disabled = true));
        nextBtn.disabled = false;
        progress.textContent = `To'g'ri: ${correct} / ${total}`;
      };
      buttons.push(btn);
      optionsWrap.appendChild(btn);
    });

    nextBtn.onclick = () => {
      index += 1;
      if (index >= total) return renderSummary();
      return renderQuestion();
    };

    header.querySelector("#backBtn").onclick = onBack;
    header.querySelector("#ttsBtn").onclick = () => ttsKorean(word.kr);

    root.appendChild(header);
    root.appendChild(body);
    root.appendChild(optionsWrap);
    root.appendChild(feedback);
    root.appendChild(footer);
  };

  renderQuestion();
  return root;
}
