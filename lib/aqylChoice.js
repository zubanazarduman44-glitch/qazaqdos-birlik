// Таңдалған Aqyl бейнесі — жеңіл ортақ қойма (Qyran кез келген жерде useApp-сыз оқи алады).
// Шын мәні state.profile.aqyl ішінде (Store оны осында синхрондайды). Алғашқы кадр жыпылықтамас үшін
// клиентте сақталған күйден бірден оқимыз.
import { useSyncExternalStore } from "react";
import { aqylId, AQYL_DEFAULT } from "./aqyl";

let cur = AQYL_DEFAULT;
if (typeof window !== "undefined") {
  try {
    const s = JSON.parse(localStorage.getItem("qd_state_v1") || "null");
    cur = aqylId(s?.profile?.aqyl);
  } catch {}
}
const subs = new Set();

export function setAqylChoice(v) {
  const id = aqylId(v);
  if (id === cur) return;
  cur = id;
  subs.forEach((f) => f());
}

const subscribe = (f) => {
  subs.add(f);
  return () => subs.delete(f);
};

export function useAqylChoice() {
  return useSyncExternalStore(subscribe, () => cur, () => AQYL_DEFAULT);
}
