export const keepTail = (t: string, n = 2) => {
  const w = t.split(" ");
  if (w.length <= n + 1) return t;
  return w.slice(0, -n).join(" ") + " " + w.slice(-n).join("\u00A0");
};
