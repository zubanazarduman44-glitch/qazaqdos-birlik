// Unsplash фотолары (тегін Unsplash License), әрқайсысы көзбен тексерілген
export function photoUrl(id, w = 1200, h) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=${w}${h ? `&h=${h}` : ""}`;
}
