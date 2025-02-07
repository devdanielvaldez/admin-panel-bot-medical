"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      window.location.href = "https://farmaciacamilo.smart-shoppingrd.com/";
    }, 8000);
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <p className="text-lg font-semibold">Accediendo...</p>
    </div>
  );
}