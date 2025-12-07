"use client";

import { useRouter } from "next/navigation";

export function SimpleHeader({ textColor = "text-white" }) {
  const router = useRouter();

  return (
    <header className="bg-black p-4 border-none">   {/* ← removed border */}
      <h1
        className={`text-xl font-bold cursor-pointer ${textColor}`}
        onClick={() => router.push("/")}
      >
        RCG Fitness
      </h1>
    </header>
  );
}
