const KEY = "korean_web_decks";

function persist(data) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function loadDeckState() {
  if (typeof localStorage === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function saveDeckState(decks) {
  persist(decks);
}

export function addDeck(decks, name) {
  const deck = { id: crypto.randomUUID(), name, words: [] };
  return [...decks, deck];
}

export function addWordToDeck(decks, id, word) {
  return decks.map((d) => {
    if (d.id !== id) return d;
    const exists = d.words.some((w) => w.kr === word.kr && w.uz === word.uz);
    return exists ? d : { ...d, words: [...d.words, word] };
  });
}

export function renameDeck(decks, id, name) {
  return decks.map((d) => (d.id === id ? { ...d, name } : d));
}

export function deleteDeck(decks, id) {
  return decks.filter((d) => d.id !== id);
}
