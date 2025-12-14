"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { API_BASE } from "@/lib/api";
import { SimpleHeader } from "@/components/simple-header";

interface User {
  id: number;
  email: string;
  name: string;
}

interface Subscription {
  id: number;
  plan: string;
  price: number;
  status: string;
  subscribed_at: string;
  expires_at: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, { credentials: "include" });
        if (!res.ok) return router.push("/auth");
        const data = await res.json();
        if (!data.loggedIn) return router.push("/auth");
        setUser(data.user);
      } catch {
        router.push("/auth");
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [router]);

  useEffect(() => {
    if (!user) return;

    const getSubscription = async () => {
      try {
        await fetch(`${API_BASE}/update-expired`, { method: "POST" });
        const res = await fetch(`${API_BASE}/subscription/${user.id}`);
        if (!res.ok) return setSubscription(null);
        const data = await res.json();
        setSubscription(data.success ? data.subscription : null);
      } catch (err) {
        console.error("Failed to fetch subscription:", err);
      }
    };

    getSubscription();
  }, [user]);

  const handleDeleteAccount = async () => {
    if (!confirm("⚠️ Are you sure you want to delete your account? This action cannot be undone.")) return;
    setDeleting(true);

    try {
      const res = await fetch("/api/delete-account", { method: "DELETE", credentials: "include" });
      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data?.error || "Failed to delete account.");
        setDeleting(false);
        return;
      }

      alert("Account deleted successfully.");
      router.push("/auth");
    } catch (err) {
      console.error(err);
      alert("An error occurred.");
      setDeleting(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/logout", { method: "POST", credentials: "include" });
      router.push("/auth");
    } catch (err) {
      console.error(err);
      alert("Logout failed");
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-page">
        <Loader2 className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="page">
      <SimpleHeader />

      <main className="dashboard-container">
        <h1 className="dashboard-title">Dashboard</h1>

        {subscription ? (
          <>
            <div className="status-box">
              <p className="status-text">
                <strong>Status:</strong>{" "}
                <span className={`status ${subscription.status}`}>
                  {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                </span>
              </p>
            </div>

            <Button
              onClick={() => setShowDetails(!showDetails)}
              className="toggle-button"
            >
              {showDetails ? "Hide Subscription Details" : "View Subscription Details"}
              {showDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Button>

            {showDetails && (
              <Card className="details-card">
                <CardHeader>
                  <CardTitle>Subscription Information</CardTitle>
                </CardHeader>
                <CardContent className="details-content">
                  <p><strong>Plan:</strong> {subscription.plan}</p>
                  <p><strong>Price:</strong> ₱{subscription.price}/month</p>
                  <p><strong>Subscribed At:</strong> {new Date(subscription.subscribed_at).toLocaleString()}</p>
                  <p>
                    <strong>Expires At:</strong>{" "}
                    {subscription.expires_at
                      ? new Date(subscription.expires_at).toLocaleString()
                      : "N/A"}
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <p className="no-subscription">You have no subscriptions. Choose a membership to get started.</p>
        )}

        <div className="dashboard-actions">
          <Button
            onClick={handleDeleteAccount}
            variant="destructive"
            disabled={deleting}
          >
            {deleting ? <Loader2 className="button-spinner" /> : "Delete Account"}
          </Button>

          <Button
            onClick={handleLogout}
            variant="secondary"
            disabled={loggingOut}
          >
            {loggingOut ? <Loader2 className="button-spinner" /> : "Logout"}
          </Button>
        </div>
      </main>
    </div>
  );
}
