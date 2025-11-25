export function ChatHeader({ onBack }) {
  const header = document.createElement("div");
  header.className =
    "flex items-center justify-between bg-white/30 backdrop-blur-xl rounded-2xl shadow-lg px-4 py-3";

  const left = document.createElement("div");
  left.className = "text-lg font-semibold";
  left.innerText = "HanDoAI Chat";

  const right = document.createElement("div");
  right.className = "flex items-center gap-2";

  const backBtn = document.createElement("button");
  backBtn.className = "bg-white/40 p-2 rounded-xl shadow hover:bg-white/60 transition";
  backBtn.innerHTML =
    '<svg class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m15 19-7-7 7-7"/></svg>';
  backBtn.onclick = (e) => {
    e.preventDefault();
    onBack?.();
  };

  const icons = [
    '<path stroke-linecap="round" stroke-linejoin="round" d="m3 12 9-9 9 9M5 10v10h5v-6h4v6h5V10"/>',
    '<path stroke-linecap="round" stroke-linejoin="round" d="M5 4h9a2 2 0 0 1 2 2v12H7a2 2 0 0 0-2 2V4Zm4 0h9a2 2 0 0 1 2 2v12h-9"/>',
    '<path stroke-linecap="round" stroke-linejoin="round" d="M20.5 12.5a8.5 8.5 0 1 1-9-9 7 7 0 0 0 9 9Z"/>',
  ];

  icons.forEach((d) => {
    const btn = document.createElement("button");
    btn.className = "bg-white/40 p-2 rounded-xl shadow hover:bg-white/60 transition";
    btn.innerHTML = `<svg class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">${d}</svg>`;
    right.appendChild(btn);
  });

  header.append(left, right, backBtn);
  return header;
}
