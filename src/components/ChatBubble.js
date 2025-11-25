export function ChatBubble({ text, role }) {
  const div = document.createElement("div");
  const isUser = role === "user";
  div.className = [
    "max-w-[80%]",
    "p-3",
    "rounded-2xl",
    "shadow",
    "text-sm",
    "backdrop-blur-xl",
    isUser ? "bg-sky-200/70 ml-auto" : "bg-white/60",
  ].join(" ");
  div.innerText = text;
  return div;
}
