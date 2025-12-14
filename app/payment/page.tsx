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
          email: user.email,
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
      <div className="loading-page">
        <Loader2 className="loading-spinner" />
      </div>
    );

  if (success)
    return (
      <div className="success-page">
        <CheckCircle className="success-icon" />
        <h2 className="success-title">Subscription Pending!</h2>
        <p className="success-text">Redirecting to dashboard...</p>
      </div>
    );

  return (
    <div className="page dark">
      <SimpleHeader />

      <main className="payment-container">
        <Card className="payment-card">
          <CardHeader>
            <CardTitle className="payment-plan">Selected Plan: {plan}</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="payment-price">₱{price} / month</p>

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input"
            />

            <div className="qr-section">
              <p className="qr-label">Scan QR Code to Pay:</p>
              <div className="qr-box">
                <img
                  src="/images/qr.jpg"
                  alt="Payment QR Code"
                  className="qr-image"
                />
              </div>
            </div>

            <Button onClick={handleDone} className="primary-button full">
              Done
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
