// VR «өмір» орындарының тізілімі. Әр орын — жеке файл, тек сахна ашылғанда жүктеледі (dynamic import).
// side — диалог кезінде кейіпкер тұратын жақ (сөз көпіршігі қарсы жаққа шығады). Тізімде жоқ орын — бұрынғы VrScene суреті.
export const LIFE = {
  cafe: { side: "right", load: () => import("./cafe") },
  shop: { side: "right", load: () => import("./shop") },
  taxi: { side: "left", load: () => import("./taxi") },
  school: { side: "right", load: () => import("./school") },
  bank: { side: "right", load: () => import("./bank") },
  post: { side: "right", load: () => import("./post") },
  bus: { side: "left", load: () => import("./bus") },
  guest: { side: "right", load: () => import("./guest") },
  phone: { side: "right", load: () => import("./phone") },
  office: { side: "right", load: () => import("./office") },
};

export const hasLife = (art) => !!LIFE[art];
export const lifeSide = (art) => LIFE[art]?.side;

const got = new Map();
// Орын модулін жүктеу (бір рет); 8 с ішінде келмесе — қате (бұрынғы суретке оралады)
export function loadLife(art) {
  const e = LIFE[art];
  if (!e) return Promise.reject(new Error("no life"));
  if (!got.has(art)) {
    const p = Promise.race([
      e.load().then((m) => {
        const mod = m.default || m;
        if (!mod || typeof mod.Stage !== "function") throw new Error("bad place module");
        return mod;
      }),
      new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 8000)),
    ]);
    p.catch(() => got.delete(art));
    got.set(art, p);
  }
  return got.get(art);
}
