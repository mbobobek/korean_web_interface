export async function askAI(text) {
  const response = await fetch("https://YOUR-HANDOAI-SERVER-URL/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text }),
  });

  if (!response.ok) throw new Error("AI server error");
  const data = await response.json();
  return data.reply;
}
