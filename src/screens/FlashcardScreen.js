import { FlashCard } from "../components/FlashCard.js";
import { ProgressBar } from "../components/ProgressBar.js";
import { Modal } from "../components/Modal.js";

export function FlashcardScreen({ store: s, onEnd, onBack }) {
  const root = document.createElement("div");
  root.className = "screen flashcard-screen";

  const modal = Modal({
    decks: s.decks,
    onSelect: (deck) => {
      s.addWordToDeck(deck.id, s.currentWord());
      modal.classList.remove("active");
      render();
    },
    onCreate: () => {
      const name = prompt("Yangi deck nomi");
      if (!name) return;
      s.addDeck(name);
      modal.classList.remove("active");
      render();
    },
  });
  document.body.appendChild(modal);

  function render() {
    root.innerHTML = "";
    const word = s.currentWord();
    if (!word) {
      onEnd();
      return;
    }

    const header = document.createElement("div");
    header.className = "fc-header";
    header.innerHTML = `
      <button class="icon-btn ghost" id="backBtn">←</button>
      <div>
        <div class="muted text-xs uppercase tracking-wide">Session ${s.currentSessionIndex + 1}</div>
        <div class="font-bold">Card ${s.currentCardIndex + 1}/${s.currentSession().length}</div>
      </div>
      <div class="flex-gap"></div>
    `;
    header.querySelector("#backBtn").onclick = () => {
      modal.remove();
      onBack();
    };

    const progress = ProgressBar({
      value: s.currentCardIndex,
      total: s.currentSession().length,
    });

    const cardWrap = document.createElement("div");
    cardWrap.className = "fc-card-wrap";
    const card = FlashCard({
      word,
      saved: s.wordInAnyDeck(word),
      onKnow: () => {
        s.answerCurrent("know");
        s.nextCard() ? render() : onEnd();
      },
      onHard: () => {
        s.answerCurrent("hard");
        s.nextCard() ? render() : onEnd();
      },
      onLater: () => {
        s.answerCurrent("later");
        s.nextCard() ? render() : onEnd();
      },
      onSaveToggle: () => {
        modal.classList.add("active");
      },
    });
    cardWrap.appendChild(card);

    root.appendChild(header);
    root.appendChild(progress);
    root.appendChild(cardWrap);
  }

  render();
  return root;
}
