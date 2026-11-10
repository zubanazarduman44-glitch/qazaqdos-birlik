// Интерфейсті басқа тілдерге ЖИ арқылы аудару үшін көмекші функциялар
export function flatten(obj, pre = "", out = {}) {
  for (const [k, v] of Object.entries(obj || {})) {
    if (typeof v === "string") out[pre + k] = v;
    else if (v && typeof v === "object") flatten(v, `${pre}${k}.`, out);
  }
  return out;
}
// Аударылған жолдарды түпнұсқа құрылымға (функциялармен бірге) қайта қояды
export function apply(obj, map, pre = "") {
  if (Array.isArray(obj)) return obj.map((v, i) => (typeof v === "string" ? map[`${pre}${i}`] || v : v && typeof v === "object" ? apply(v, map, `${pre}${i}.`) : v));
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = typeof v === "string" ? map[pre + k] || v : v && typeof v === "object" ? apply(v, map, `${pre}${k}.`) : v;
  }
  return out;
}
