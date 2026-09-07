export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Convert everything to strings and trim whitespace
    const txnid = String(body.txnid || "").trim();
    const amount = String(body.amount || "").trim();
    const productinfo = String(body.productinfo || "").trim();
    const firstname = String(body.firstname || "").trim();
    const email = String(body.email || "").trim();
    const udf1 = String(body.udf1 || "").trim();

    // FIX: trim() on both — removes accidental spaces/newlines from Vercel env var storage
    const salt = (process.env.PAYU_SALT || "").trim();
    const key = (process.env.NEXT_PUBLIC_PAYU_KEY || "").trim();

    if (!key || !salt) {
      console.error("Missing PayU Key or Salt in environment variables.");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    // Validate required fields — prevents malformed hash reaching PayU
    if (!txnid || !amount || !productinfo || !firstname || !email) {
      console.error("PayU hash: missing required fields", {
        txnid: !!txnid,
        amount: !!amount,
        productinfo: !!productinfo,
        firstname: !!firstname,
        email: !!email,
      });
      return NextResponse.json(
        { error: "Missing required payment fields" },
        { status: 400 },
      );
    }

    // Exact PayU hash sequence: key|txnid|amount|productinfo|firstname|email|udf1|||||||||salt
    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}||||||||||${salt}`;

    const hash = crypto
      .createHash("sha512")
      .update(hashString)
      .digest("hex");

    console.log(`[PayU] Hash generated for txnid=${txnid} at ${new Date().toISOString()}`);

    // Never return hashString or salt to the client
    return NextResponse.json({ hash, key });
  } catch (err) {
    console.error("PayU hash generation failed:", err);
    return NextResponse.json(
      { error: "Hash generation failed" },
      { status: 500 },
    );
  }
}