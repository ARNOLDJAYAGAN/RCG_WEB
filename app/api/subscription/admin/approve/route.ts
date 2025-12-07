// /api/subscriptions/admin/approve/route.ts
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ success: false, message: "Missing subscription ID" });

    await pool.query(
      `UPDATE subscriptions SET status='active' WHERE id=$1`,
      [id]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: err.message });
  }
}
