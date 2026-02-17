export const fmt = (n) => typeof n === "number" ? n.toLocaleString("es") : n;
export const pct = (n) => typeof n === "number" ? `${(n * 100).toFixed(1)}%` : n;
