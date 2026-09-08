import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const txnid = String(body.txnid || "").trim();
    const amount = String(body.amount || "").trim();
    const productinfo = String(body.productinfo || "").trim();
    const firstname = String(body.firstname || "").trim();
    const email = String(body.email || "").trim();
    const udf1 = String(body.udf1 || "").trim();

    const salt = "dCWmlOTvp6upSuBPDwsjkQmwRWGEZ4i8";
    const key = "oPPqMI";

    if (!txnid || !amount || !productinfo || !firstname || !email) {
      return NextResponse.json(
        { error: "Missing required payment fields" },
        { status: 400 },
      );
    }

    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}||||||||||${salt}`;

    const encoder = new TextEncoder();
    const data = encoder.encode(hashString);
    const hashBuffer = await crypto.subtle.digest("SHA-512", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    return NextResponse.json({ hash, key });
  } catch (err) {
    return NextResponse.json(
      { error: "Hash generation failed" },
      { status: 500 },
    );
  }
}