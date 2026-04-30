import { MetadataRoute } from "next";
import { getProductsInCollection } from "@/lib/shopify"; // Using your existing Shopify fetcher

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.vreyaofficial.com"; // 🚨 Replace with actual Vreya domain

  // 1. Define your core static pages
  const staticRoutes = ["", "/support"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1.0, // Homepage gets highest priority
  }));

  try {
    // 2. Fetch your live products (grabbing up to 100 to be safe)
    const products = await getProductsInCollection(100); 

    // 3. Map the Shopify products to your Next.js URLs
    const productRoutes = products.map((product) => ({
      url: `${baseUrl}/product/${product.node.handle}`,
      lastModified: new Date(product.node.updatedAt || new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    // Combine static pages and product pages into one map
    return [...staticRoutes, ...productRoutes];
  } catch (error) {
    console.error("Failed to fetch products for sitemap:", error);
    // Fallback: Just return the static routes if Shopify fails
    return staticRoutes; 
  }
}