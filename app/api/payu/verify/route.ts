export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createShopifyOrder } from "@/app/actions/createorder";

// In-memory dedup guard for the lifetime of this serverless instance.
// Prevents double-processing if Vercel retries the callback due to a timeout.
// For multi-instance production deployments, replace this with a Redis SET NX check.
const processedTxns = new Set<string>();

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
    const receivedHash = body.get("hash") as string;

    // FIX: trim() on both — keeps this consistent with hash route
    // A whitespace mismatch between the two routes causes every hash verification to fail
    const salt = (process.env.PAYU_SALT || "").trim();
    const key = (process.env.NEXT_PUBLIC_PAYU_KEY || "").trim();

    if (!salt || !key) {
      console.error("[PayU verify] Missing PAYU_SALT or NEXT_PUBLIC_PAYU_KEY");
      return NextResponse.redirect(new URL("/order-failed", req.url));
    }

    console.log(`[PayU verify] Callback received: txnid=${txnid} status=${status} at ${new Date().toISOString()}`);

    // PayU reverse hash formula — exact field order is mandatory
    const hashString = `${salt}|${status}|${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
    const expectedHash = crypto
      .createHash("sha512")
      .update(hashString)
      .digest("hex");

    // SECURITY: mandatory — without this check anyone can POST status=success
    // to this endpoint and trigger a real Shopify order with no real payment
    if (expectedHash !== receivedHash) {
      console.error("[PayU verify] Hash mismatch — possible forged callback", {
        txnid,
        status,
      });
      return NextResponse.redirect(new URL("/order-failed", req.url));
    }

    if (status !== "success") {
      console.warn(`[PayU verify] Payment not successful: txnid=${txnid} status=${status}`);
      return NextResponse.redirect(new URL("/order-failed", req.url));
    }

    // FIX: Idempotency guard — if Vercel retries due to a timeout, don't
    // create a duplicate Shopify order for the same transaction
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
    } catch (err) {
      console.error("[PayU verify] Shopify order creation failed:", err);
      // Still redirect to confirmed — payment succeeded even if Shopify order failed.
      // You can handle Shopify failures separately (webhook retry, admin alert, etc.)
    }

    return NextResponse.redirect(
      new URL(`/order-confirmed?txnid=${txnid}&paymentId=${mihpayid}`, req.url),
    );
  } catch (err) {
    console.error("[PayU verify] Verification failed:", err);
    return NextResponse.redirect(new URL("/order-failed", req.url));
  }
}