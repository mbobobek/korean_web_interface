import { askAI } from "../utils/aiApi.js";
import { ChatBubble } from "../components/ChatBubble.js";
import { ChatInput } from "../components/ChatInput.js";
import { ChatHeader } from "../components/ChatHeader.js";

export default function AiChatScreen({ onBack } = {}) {
  const state = {
    messages: [{ role: "assistant", text: "HanDo AI: Koreys tiliga oid savolingizni kutyapman!" }],
    loading: false,
  };

  const root = document.createElement("div");
  root.className =
    "w-full max-w-3xl mx-auto min-h-[80vh] flex flex-col gap-4 rounded-3xl bg-white/20 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.18)] p-4";

  const header = ChatHeader({ onBack });
  const chatSection = document.createElement("div");
  chatSection.className = "flex flex-col gap-3 overflow-y-auto flex-1 pr-1";
  chatSection.id = "ai-chat";

  const inputWrap = ChatInput({ onSend: handleSend });

  root.append(header, chatSection, inputWrap.form);

  renderChat();

  async function handleSend(text) {
    appendUserMessage(text);
    setLoading(true);
    try {
      const reply = await askAI(text);
      appendBotMessage(reply || "Botdan javob olmadik.");
    } catch (err) {
      appendBotMessage("AI serverga ulanishda xatolik. Keyinroq urinib ko'ring.");
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  }

  function appendUserMessage(text) {
    state.messages.push({ role: "user", text });
    renderChat();
    scrollToBottom();
  }

  function appendBotMessage(text) {
    state.messages.push({ role: "assistant", text });
    renderChat();
    scrollToBottom();
  }

  function setLoading(flag) {
    state.loading = flag;
    renderChat();
  }

  function renderChat() {
    chatSection.innerHTML = "";
    state.messages.forEach((msg) => {
      chatSection.appendChild(ChatBubble({ text: msg.text, role: msg.role }));
    });
    if (state.loading) {
      const typing = document.createElement("div");
      typing.className =
        "max-w-[80%] bg-white/60 backdrop-blur-xl p-3 rounded-2xl shadow text-sm text-slate-500 flex items-center gap-2";
      typing.innerHTML = `<span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                          <span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                          <span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-300"></span>
                          <span>Yozmoqda...</span>`;
      chatSection.appendChild(typing);
    }
  }

  function scrollToBottom() {
    chatSection.scrollTop = chatSection.scrollHeight;
  }

  return root;
}
