"use client";

import { useRouter } from "next/navigation";

interface SimpleHeaderProps {
  textColor?: string;
}

export function SimpleHeader({ textColor = "text-primary" }: SimpleHeaderProps) {
  const router = useRouter();

  return (
    <header className="simple header">
      <h1
        className={`text-3xl font-bold cursor-pointer ${textColor} hover:opacity-90 transition`}
        onClick={() => router.push("/")}
      >
        RCG Fitness
      </h1>
    </header>
  );
}
