"use server";

type LineItem = {
  id: string;
  variant_id?: string;
  quantity: number;
  title: string;
  price: number;
};

type CustomerInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  city: string;
  province: string;
  zip: string;
  country: string;
};

export async function createShopifyOrder(
  lineItems: LineItem[],
  customer: CustomerInfo,
  paymentId: string,
  totalAmount: number
) {
  const domain = process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  console.log("Creating Shopify order with domain:", domain);
  console.log("Line items:", JSON.stringify(lineItems));

  const orderPayload = {
    order: {
      line_items: lineItems.map((item) => {
        // Handle both id and variant_id, strip GID prefix if present
        const rawId = item.variant_id || item.id;
        const variant_id = rawId.replace("gid://shopify/ProductVariant/", "");
        return {
          variant_id,
          quantity: item.quantity,
          title: item.title,
          price: item.price.toString(),
        };
      }),
      customer: {
        first_name: customer.firstName,
        last_name: customer.lastName,
        email: customer.email,
        phone: customer.phone,
      },
      shipping_address: {
        first_name: customer.firstName,
        last_name: customer.lastName,
        address1: customer.address1,
        city: customer.city,
        province: customer.province,
        zip: customer.zip,
        country: customer.country,
        phone: customer.phone,
      },
      billing_address: {
        first_name: customer.firstName,
        last_name: customer.lastName,
        address1: customer.address1,
        city: customer.city,
        province: customer.province,
        zip: customer.zip,
        country: customer.country,
        phone: customer.phone,
      },
      financial_status: "paid",
      transactions: [
        {
          kind: "sale",
          status: "success",
          amount: totalAmount.toString(),
          gateway: "PayU",
          authorization: paymentId,
        },
      ],
      note: `PayU Payment ID: ${paymentId}`,
      tags: "payu, headless",
      send_receipt: true,
    },
  };

  console.log("Order payload:", JSON.stringify(orderPayload, null, 2));

  const res = await fetch(
    `https://${domain}/admin/api/2024-01/orders.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token!,
      },
      body: JSON.stringify(orderPayload),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    console.error("Shopify order creation failed:", JSON.stringify(data, null, 2));
    console.error("Status:", res.status);
    throw new Error(`Failed to create Shopify order: ${JSON.stringify(data.errors || data)}`);
  }

  console.log("Shopify order created:", data.order?.id);
  return data.order;
}