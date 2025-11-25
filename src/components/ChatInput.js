export function ChatInput({ onSend }) {
  const form = document.createElement("form");
  form.className = "bg-white/40 backdrop-blur-xl rounded-2xl flex items-center gap-3 p-3 shadow";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Savol yozing...";
  input.className =
    "flex-1 bg-white/60 backdrop-blur-xl rounded-xl px-3 py-2 outline-none text-sm placeholder:text-slate-500";

  const button = document.createElement("button");
  button.type = "submit";
  button.className = "bg-sky-400 hover:bg-sky-500 text-white rounded-full p-3 shadow transition";
  button.setAttribute("aria-label", "Send");
  button.innerHTML =
    '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3.4 11.2 19.3 4.3c1.4-.6 2.8.8 2.2 2.2l-6.9 15.9c-.6 1.4-2.6 1.1-2.8-.4l-.7-5.5-5.5-.7c-1.5-.2-1.8-2.2-.3-2.8Z"/></svg>';

  form.append(input, button);

  form.onsubmit = (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    onSend(text);
    input.value = "";
    input.focus();
  };

  return { form, input };
}
