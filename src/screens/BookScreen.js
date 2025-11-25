export function BookScreen({ title = "Kitobni tanlang", subtitle = "", onBack, onSelectBook }) {
  const root = document.createElement("div");
  root.className = "screen";

  root.innerHTML = `
    <div class="mb-4 flex-between">
      <div>
        <h1 class="text-3xl font-bold">${title}</h1>
        ${subtitle ? `<p class="muted">${subtitle}</p>` : ""}
      </div>
      ${onBack ? `<button class="btn btn-soft w-fit" id="backBtn">← Ortga</button>` : ""}
    </div>
    <div class="grid-books">
      ${["1A", "1B", "2A", "2B"]
        .map(
          (book) => `
        <button class="pill" data-book="${book}" style="background:linear-gradient(135deg,#fce4ec,#e1bee7);">
          ${book}
        </button>
      `
        )
        .join("")}
    </div>
  `;

  if (onBack) {
    const back = root.querySelector("#backBtn");
    if (back) back.onclick = onBack;
  }

  root.querySelectorAll("[data-book]").forEach((btn) => {
    btn.onclick = () => onSelectBook(btn.dataset.book);
  });

  return root;
}
