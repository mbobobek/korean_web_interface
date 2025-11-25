const API_BASE = "https://koreanapi-production.up.railway.app/api";
const AI_API_BASE =
  (typeof window !== "undefined" && window.HANDO_AI_URL) || "http://localhost:5050";

export async function fetchWords(book, gwa) {
  const url = `${API_BASE}/flashcards?book=${encodeURIComponent(book)}&gwa=${encodeURIComponent(gwa)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("API xatosi");
  const data = await res.json();
  return data.words || [];
}

export async function askTutor({ prompt, book, gwa, history = [], words = [] }) {
  const url = `${AI_API_BASE}/api/qa`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, book, gwa, history, words }),
  });
  if (!res.ok) throw new Error("AI server xatosi");
  return res.json();
}
