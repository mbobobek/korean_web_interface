export function MyDeckCard({ deck, onOpen, onRename, onDelete }) {
  const card = document.createElement("div");
  card.className = "session-card flex-between";
  card.innerHTML = `
    <div>
      <div class="font-semibold">${deck.name}</div>
      <div class="muted">${deck.words.length} ta so'z</div>
    </div>
    <div class="deck-actions">
      <button class="icon-btn" title="Ochish" aria-label="Open">➜</button>
      <button class="icon-btn" title="Tahrirlash" aria-label="Rename">✏️</button>
      <button class="icon-btn" title="O'chirish" aria-label="Delete">🗑️</button>
    </div>
  `;
  const [openBtn, renameBtn, deleteBtn] = card.querySelectorAll("button");
  openBtn.onclick = onOpen;
  renameBtn.onclick = onRename;
  deleteBtn.onclick = onDelete;
  return card;
}
