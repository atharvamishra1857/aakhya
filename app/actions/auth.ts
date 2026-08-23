"use server";

import { cookies } from "next/headers";
import { createCustomer, loginCustomer } from "@/lib/shopify";

// 1. Handle Login
export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Email and password are required." };

  try {
    const response = await loginCustomer(email, password);
    const errors = response?.customerUserErrors;
    
    if (errors && errors.length > 0) {
      return { error: errors[0].message };
    }

    const token = response?.customerAccessToken?.accessToken;
    const expiresAt = response?.customerAccessToken?.expiresAt;

    if (token) {
      // Securely store the token in an HTTP-only cookie
      (await cookies()).set("customerAccessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: new Date(expiresAt),
        path: "/",
      });
      return { success: true };
    }

    return { error: "Invalid credentials." };
  } catch (e: any) {
    return { error: "An unexpected error occurred while logging in." };
  }
}

// 2. Handle Registration
export async function registerAction(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await createCustomer(firstName, lastName, email, password);
    const errors = response?.customerUserErrors;

    if (errors && errors.length > 0) {
      return { error: errors[0].message };
    }

    // If registration is successful, instantly log them in!
    return loginAction(formData);
  } catch (e: any) {
    return { error: "Failed to create account. Please try again." };
  }
}