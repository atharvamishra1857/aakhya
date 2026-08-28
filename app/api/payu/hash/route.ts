export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { txnid, amount, productinfo, firstname, email, udf1 } = await req.json();

    const salt = process.env.PAYU_SALT!;
    const key = process.env.NEXT_PUBLIC_PAYU_KEY!;

    // FIX: Fallback to an empty string to prevent "undefined" from being injected
    const safeUdf1 = udf1 || "";

    // The sequence requires exactly 16 pipes between the key and salt.
    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${safeUdf1}||||||||||${salt}`;

    const hash = crypto
      .createHash("sha512")
      .update(hashString)
      .digest("hex");

    return NextResponse.json({ hash, key });
  } catch (err) {
    console.error("PayU hash generation failed:", err);
    return NextResponse.json({ error: "Hash generation failed" }, { status: 500 });
  }
}