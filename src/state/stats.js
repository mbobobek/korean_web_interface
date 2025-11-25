const KEY = "korean_web_stats";

export const emptyStats = () => ({ know: [], hard: [], later: [] });

export function loadStats() {
  if (typeof localStorage === "undefined") return emptyStats();
  try {
    return JSON.parse(localStorage.getItem(KEY)) || emptyStats();
  } catch {
    return emptyStats();
  }
}

export function saveStats(stats) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(stats));
}

export function updateStats(stats, word, type) {
  const clone = {
    know: [...stats.know],
    hard: [...stats.hard],
    later: [...stats.later],
  };
  if (type === "know") clone.know.push(word);
  if (type === "hard") clone.hard.push(word);
  if (type === "later") clone.later.push(word);
  return clone;
}
