import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db"; // your Neon/Postgres connection

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password required" }, { status: 400 });
    }

    const result = await pool.query(
      "SELECT * FROM admins WHERE email = $1 AND password = $2",
      [email, password] // plain password for prototype
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    // Login successful
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
