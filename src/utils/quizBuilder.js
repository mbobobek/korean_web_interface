export function shuffle(list) {
  return [...list]
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

export function pickOptions(words, current, count = 4) {
  const pool = words.filter((w) => w !== current);
  const sorted = pool.sort(
    (a, b) => Math.abs(a.uz.length - current.uz.length) - Math.abs(b.uz.length - current.uz.length)
  );
  const picked = [current.uz];
  for (const w of sorted) {
    if (picked.includes(w.uz)) continue;
    picked.push(w.uz);
    if (picked.length >= count) break;
  }
  while (picked.length < count) {
    picked.push(current.uz);
  }
  return shuffle(picked);
}

export function buildQuestions(words, opts = {}) {
  const { limit, durationMs = 12000, shuffleQuestions = true } = opts;

  const pool = shuffleQuestions ? shuffle(words) : [...words];
  const finalLimit = Math.min(limit || pool.length, pool.length);
  const picked = pool.slice(0, finalLimit);

  return picked.map((w) => ({
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    prompt: w.kr,
    options: pickOptions(words, w),
    answer: w.uz,
    durationMs,
  }));
}
