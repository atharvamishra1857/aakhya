export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Explicitly convert EVERYTHING to strings and trim whitespace
    const txnid = String(body.txnid || "").trim();
    const amount = String(body.amount || "").trim(); // Make sure this perfectly matches the frontend (e.g., "100.00" vs "100")
    const productinfo = String(body.productinfo || "").trim();
    const firstname = String(body.firstname || "").trim();
    const email = String(body.email || "").trim();
    const udf1 = String(body.udf1 || "").trim();

    // 2. Clean environment variables (removes accidental spaces from .env)
    const salt = (process.env.PAYU_SALT || "").trim();
    const key = (process.env.NEXT_PUBLIC_PAYU_KEY || "").trim();

    if (!key || !salt) {
      console.error("Missing PayU Key or Salt in environment variables.");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // 3. Construct the exact hash sequence (16 pipes)
    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}||||||||||${salt}`;

    // 4. Generate the SHA-512 hash
    const hash = crypto
      .createHash("sha512")
      .update(hashString)
      .digest("hex");

    // Tip: We are temporarily returning the hashString so you can debug it in your browser console!
    return NextResponse.json({ hash, key, debug_hashString: hashString });
    
  } catch (err) {
    console.error("PayU hash generation failed:", err);
    return NextResponse.json({ error: "Hash generation failed" }, { status: 500 });
  }
}