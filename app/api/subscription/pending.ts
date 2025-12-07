import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;
  if (!userId) return NextResponse.json({ success: false, message: "Missing userId" });

  try {
    const result = await pool.query(
      `SELECT id, plan, price, status, subscribed_at
       FROM subscriptions
       WHERE user_id = $1
       ORDER BY subscribed_at DESC
       LIMIT 1`,
      [parseInt(userId, 10)]
    );

    return NextResponse.json({
      success: true,
      subscription: result.rows[0] || null
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: err.message });
  }
}
