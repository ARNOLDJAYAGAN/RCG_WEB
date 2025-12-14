"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
  id: number;
  email: string;
  role: string;
}

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");

  // Track scroll position (with header offset fix)
  useEffect(() => {
    const sections = ["facilities", "membership"];

    const handleScroll = () => {
      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check user session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = await res.json();
        if (data.loggedIn) setUser(data.user);
      } catch {
        setUser(null);
      }
    };
    checkSession();
  }, []);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (!section) return;

    const yOffset = -96; // header height offset
    const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
    setActiveSection(id);
  };

  const navItemClass = (id: string) =>
    `text-sm md:text-base font-semibold transition-colors ${
      activeSection === id
        ? "text-primary underline"
        : "text-muted-foreground hover:text-primary"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <h1
          className="text-2xl font-bold text-primary cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          RCG Fitness
        </h1>

        {/* Right group: nav + button */}
        <div className="flex items-center gap-8">
          {/* Navigation beside button */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection("facilities")}
              className={navItemClass("facilities")}
            >
              Facilities
            </button>
            <button
              onClick={() => scrollToSection("membership")}
              className={navItemClass("membership")}
            >
              Membership
            </button>
          </nav>

          {/* CTA Button */}
          {user ? (
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded bg-primary text-white hover:bg-primary/90 text-sm md:text-base"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/auth"
              className="px-5 py-2 rounded bg-primary text-white hover:bg-primary/90 text-sm md:text-base"
            >
              Start Your Journey
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
