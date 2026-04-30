import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.vreyaofficial.com"; // 🚨 Replace with actual Vreya domain

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Disallow Google from indexing your Cloudflare-generated URLs or private routes
      disallow: ["/_next/", "/api/"], 
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}