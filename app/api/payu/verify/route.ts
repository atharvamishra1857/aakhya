import { NextRequest, NextResponse } from "next/server";
import { createShopifyOrder } from "@/app/actions/createorder";

// In-memory dedup guard for the lifetime of this isolate instance.
const processedTxns = new Set<string>();

const META_PIXEL_ID = "1733404514535351";

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const msgData = encoder.encode(message);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, msgData);
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sendPurchaseToMeta(params: {
  eventId: string;
  amount: number;
  email: string;
  phone: string;
  cartItems: Array<{ id: string; title: string; price: number; quantity: number }>;
}) {
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!accessToken) {
    console.error("[Meta CAPI] Missing META_CAPI_ACCESS_TOKEN — Purchase event not sent");
    return;
  }

  try {
    const body = {
      data: [
        {
          event_name: "Purchase",
          event_time: Math.floor(Date.now() / 1000),
          event_id: params.eventId,
          action_source: "website",
          user_data: {
            em: [await sha256Hex(params.email)],
            ph: [await sha256Hex(params.phone.replace(/\D/g, ""))],
          },
          custom_data: {
            currency: "INR",
            value: params.amount,
            content_ids: params.cartItems.map((i) => i.id),
            contents: params.cartItems.map((i) => ({
              id: i.id,
              quantity: i.quantity,
              item_price: i.price,
            })),
          },
        },
      ],
    };

    const res = await fetch(
      `https://graph.facebook.com/v20.0/${META_PIXEL_ID}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );
    const json = await res.json();
    console.log("[Meta CAPI] Purchase event response:", JSON.stringify(json));
  } catch (err) {
    console.error("[Meta CAPI] Failed to send Purchase event:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const razorpay_order_id = String(body.razorpay_order_id || "");
    const razorpay_payment_id = String(body.razorpay_payment_id || "");
    const razorpay_signature = String(body.razorpay_signature || "");
    const cartItems: Array<{ id: string; title: string; price: number; quantity: number }> =
      body.cartItems || [];
    const amount = Number(body.amount) || 0;
    const form = body.form || {};
    const txnid = String(body.txnid || razorpay_order_id);

    const keySecret = (process.env.RAZORPAY_KEY_SECRET || "").trim();
    if (!keySecret) {
      console.error("[Razorpay verify] Missing RAZORPAY_KEY_SECRET");
      return NextResponse.json({ success: false, error: "Server configuration error" }, { status: 500 });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ success: false, error: "Missing payment fields" }, { status: 400 });
    }

    // Razorpay signature formula: HMAC_SHA256(order_id + "|" + payment_id, key_secret)
    const expectedSignature = await hmacSha256Hex(
      keySecret,
      `${razorpay_order_id}|${razorpay_payment_id}`,
    );

    if (expectedSignature !== razorpay_signature) {
      console.error("[Razorpay verify] Signature mismatch — possible forged callback", {
        razorpay_order_id,
        razorpay_payment_id,
      });
      return NextResponse.json({ success: false, error: "Signature verification failed" }, { status: 400 });
    }

    // Deduplication check
    if (processedTxns.has(razorpay_payment_id)) {
      console.warn(`[Razorpay verify] Duplicate callback for payment=${razorpay_payment_id} — skipping`);
      return NextResponse.json({ success: true, txnid, paymentId: razorpay_payment_id });
    }
    processedTxns.add(razorpay_payment_id);

    // Create Shopify order
    try {
      await createShopifyOrder(
        cartItems,
        {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          address1: form.address1,
          city: form.city,
          province: form.province,
          zip: form.zip,
          country: "India",
        },
        razorpay_payment_id,
        amount,
      );
      console.log(`[Razorpay verify] Shopify order created for payment=${razorpay_payment_id}`);

      await sendPurchaseToMeta({
        eventId: txnid,
        amount,
        email: form.email,
        phone: form.phone,
        cartItems,
      });
    } catch (err) {
      console.error("[Razorpay verify] Shopify order creation failed:", err);
      // Payment succeeded but Shopify order failed — still report success to user,
      // but this should be monitored/alerted on since the order needs manual creation.
    }

    return NextResponse.json({ success: true, txnid, paymentId: razorpay_payment_id });
  } catch (err) {
    console.error("[Razorpay verify] Verification failed:", err);
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 });
  }
}