export const createSessionLog = () => ({ know: [], hard: [], later: [] });

export function addSessionLog(log, word, type) {
  const next = { ...log };
  if (!next[type]) next[type] = [];
  next[type] = [...next[type], word];
  return next;
}
