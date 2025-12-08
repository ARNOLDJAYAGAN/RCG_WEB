import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    // Update all subscriptions that are past their expiration date
    const result = await pool.query(
      `
      UPDATE subscriptions
      SET status = 'inactive'
      WHERE expires_at IS NOT NULL
        AND expires_at < NOW()
        AND status != 'inactive'
      RETURNING id, user_id, status, expires_at
      `
    );

    return NextResponse.json({
      success: true,
      updated: result.rows.length,
      subscriptions: result.rows,
      message: result.rows.length
        ? "Expired subscriptions updated successfully."
        : "No subscriptions needed updating.",
    });
  } catch (err: any) {
    console.error("Update expired subscriptions error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
