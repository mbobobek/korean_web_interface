import { store } from "./state/store.js";
import { fetchWords } from "./utils/api.js";
import { renderTopBar } from "./components/TopBar.js";
import {
  showHome,
  showBookSelect,
  showGwa,
  showIntro,
  showSessions,
  showFlashcards,
  showEnd,
  showMyDeck,
  showCreateDeck,
  showTypeCheck,
  showTest,
  showLiveQuiz,
  showLiveHost,
  showLiveJoin,
  showTutor,
  showAi,
} from "./router.js";

const screenRoot = document.getElementById("screen-root");
const topbarRoot = document.getElementById("topbar-root");
const body = document.body;

const applyTheme = () => body.classList.toggle("dark", store.theme === "dark");
const withLoading =
  (fn) =>
  async (...args) => {
    screenRoot.innerHTML = `<div class="screen text-center py-10">Yuklanmoqda...</div>`;
    await fn(...args);
  };

async function handleSelectGwa(gwa) {
  try {
    store.setGwa(gwa);
    const words = await fetchWords(store.book, gwa);
    store.setWords(words);
    showIntro(screenRoot, { onStart: () => showSessions(screenRoot, sessionsProps) });
  } catch (err) {
    alert("API xatosi yoki Internet muammosi");
    console.error(err);
    showHome(screenRoot, homeProps);
  }
}

async function handleSelectGwaType(gwa) {
  try {
    store.setGwa(gwa);
    const words = await fetchWords(store.book, gwa);
    store.setWords(words);
    showSessions(screenRoot, typeSessionsProps());
  } catch (err) {
    alert("API xatosi yoki Internet muammosi");
    console.error(err);
    showHome(screenRoot, homeProps);
  }
}

async function handleSelectGwaTest(gwa) {
  try {
    store.setGwa(gwa);
    const words = await fetchWords(store.book, gwa);
    store.setWords(words);
    showSessions(screenRoot, testSessionsProps());
  } catch (err) {
    alert("API xatosi yoki Internet muammosi");
    console.error(err);
    showHome(screenRoot, homeProps);
  }
}

function handleSelectSession(idx) {
  store.selectSession(idx);
  showFlashcards(screenRoot, {
    store,
    onEnd: () => showEnd(screenRoot, endProps),
    onBack: () => showSessions(screenRoot, sessionsProps),
  });
}

function retryHard() {
  const hard = store.stats.hard;
  if (!hard.length) return showEnd(screenRoot, endProps);
  store.setWords(hard);
  showSessions(screenRoot, sessionsProps);
}

const flashBookProps = {
  title: "Flashcards uchun kitob",
  subtitle: "1A, 1B, 2A, 2B",
  onBack: () => showHome(screenRoot, homeProps),
  onSelectBook: (book) => {
    store.setBook(book);
    showGwa(screenRoot, flashGwaProps());
  },
};

const typeBookProps = {
  title: "Type & Check uchun kitob",
  subtitle: "1A, 1B, 2A, 2B",
  onBack: () => showHome(screenRoot, homeProps),
  onSelectBook: (book) => {
    store.setBook(book);
    showGwa(screenRoot, typeGwaProps());
  },
};

const testBookProps = {
  title: "Test uchun kitob",
  subtitle: "1A, 1B, 2A, 2B",
  onBack: () => showHome(screenRoot, homeProps),
  onSelectBook: (book) => {
    store.setBook(book);
    showGwa(screenRoot, testGwaProps());
  },
};

const liveMenuProps = {
  onBack: () => showHome(screenRoot, homeProps),
  onHost: () => showLiveHost(screenRoot, liveHostProps),
  onJoin: () => showLiveJoin(screenRoot, liveJoinProps),
};

const liveHostProps = {
  onBack: () => showLiveQuiz(screenRoot, liveMenuProps),
};

const liveJoinProps = {
  onBack: () => showLiveQuiz(screenRoot, liveMenuProps),
};

function tutorProps() {
  return {
    book: store.book,
    gwa: store.gwa,
    words: store.words,
    onBack: () => showHome(screenRoot, homeProps),
  };
}

const homeProps = {
  onFlash: () => showBookSelect(screenRoot, flashBookProps),
  onTypeCheck: () => showBookSelect(screenRoot, typeBookProps),
  onTest: () => showBookSelect(screenRoot, testBookProps),
  onLiveQuiz: () => showLiveQuiz(screenRoot, liveMenuProps),
  onTutor: () => showTutor(screenRoot, tutorProps()),
  onAi: () =>
    showAi(screenRoot, {
      onBack: () => showHome(screenRoot, homeProps),
    }),
};

const flashGwaProps = () => ({
  book: store.book,
  onBack: () => showBookSelect(screenRoot, flashBookProps),
  onSelectGwa: withLoading(handleSelectGwa),
});

const typeGwaProps = () => ({
  book: store.book,
  onBack: () => showBookSelect(screenRoot, typeBookProps),
  onSelectGwa: withLoading(handleSelectGwaType),
});

const testGwaProps = () => ({
  book: store.book,
  onBack: () => showBookSelect(screenRoot, testBookProps),
  onSelectGwa: withLoading(handleSelectGwaTest),
});

const sessionsProps = {
  onBack: () => showGwa(screenRoot, flashGwaProps()),
  onSelect: handleSelectSession,
};

const typeSessionsProps = () => ({
  title: "Type & Check sessiya",
  legend: false,
  onBack: () => showGwa(screenRoot, typeGwaProps()),
  onSelect: (idx) => {
    store.selectSession(idx);
    showTypeCheck(screenRoot, {
      words: store.currentSession(),
      onBack: () => showSessions(screenRoot, typeSessionsProps()),
    });
  },
  onFull: () => {
    showTypeCheck(screenRoot, {
      words: store.words,
      onBack: () => showSessions(screenRoot, typeSessionsProps()),
    });
  },
});

const testSessionsProps = () => ({
  title: "Test sessiya",
  legend: false,
  onBack: () => showGwa(screenRoot, testGwaProps()),
  onSelect: (idx) => {
    store.selectSession(idx);
    showTest(screenRoot, {
      words: store.currentSession(),
      onBack: () => showSessions(screenRoot, testSessionsProps()),
    });
  },
  onFull: () => {
    showTest(screenRoot, {
      words: store.words,
      onBack: () => showSessions(screenRoot, testSessionsProps()),
    });
  },
});

const deckProps = {
  store,
  onBack: () => showHome(screenRoot, homeProps),
  onCreate: () =>
    showCreateDeck(screenRoot, {
      onBack: () => showMyDeck(screenRoot, deckProps),
      onDone: (name) => {
        store.addDeck(name);
        showMyDeck(screenRoot, deckProps);
      },
    }),
  onOpenDeck: (deck) => {
    if (!deck.words.length) return alert("Deck bo'sh");
    store.setWords(deck.words);
    showSessions(screenRoot, sessionsProps);
  },
};

const endProps = {
  store,
  onHome: () => showHome(screenRoot, homeProps),
  onRetryHard: retryHard,
};

const topProps = {
  theme: store.theme,
  onHome: () => showHome(screenRoot, homeProps),
  onDeck: () => showMyDeck(screenRoot, deckProps),
  onThemeToggle: () => {
    store.toggleTheme();
    applyTheme();
    renderTopBar(topbarRoot, { ...topProps, theme: store.theme });
  },
};

function bootstrap() {
  applyTheme();
  renderTopBar(topbarRoot, topProps);
  showHome(screenRoot, homeProps);
}

bootstrap();
