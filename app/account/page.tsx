// app/account/page.tsx
import { getShopifyAccountUrl } from "@/lib/shopify";
import { redirect } from "next/navigation";

export default function AccountPage() {
  // Since we are using Shopify's New Customer Accounts (passwordless OTP),
  // we don't render a UI here. We instantly bounce the user to Shopify's secure portal.
  
  // TODO: Later we will check for an active session cookie here. 
  // If they are logged in, we will redirect them to getShopifyAccountUrl('orders').
  
  redirect(getShopifyAccountUrl('login'));

  return null; 
}