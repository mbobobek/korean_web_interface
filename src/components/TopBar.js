export function renderTopBar(root, { onHome, onDeck, onThemeToggle, theme }) {
  root.innerHTML = "";
  const wrap = document.createElement("header");
  wrap.className = "topbar";

  wrap.innerHTML = `
    <div>
      <div class="brand">Korean Bot</div>
      <div class="title">Study</div>
    </div>
    <div class="flex gap-3 items-center">
      <button class="icon-btn" title="Bosh sahifa" aria-label="Home">🏠</button>
      <button class="icon-btn" title="MyDeck" aria-label="Deck">📚</button>
      <button class="icon-btn" title="Tema" aria-label="Theme">${theme === "dark" ? "☀️" : "🌙"}</button>
    </div>
  `;

  const [homeBtn, deckBtn, themeBtn] = wrap.querySelectorAll("button");
  homeBtn.onclick = onHome;
  deckBtn.onclick = onDeck;
  themeBtn.onclick = onThemeToggle;

  root.appendChild(wrap);
}
