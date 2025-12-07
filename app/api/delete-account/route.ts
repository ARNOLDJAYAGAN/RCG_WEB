import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { pool } from "@/lib/db";

interface UserPayload {
  id: number;
  email: string;
  name: string;
}

export async function DELETE(req: NextRequest) {
  try {
    // Get JWT from cookie
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;

    const userId = payload.id;

    // Delete dependent subscription first
    await pool.query("DELETE FROM subscriptions WHERE user_id = $1", [userId]);

    // Delete user
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);

    // Optionally clear cookie
    const response = NextResponse.json({ success: true });
    response.cookies.delete("token"); // remove JWT cookie
    return response;
  } catch (err) {
    console.error("Delete account error:", err);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
