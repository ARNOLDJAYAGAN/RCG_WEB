"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

interface User {
  id: number
  email: string
  role: string
}

export function Header() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" })
        const data = await res.json()
        if (data.loggedIn) setUser(data.user)
      } catch {
        setUser(null)
      }
    }

    checkSession()
  }, [])

  const handleLogoClick = () => {
    if (user) {
      window.location.href = "/dashboard"
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id)
    section?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <header className="flex flex-col md:flex-row justify-between items-center px-8 py-4 bg-background">

      {/* Logo */}
      <h1
        className="text-3xl font-bold text-primary cursor-pointer"
        onClick={handleLogoClick}
      >
        RCG Fitness
      </h1>

      {/* Center nav */}
      <nav className="flex space-x-6 mt-4 md:mt-0 justify-center">
        <button
          onClick={() => scrollToSection("facilities")}
          className="text-primary font-semibold hover:underline"
        >
          Facilities
        </button>
        <button
          onClick={() => scrollToSection("membership")}
          className="text-primary font-semibold hover:underline"
        >
          Membership
        </button>
        <button
          onClick={() => scrollToSection("reviews")}
          className="text-primary font-semibold hover:underline"
        >
          Reviews
        </button>
      </nav>

      {/* Right side button */}
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
  )
}
