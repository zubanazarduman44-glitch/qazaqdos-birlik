// Күнге/уақытқа тәуелді рендер үшін гидрация-қауіпсіз ілмектер.
// Сервер (build/deploy уақыты, UTC) мен клиент (пайдаланушының жергілікті күні) әр түрлі болуы мүмкін,
// сондықтан бірінші (гидрация) рендерде уақыт «жоқ» (null) — екі жақта да бірдей белгі шығады.
// Гидрациядан кейін React бірден қайта рендер жасайды да, нақты күн қойылады.
// Клиенттегі ауысуда (soft navigation) мән бірінші рендерден-ақ бар — жыпылықтау болмайды.
import { useSyncExternalStore } from "react";

const noop = () => () => {};

// true — клиентте, гидрация аяқталған соң; false — серверде және гидрация рендерінде
export function useMounted() {
  return useSyncExternalStore(noop, () => true, () => false);
}

// Date (клиент) немесе null (сервер / гидрация)
export function useClientDate() {
  return useMounted() ? new Date() : null;
}

// Күн нөмірі: UTC бойынша және құрылғының жергілікті күні бойынша
export const utcDayIndex = (d) => Math.floor(d.getTime() / 86_400_000);
export const localDayIndexOf = (d) => Math.floor((d.getTime() - d.getTimezoneOffset() * 60_000) / 86_400_000);
