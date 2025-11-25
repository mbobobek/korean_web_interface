import { MyDeckCard } from "../components/MyDeckCard.js";

export function MyDeckScreen({ store, onBack, onCreate, onOpenDeck }) {
  const root = document.createElement("div");
  root.className = "screen";

  root.innerHTML = `
    <button class="btn btn-soft w-fit mb-3" id="backBtn">← Ortga</button>
    <h2 class="text-2xl font-bold mb-2">MyDeck</h2>
    <p class="muted mb-3">Saqlagan decklaringiz</p>
    <div id="list" class="flex flex-col gap-2 mb-3"></div>
    <button class="btn btn-soft" id="createBtn" style="background:linear-gradient(135deg,#e1bee7,#fce4ec);color:#4a148c;font-weight:700;">+ Yangi Deck</button>
  `;

  const list = root.querySelector("#list");
  if (!store.decks.length) {
    list.innerHTML = `<div class="muted">Hali birorta deck yaratilmagan.</div>`;
  } else {
    store.decks.forEach((deck) => {
      list.appendChild(
        MyDeckCard({
          deck,
          onOpen: () => onOpenDeck(deck),
          onRename: () => {
            const name = prompt("Yangi nom:", deck.name);
            if (!name) return;
            store.renameDeck(deck.id, name);
            rerender();
          },
          onDelete: () => {
            if (!confirm("Ushbu deckni o‘chirishni tasdiqlaysizmi?")) return;
            store.deleteDeck(deck.id);
            rerender();
          },
        })
      );
    });
  }

  root.querySelector("#createBtn").onclick = onCreate;
  root.querySelector("#backBtn").onclick = onBack;

  function rerender() {
    const newRoot = MyDeckScreen({ store, onBack, onCreate, onOpenDeck });
    root.replaceWith(newRoot);
  }

  return root;
}
