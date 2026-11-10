"use client";
// Таңдалған кейіпкер (сыртқы көрінісі). Аты — әрқашан Qyran. Қарапайым сыртқы қойма: бүкіл сайт бірден жаңарады.
import { useSyncExternalStore } from "react";

let skin = "eagle";
const subs = new Set();
export function setSkin(id) {
  if (!id || id === skin) return;
  skin = id;
  subs.forEach((f) => f());
}
export function useSkin() {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => skin,
    () => "eagle"
  );
}
