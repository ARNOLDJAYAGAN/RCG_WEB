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

  // Check admin login
  useEffect(() => {
    const adminEmail = sessionStorage.getItem("admin_email");
    if (!adminEmail) {
      router.replace("/admin"); // redirect to login if not logged in
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
    return <Loader2 className="animate-spin w-10 h-10 mx-auto mt-20 text-orange-500" />;

  return (
    <div className="min-h-screen p-8 bg-black">
      <h1 className="text-3xl font-bold mb-6 text-orange-500">
        Subscription Management
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 shadow-md rounded-lg overflow-hidden border border-gray-700">
          <thead className="bg-gray-800 text-left">
            <tr>
              <th className="px-6 py-3 text-gray-200 font-semibold">Name</th>
              <th className="px-6 py-3 text-gray-200 font-semibold">Email</th>
              <th className="px-6 py-3 text-gray-200 font-semibold">Phone</th>
              <th className="px-6 py-3 text-gray-200 font-semibold">Plan</th>
              <th className="px-6 py-3 text-gray-200 font-semibold">Price</th>
              <th className="px-6 py-3 text-gray-200 font-semibold">Status</th>
              <th className="px-6 py-3 text-gray-200 font-semibold">Subscribed At</th>
              <th className="px-6 py-3 text-gray-200 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {subscriptions.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-800 transition">
                <td className="px-6 py-4 text-gray-100">{sub.name}</td>
                <td className="px-6 py-4 text-gray-100">{sub.email}</td>
                <td className="px-6 py-4 text-gray-100">{sub.phone}</td>
                <td className="px-6 py-4 font-semibold text-orange-400">{sub.plan}</td>
                <td className="px-6 py-4 text-gray-100">₱{sub.price}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${
                      sub.status === "active"
                        ? "bg-green-600 text-white"
                        : sub.status === "pending"
                        ? "bg-yellow-500 text-black"
                        : "bg-gray-700 text-gray-200"
                    }`}
                  >
                    {sub.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-100">
                  {new Date(sub.subscribed_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  {sub.status === "pending" ? (
                    <Button
                      size="sm"
                      className="bg-orange-500 text-black"
                      disabled={processingId === sub.id}
                      onClick={() => handleApprove(sub.id)}
                    >
                      {processingId === sub.id ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-1 inline-block" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-1 inline-block" />
                      )}
                      Approve
                    </Button>
                  ) : (
                    <span className="text-green-400 font-medium">Approved</span>
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
