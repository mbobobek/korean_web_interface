const AI_BASE =
  (typeof window !== "undefined" && window.HANDO_AI_URL) ||
  "https://handoaiserver-production.up.railway.app";

export async function askAI(text) {
  const response = await fetch(`${AI_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text }),
  });

  if (!response.ok) throw new Error("AI server error");
  const data = await response.json();
  return data.reply;
}
