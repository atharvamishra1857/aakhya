// export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { createShopifyOrder } from "@/app/actions/createorder";

// In-memory dedup guard for the lifetime of this isolate instance.
// For multi-instance Edge production deployments, consider a KV / Redis SET NX check.
const processedTxns = new Set<string>();

const META_PIXEL_ID = "1733404514535351";

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ── META PIXEL: Purchase (server-side, via Conversions API) ──
// This is the reliable half of Purchase tracking — it fires from the
// server, right after the order is confirmed and created in Shopify, so
// it isn't lost to ad blockers, iOS privacy restrictions, or a closed tab.
// `eventId` (the txnid) is also used by the client-side pixel fire on
// /order-confirmed, so Meta deduplicates the two into a single event.
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
    const body = await req.formData();

    const status = body.get("status") as string;
    const txnid = body.get("txnid") as string;
    const amount = body.get("amount") as string;
    const productinfo = body.get("productinfo") as string;
    const firstname = body.get("firstname") as string;
    const lastname = body.get("lastname") as string;
    const email = body.get("email") as string;
    const phone = body.get("phone") as string;
    const address1 = body.get("address1") as string;
    const city = body.get("city") as string;
    const state = body.get("state") as string;
    const zipcode = body.get("zipcode") as string;
    const udf1 = body.get("udf1") as string;
    const udf2 = (body.get("udf2") as string) || "";
    const udf3 = (body.get("udf3") as string) || "";
    const udf4 = (body.get("udf4") as string) || "";
    const udf5 = (body.get("udf5") as string) || "";
    const mihpayid = body.get("mihpayid") as string;
    const receivedHash = (body.get("hash") as string) || "";

    const salt = (process.env.PAYU_SALT || "").trim();
    const key = (process.env.NEXT_PUBLIC_PAYU_KEY || "").trim();

    if (!salt || !key) {
      console.error("[PayU verify] Missing PAYU_SALT or NEXT_PUBLIC_PAYU_KEY");
      return NextResponse.redirect(new URL("/order-failed", req.url));
    }

    console.log(`[PayU verify] Callback received: txnid=${txnid} status=${status} at ${new Date().toISOString()}`);

    // PayU reverse hash formula: salt|status|udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
    const hashString = `${salt}|${status}|${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;

    // Cloudflare Edge compatible Web Crypto SHA-512
    const encoder = new TextEncoder();
    const data = encoder.encode(hashString);
    const hashBuffer = await crypto.subtle.digest("SHA-512", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const expectedHash = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Case-insensitive comparison for hash validation
    if (expectedHash.toLowerCase() !== receivedHash.toLowerCase()) {
      console.error("[PayU verify] Hash mismatch — possible forged callback", {
        txnid,
        status,
        expectedHash,
        receivedHash,
      });
      // TEMP DEBUG - remove after fix
      const debugUrl = new URL("/order-failed", req.url);
      debugUrl.searchParams.set("dbg_status", status || "");
      debugUrl.searchParams.set("dbg_saltLen", String(salt.length));
      debugUrl.searchParams.set("dbg_keyLen", String(key.length));
      debugUrl.searchParams.set("dbg_expected6", expectedHash.substring(0, 6));
      debugUrl.searchParams.set("dbg_received6", receivedHash.substring(0, 6));
      debugUrl.searchParams.set("dbg_udf1len", String((udf1 || "").length));
      return NextResponse.redirect(debugUrl);
    }

    if (status !== "success") {
      console.warn(`[PayU verify] Payment not successful: txnid=${txnid} status=${status}`);
      return NextResponse.redirect(new URL("/order-failed", req.url));
    }

    // Deduplication check
    if (processedTxns.has(txnid)) {
      console.warn(`[PayU verify] Duplicate callback for txnid=${txnid} — skipping Shopify order`);
      return NextResponse.redirect(
        new URL(`/order-confirmed?txnid=${txnid}&paymentId=${mihpayid}`, req.url),
      );
    }
    processedTxns.add(txnid);

    // Parse cart items from udf1
    let cartItems: Array<{ id: string; title: string; price: number; quantity: number }> = [];
    try {
      cartItems = JSON.parse(udf1 || "[]");
    } catch {
      console.error("[PayU verify] Failed to parse cart items from udf1");
    }

    // Create Shopify order
    try {
      await createShopifyOrder(
        cartItems,
        {
          firstName: firstname,
          lastName: lastname,
          email,
          phone,
          address1,
          city,
          province: state,
          zip: zipcode,
          country: "India",
        },
        mihpayid,
        parseFloat(amount),
      );
      console.log(`[PayU verify] Shopify order created for txnid=${txnid}`);

      // Fire the server-side half of the Purchase event now that the
      // order is confirmed. Uses txnid as the eventID for dedup against
      // the client-side pixel fire on /order-confirmed.
      await sendPurchaseToMeta({
        eventId: txnid,
        amount: parseFloat(amount),
        email,
        phone,
        cartItems,
      });
    } catch (err) {
      console.error("[PayU verify] Shopify order creation failed:", err);
    }

    return NextResponse.redirect(
      new URL(`/order-confirmed?txnid=${txnid}&paymentId=${mihpayid}`, req.url),
    );
  } catch (err) {
    console.error("[PayU verify] Verification failed:", err);
    return NextResponse.redirect(new URL("/order-failed", req.url));
  }
}