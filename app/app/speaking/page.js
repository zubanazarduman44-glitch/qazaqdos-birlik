"use client";
// Айтылым жаттығуы енді Aqyl чатының «Айтылымды тексер» режимінде (сөйлеу деңгейі state.speaking-те сақталады).
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/app/qyran?mode=speak");
  }, [router]);
  return null;
}
