export function smartChunk(words = []) {
  const n = words.length;
  if (n <= 20) return [words];

  const makeChunks = (parts) => {
    const base = Math.floor(n / parts);
    const extra = n % parts;
    const sizes = Array.from({ length: parts }, (_, i) => base + (i < extra ? 1 : 0));
    const chunks = [];
    let idx = 0;
    for (const size of sizes) {
      chunks.push(words.slice(idx, idx + size));
      idx += size;
    }
    return chunks;
  };

  if (n <= 40) return makeChunks(2);
  if (n <= 60) return makeChunks(3);
  if (n <= 80) return makeChunks(4);
  return makeChunks(Math.ceil(n / 20));
}
