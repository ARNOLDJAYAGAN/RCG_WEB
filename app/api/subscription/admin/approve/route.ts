import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, message: "Missing subscription ID" }, { status: 400 });
    }

    // Calculate expiration date: 1 month from now
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    const result = await pool.query(
      `UPDATE subscriptions
       SET status = 'active', expires_at = $1
       WHERE id = $2
       RETURNING *`,
      [expiresAt, id]
    );

    if (!result.rows.length) {
      return NextResponse.json({ success: false, message: "Subscription not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, subscription: result.rows[0] });

  } catch (err: any) {
    console.error("Admin approve error:", err);
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}
