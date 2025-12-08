import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: userId } = params;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Missing userId" },
        { status: 400 }
      );
    }

    // Step 1: Update expired subscriptions for this user
    await pool.query(
      `
      UPDATE subscriptions
      SET status = 'inactive'
      WHERE user_id = $1
        AND expires_at IS NOT NULL
        AND expires_at < NOW()
        AND status != 'inactive'
      `,
      [userId]
    );

    // Step 2: Fetch the latest subscription
    const result = await pool.query(
      `
      SELECT * FROM subscriptions
      WHERE user_id = $1
      ORDER BY subscribed_at DESC
      LIMIT 1
      `,
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
