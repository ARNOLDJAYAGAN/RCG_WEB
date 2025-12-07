"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle } from "lucide-react";
import { SimpleHeader } from "@/components/simple-header";
import { API_BASE } from "@/lib/api";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [user, setUser] = useState<{ id: number; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  const plan = searchParams.get("plan") || "Premium";
  const price = searchParams.get("price") || "1499";

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, { credentials: "include" });
        const data = await res.json();
        if (!data.loggedIn) router.push("/auth");
        else setUser(data.user);
      } catch {
        router.push("/auth");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleDone = async () => {
    if (!user || !phone.trim() || !name.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/subscription/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          user_id: user.id,
          email: user.email, // added email
          plan,
          price: parseFloat(price),
          phone,
          name,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to create subscription");

      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: any) {
      console.error(err);
      alert(err.message);
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="animate-spin w-10 h-10 text-orange-500" />
      </div>
    );

  if (success)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-black text-white">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold">Subscription Pending!</h2>
        <p>Redirecting to dashboard...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white">
      <SimpleHeader />
      <main className="container mx-auto px-4 py-24 max-w-lg">
        <Card className="mb-6 bg-gray-900 border border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Selected Plan: {plan}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-500 mb-4">₱{price}/month</p>

            {/* USER INFO */}
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-700 bg-gray-800 text-white p-2 mb-4 rounded"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-700 bg-gray-800 text-white p-2 mb-4 rounded"
            />

            {/* QR CODE / IMAGE */}
            <div className="mb-4">
              <p className="text-white mb-2">Scan QR Code to Pay:</p>
              <div className="border border-gray-700 rounded p-4 flex justify-center items-center bg-gray-800">
                <img
                  src="/images/kashg.jpg"
                  alt="Payment QR Code"
                  className="w-48 h-48 object-contain"
                />
              </div>
            </div>

            <Button
              onClick={handleDone}
              className="w-full bg-orange-500 text-black py-3 font-semibold hover:bg-orange-600"
            >
              Done
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
