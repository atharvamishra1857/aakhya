import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const amount = Number(body.amount); // rupees, e.g. 750.00
    const receipt = String(body.receipt || `rcpt_${Date.now()}`).slice(0, 40);

    const keyId = (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "").trim();
    const keySecret = (process.env.RAZORPAY_KEY_SECRET || "").trim();

    if (!keyId || !keySecret) {
      console.error("Missing Razorpay Key ID or Secret in environment variables.");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 },
      );
    }

    const auth = btoa(`${keyId}:${keySecret}`);

    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Razorpay expects paise
        currency: "INR",
        receipt,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Razorpay order creation failed:", JSON.stringify(data));
      return NextResponse.json(
        { error: "Failed to create order", detail: data },
        { status: 500 },
      );
    }

    return NextResponse.json({
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
      key: keyId,
    });
  } catch (err) {
    console.error("Razorpay order route failed:", err);
    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 },
    );
  }
}