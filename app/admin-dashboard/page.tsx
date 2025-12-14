"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";

interface Subscription {
  id: number;
  user_id: number;
  name: string;
  email: string;
  phone: string;
  plan: string;
  price: number;
  status: string;
  subscribed_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    const adminEmail = sessionStorage.getItem("admin_email");
    if (!adminEmail) {
      router.replace("/admin");
    } else {
      fetchSubscriptions();
    }
  }, [router]);

  const fetchSubscriptions = async () => {
    try {
      const res = await fetch("/api/subscription/admin");
      const data = await res.json();
      if (data.success) setSubscriptions(data.subscriptions);
    } catch (err) {
      console.error("Admin fetch subscriptions error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    setProcessingId(id);
    try {
      const res = await fetch("/api/subscription/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchSubscriptions();
        alert("Subscription approved!");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Admin approve error:", err);
      alert("Error approving subscription");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading)
    return (
      <div className="loading-page">
        <Loader2 className="loading-spinner" />
      </div>
    );

  return (
    <div className="admin-page">
      <h1 className="admin-title">Subscription Management</h1>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead className="table-head">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Plan</th>
              <th>Price</th>
              <th>Status</th>
              <th>Subscribed At</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody className="table-body">
            {subscriptions.map((sub) => (
              <tr key={sub.id} className="table-row">
                <td>{sub.name}</td>
                <td>{sub.email}</td>
                <td>{sub.phone}</td>
                <td className="plan-text">{sub.plan}</td>
                <td>₱{sub.price}</td>
                <td>
                  <span className={`status-badge ${sub.status}`}>
                    {sub.status}
                  </span>
                </td>
                <td>{new Date(sub.subscribed_at).toLocaleDateString()}</td>
                <td>
                  {sub.status === "pending" ? (
                    <Button
                      size="sm"
                      className="approve-button"
                      disabled={processingId === sub.id}
                      onClick={() => handleApprove(sub.id)}
                    >
                      {processingId === sub.id ? (
                        <Loader2 className="button-spinner" />
                      ) : (
                        <CheckCircle className="button-icon" />
                      )}
                      Approve
                    </Button>
                  ) : (
                    <span className="approved-text">Approved</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
