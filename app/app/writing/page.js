"use client";
// Жазу көмекшісі енді Aqyl чатының «Жазуымды түзет» режимінде.
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/app/qyran?mode=write");
  }, [router]);
  return null;
}
