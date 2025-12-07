import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { user_id, plan, price, name, phone } = data;

    // Fetch the user's email from your users table
    const userRes = await pool.query(
      "SELECT email FROM users WHERE id = $1",
      [user_id]
    );

    if (!userRes.rows.length) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const email = userRes.rows[0].email;

    // Insert subscription with email
    const result = await pool.query(
      `INSERT INTO subscriptions (user_id, email, plan, price, name, phone, status, subscribed_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending', NOW())
       RETURNING *`,
      [user_id, email, plan, parseFloat(price), name, phone]
    );

    return NextResponse.json({ success: true, subscription: result.rows[0] });

  } catch (err: any) {
    console.error("Subscription create error:", err);
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}
