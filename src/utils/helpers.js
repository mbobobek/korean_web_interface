export function ttsKorean(text) {
  const synth = window.speechSynthesis;
  if (!synth) return;

  // Koreyscha TTS parametrlari
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ko-KR";
  utter.rate = 0.75;
  utter.pitch = 1.0;
  utter.volume = 1;
  synth.speak(utter);
}

export function fadeIn(el) {
  el.style.opacity = 0;
  requestAnimationFrame(() => {
    el.style.transition = "opacity 0.25s ease";
    el.style.opacity = 1;
  });
}
