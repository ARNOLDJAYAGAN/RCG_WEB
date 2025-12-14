"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // keep cookies for session
      })

      const data = await res.json()
      if (data.success) {
        router.push("/auth")
      } else {
        alert(data.message || "Failed to logout. Please try again.")
      }
    } catch (err) {
      console.error("Logout failed:", err)
      alert("Failed to logout. Please try again.")
    }
  }

  return (
    <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white">
      Logout
    </Button>
  )
}
