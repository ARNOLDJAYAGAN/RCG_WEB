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
    const yOffset = -96;
    const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
    setActiveSection(id);
  };

  const navItemClass = (id: string) =>
    `nav-item ${activeSection === id ? "active" : "inactive"}`;

  return (
    <header className="header">
      <div className="header-container">
        <h1 className="header-logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          RCG Fitness
        </h1>

        <div className="header-right">
          <nav className="nav">
            <button onClick={() => scrollToSection("facilities")} className={navItemClass("facilities")}>
              Facilities
            </button>
            <button onClick={() => scrollToSection("membership")} className={navItemClass("membership")}>
              Membership
            </button>
          </nav>

          {user ? (
            <Link href="/dashboard" className="header-cta">
              Dashboard
            </Link>
          ) : (
            <Link href="/auth" className="header-cta">
              Start Your Journey
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}