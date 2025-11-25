export function Modal({ decks, onSelect, onCreate }) {
  const sheet = document.createElement("div");
  sheet.className = "bottom-sheet";

  sheet.innerHTML = `
    <div class="flex justify-between items-center mb-2">
      <div class="font-semibold text-lg">Deckni tanlang</div>
      <button aria-label="yopish" class="icon-btn" id="closeBtn">✕</button>
    </div>
    <div id="list" class="flex flex-col gap-2 mb-3"></div>
    <button id="newDeck" class="btn btn-soft" style="background:linear-gradient(135deg,#e1bee7,#fce4ec);color:#4a148c;font-weight:700;">
      + Yangi Deck yaratish
    </button>
  `;

  const list = sheet.querySelector("#list");
  if (!decks.length) {
    list.innerHTML = `<div class="muted">Hali decklar yo'q</div>`;
  } else {
    decks.forEach((deck) => {
      const btn = document.createElement("button");
      btn.className = "session-card";
      btn.innerHTML = `
        <div>
          <div class="font-semibold">${deck.name}</div>
          <div class="muted">${deck.words.length} ta so'z</div>
        </div>
        <div>➜</div>
      `;
      btn.onclick = () => onSelect(deck);
      list.appendChild(btn);
    });
  }

  sheet.querySelector("#newDeck").onclick = onCreate;
  sheet.querySelector("#closeBtn").onclick = () => sheet.classList.remove("active");

  return sheet;
}
