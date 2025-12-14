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

  // Track scroll position to keep the active tab highlighted
  useEffect(() => {
    const sections = ["facilities", "membership", "reviews"];

    const handleScroll = () => {
      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();

        // Section is visible in viewport
        if (rect.top <= 150 && rect.bottom >= 150) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initialize

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

  const handleLogoClick = () => {
    if (user) {
      window.location.href = "/dashboard";
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id); // stay active even after switching content
    }
  };

  const navItemClass = (id: string) =>
    `text-primary font-semibold hover:underline transition ${
      activeSection === id ? "underline" : ""
    }`;

  return (
    <header className="flex flex-col md:flex-row justify-between items-center px-8 py-4 bg-background w-full z-50 sticky top-0">
      {/* Logo */}
      <h1
        className="text-3xl font-bold text-primary cursor-pointer"
        onClick={handleLogoClick}
      >
        RCG Fitness
      </h1>

      {/* Navigation */}
      <nav className="flex space-x-6 mt-4 md:mt-0 justify-center">
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

      {/* Right Side Button */}
      <div className="mt-4 md:mt-0">
        {user ? (
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Go to Dashboard
          </Link>
        ) : (
          <Link
            href="/auth"
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Start Your Journey Today
          </Link>
        )}
      </div>
    </header>
  );
}
