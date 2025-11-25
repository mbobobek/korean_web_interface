import { ttsKorean } from "../utils/helpers.js";

function normalize(text) {
  return text.trim().replace(/\s+/g, " ").toLowerCase().normalize("NFC");
}

function scoreWord(expected, actual) {
  const exp = normalize(expected);
  const act = normalize(actual);
  return { ok: exp === act, exp: expected, act: actual };
}

export function TypeCheckTestScreen({ words = [], onBack }) {
  let index = 0;
  let correct = 0;
  const total = words.length;
  const root = document.createElement("div");
  root.className = "screen typecheck";

  const render = () => {
    root.innerHTML = "";
    if (!total) {
      root.innerHTML = `<div class="pill">So'zlar topilmadi. Ortga qayting.</div>`;
      return;
    }

    const word = words[index];
    const header = document.createElement("div");
    header.className = "flex-between mb-3";
    header.innerHTML = `
      <div>
        <div class="muted text-xs uppercase tracking-wide">Type & Check</div>
        <div class="font-bold">Card ${index + 1}/${total}</div>
      </div>
      <div class="flex gap-2">
        <button class="btn btn-soft w-fit" id="ttsBtn">🔊</button>
        <button class="btn btn-soft w-fit" id="backBtn">← Ortga</button>
      </div>
    `;

    const body = document.createElement("div");
    body.innerHTML = `
      <div class="pill mb-2 text-center text-xl font-bold">${word.kr}</div>
      <label class="muted text-xs">Tarjima (o'zbekcha)</label>
      <textarea id="answer" class="pill tc-input" rows="2" placeholder="Javobingizni yozing"></textarea>
      <div class="flex gap-2 mt-2">
        <button class="btn btn-soft w-fit" id="checkBtn">Tekshirish</button>
        <button class="btn btn-soft w-fit" id="skipBtn">O'tkazib yuborish</button>
      </div>
      <div id="result" class="mt-3"></div>
    `;

    header.querySelector("#ttsBtn").onclick = () => ttsKorean(word.kr);
    header.querySelector("#backBtn").onclick = onBack;
    body.querySelector("#skipBtn").onclick = () => nextCard(false);
    body.querySelector("#checkBtn").onclick = () => {
      const val = body.querySelector("#answer").value;
      const res = scoreWord(word.uz, val);
      const box = body.querySelector("#result");
      if (res.ok) {
        correct += 1;
        box.innerHTML = `<div class="pill">✅ To'g'ri</div>`;
        setTimeout(() => nextCard(true), 500);
      } else {
        box.innerHTML = `
          <div class="pill">
            ❌ Xato<br/>
            To'g'ri: <strong>${word.uz}</strong><br/>
            Siz: ${val || "—"}
          </div>
        `;
      }
    };

    root.appendChild(header);
    root.appendChild(body);
  };

  const summary = () => {
    root.innerHTML = `
      <h2 class="text-2xl font-bold mb-2">Natija</h2>
      <div class="pill mb-3">
        To'g'ri: ${correct} / ${total} (${total ? Math.round((correct / total) * 100) : 0}%)
      </div>
      <button class="btn btn-soft w-fit" id="backBtn">Bosh menyu</button>
    `;
    root.querySelector("#backBtn").onclick = onBack;
  };

  const nextCard = () => {
    index += 1;
    if (index >= total) {
      summary();
      return;
    }
    render();
  };

  render();
  return root;
}
