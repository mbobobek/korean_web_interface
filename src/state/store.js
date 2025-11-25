import { smartChunk } from "../utils/smartChunk.js";

import { loadDeckState, saveDeckState, addDeck, addWordToDeck, renameDeck, deleteDeck } from "./deck.js";
import { loadStats, saveStats, updateStats, emptyStats } from "./stats.js";
import { createSessionLog, addSessionLog } from "./session.js";

const THEME_KEY = "korean_web_theme";

function loadTheme() {
  if (typeof localStorage === "undefined") return "light";
  return localStorage.getItem(THEME_KEY) || "light";
}
function saveTheme(theme) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(THEME_KEY, theme);
}

class Store {
  constructor() {
    this.book = null;
    this.gwa = null;
    this.words = [];
    this.sessions = [];
    this.currentSessionIndex = 0;
    this.currentCardIndex = 0;
    this.stats = loadStats();
    this.sessionLog = createSessionLog();
    this.decks = loadDeckState();
    this.theme = loadTheme();
  }

  setBook(book) {
    this.book = book;
  }
  setGwa(gwa) {
    this.gwa = gwa;
  }

  setWords(words) {
    this.words = words || [];
    this.sessions = smartChunk(this.words);
    this.currentSessionIndex = 0;
    this.currentCardIndex = 0;
    this.sessionLog = createSessionLog();
    this.stats = emptyStats();
  }

  selectSession(idx) {
    this.currentSessionIndex = idx;
    this.currentCardIndex = 0;
    this.sessionLog = createSessionLog();
  }

  currentSession() {
    return this.sessions[this.currentSessionIndex] || [];
  }
  currentWord() {
    const s = this.currentSession();
    return s[this.currentCardIndex] || null;
  }

  nextCard() {
    const s = this.currentSession();
    this.currentCardIndex++;
    if (this.currentCardIndex >= s.length) {
      return false;
    }
    return true;
  }

  answerCurrent(type) {
    const word = this.currentWord();
    if (!word) return;
    this.stats = updateStats(this.stats, word, type);
    saveStats(this.stats);
    this.sessionLog = addSessionLog(this.sessionLog, word, type);
  }

  // Decks
  addDeck(name) {
    this.decks = addDeck(this.decks, name);
    saveDeckState(this.decks);
  }
  addWordToDeck(deckId, word) {
    this.decks = addWordToDeck(this.decks, deckId, word);
    saveDeckState(this.decks);
  }
  renameDeck(deckId, name) {
    this.decks = renameDeck(this.decks, deckId, name);
    saveDeckState(this.decks);
  }
  deleteDeck(deckId) {
    this.decks = deleteDeck(this.decks, deckId);
    saveDeckState(this.decks);
  }
  wordInAnyDeck(word) {
    return this.decks.some((deck) => deck.words.some((w) => w.kr === word.kr && w.uz === word.uz));
  }

  toggleTheme() {
    this.theme = this.theme === "dark" ? "light" : "dark";
    saveTheme(this.theme);
  }
}

export const store = new Store();
