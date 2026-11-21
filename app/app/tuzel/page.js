"use client";
// Түзел бөлімі Aqyl чатына қосылды: ескі сілтеме чатты керек режиммен ашады (?tab=speak → айтылым).
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    let mode = "write";
    try {
      if (new URLSearchParams(window.location.search).get("tab") === "speak") mode = "speak";
    } catch {}
    router.replace(`/app/qyran?mode=${mode}`);
  }, [router]);
  return null;
}
