import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: number;
  email: string;
  name: string;
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ loggedIn: false }, { status: 401 });

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;

    return NextResponse.json({ loggedIn: true, user: payload });
  } catch (err) {
    console.error("Auth check error:", err);
    return NextResponse.json({ loggedIn: false }, { status: 401 });
  }
}
