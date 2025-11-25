import { ttsKorean } from "../utils/helpers.js";

export function FlashCard({ word, onKnow, onHard, onLater, onSaveToggle, saved }) {
  const shell = document.createElement("div");
  shell.className = "card-shell fc-card";

  const card = document.createElement("div");
  card.className = "flashcard";
  card.innerHTML = `
    <div class="card-side front">${word.kr}</div>
    <div class="card-side card-back">${word.uz}</div>
  `;

  let flipped = false;
  card.onclick = () => {
    flipped = !flipped;
    card.classList.toggle("flipped", flipped);
  };

  // TTS tugmasi
  const ttsBtn = document.createElement("button");
  ttsBtn.className = "btn btn-soft btn-tts";
  ttsBtn.textContent = "🔊 Tinglash";
  ttsBtn.onclick = () => ttsKorean(word.kr);

  // Asosiy harakatlar
  const primaryRow = document.createElement("div");
  primaryRow.className = "fc-primary";
  primaryRow.innerHTML = `
    <button class="btn btn-know">Bilaman</button>
    <button class="btn btn-hard">Qiyin</button>
  `;

  // Qo‘shimcha harakatlar
  const secondaryRow = document.createElement("div");
  secondaryRow.className = "fc-secondary";

  const laterBtn = document.createElement("button");
  laterBtn.className = "btn btn-later";
  laterBtn.textContent = "Keyinroq";

  const saveBtn = document.createElement("button");
  saveBtn.className = "btn btn-save";
  saveBtn.textContent = saved ? "⭐ Saqlangan" : "☆ Saqlash";

  primaryRow.children[0].onclick = onKnow;
  primaryRow.children[1].onclick = onHard;
  laterBtn.onclick = onLater;
  saveBtn.onclick = () => onSaveToggle(saveBtn);

  secondaryRow.appendChild(laterBtn);
  secondaryRow.appendChild(saveBtn);

  shell.appendChild(card);
  shell.appendChild(ttsBtn);
  shell.appendChild(primaryRow);
  shell.appendChild(secondaryRow);
  return shell;
}
