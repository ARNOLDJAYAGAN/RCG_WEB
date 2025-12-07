import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    const result = await pool.query(
      `SELECT * FROM subscriptions 
       WHERE user_id = $1 
       ORDER BY subscribed_at DESC 
       LIMIT 1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No subscription found",
      });
    }

    return NextResponse.json({
      success: true,
      subscription: result.rows[0],
    });
  } catch (err: any) {
    console.error("Fetch subscription error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
