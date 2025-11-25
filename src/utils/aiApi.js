const AI_BASE =
  (typeof window !== "undefined" && window.HANDO_AI_URL) ||
  "https://handoaiserver-production.up.railway.app";

export async function askAI(text) {
  const response = await fetch(`${AI_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error || "AI server error");
  return data.reply || data.answer || "HanDoAI javob bermadi.";
}
