// Карточка суреттерінің IndexedDB кэші (three.js-ке тәуелсіз, жеңіл модуль).
// Модельдер өзгерсе VERSION-ды арттыру керек — ескі суреттер өздігінен ескіреді.
const VERSION = "v1";
const DB = "qd_artifacts";

export const shotKey = (id, size) => `${VERSION}:${id}:${size}`;

let dbp = null;
function idb() {
  if (dbp) return dbp;
  dbp = new Promise((res, rej) => {
    try {
      const r = indexedDB.open(DB, 1);
      r.onupgradeneeded = () => r.result.createObjectStore("shots");
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    } catch (e) {
      rej(e);
    }
  });
  dbp.catch(() => {
    dbp = null;
  });
  return dbp;
}

export async function cachedShot(key) {
  try {
    const db = await idb();
    return await new Promise((res) => {
      const q = db.transaction("shots").objectStore("shots").get(key);
      q.onsuccess = () => res(typeof q.result === "string" ? q.result : null);
      q.onerror = () => res(null);
    });
  } catch {
    return null;
  }
}

export async function storeShot(key, url) {
  try {
    const db = await idb();
    db.transaction("shots", "readwrite").objectStore("shots").put(url, key);
  } catch {
    /* кэш міндетті емес */
  }
}
