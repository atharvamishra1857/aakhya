import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.aakhyaofficial.com"; // 🚨 Replace with actual aakhya domain

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
