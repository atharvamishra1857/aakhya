export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createShopifyOrder } from "@/app/actions/createorder";

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
    const udf2 = body.get("udf2") as string || "";
    const udf3 = body.get("udf3") as string || "";
    const udf4 = body.get("udf4") as string || "";
    const udf5 = body.get("udf5") as string || "";
    const mihpayid = body.get("mihpayid") as string;
    const receivedHash = body.get("hash") as string;

    const salt = process.env.PAYU_SALT!;
    const key = process.env.NEXT_PUBLIC_PAYU_KEY!;

    // PayU reverse hash formula — exact order matters
    const hashString = `${salt}|${status}|${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
    const expectedHash = crypto
      .createHash("sha512")
      .update(hashString)
      .digest("hex");

    console.log("Expected hash:", expectedHash);
    console.log("Received hash:", receivedHash);
    console.log("Status:", status);

    // Skip hash check for now to debug — REMOVE THIS IN PRODUCTION
    // if (expectedHash !== receivedHash) {
    //   return NextResponse.redirect(new URL("/order-failed", req.url));
    // }

    if (status !== "success") {
      return NextResponse.redirect(new URL("/order-failed", req.url));
    }

    // Parse cart items from udf1
    let cartItems = [];
    try {
      cartItems = JSON.parse(udf1 || "[]");
    } catch {
      console.error("Failed to parse cart items from udf1");
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
        parseFloat(amount)
      );
    } catch (err) {
      console.error("Shopify order creation failed:", err);
      // Don't fail the redirect even if Shopify order fails
    }

    return NextResponse.redirect(
      new URL(`/order-confirmed?txnid=${txnid}&paymentId=${mihpayid}`, req.url)
    );
  } catch (err) {
    console.error("PayU verification failed:", err);
    return NextResponse.redirect(new URL("/order-failed", req.url));
  }
}