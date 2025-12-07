import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, user_id, name, email, phone, plan, price, status, subscribed_at
       FROM subscriptions
       ORDER BY subscribed_at DESC`
    );

    return NextResponse.json({ success: true, subscriptions: result.rows });
  } catch (err: any) {
    console.error("Admin GET error:", err);
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}
