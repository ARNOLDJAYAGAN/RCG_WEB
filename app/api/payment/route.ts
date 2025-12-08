import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { user_id, plan, price, name, phone } = data;

    if (!user_id || !plan || !price || !name || !phone) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Payment body:", data);

    // Optionally fetch user email
    const userRes = await pool.query(
      "SELECT email FROM users WHERE id = $1",
      [user_id]
    );
    const email = userRes.rows[0]?.email || null;

    const result = await pool.query(
      `INSERT INTO subscriptions 
       (user_id, email, plan, price, name, phone, status, subscribed_at, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending', NOW(), NOW() + INTERVAL '1 month')
       RETURNING *`,
      [user_id, email, plan, parseFloat(price), name, phone]
    );

    console.log("Inserted payment subscription:", result.rows[0]);

    return NextResponse.json({
      success: true,
      message: "Payment processed, subscription is pending",
      subscription: result.rows[0],
    });
  } catch (err: any) {
    console.error("Payment API error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
