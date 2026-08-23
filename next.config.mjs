// temporarily commented
// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'cdn.shopify.com',
//         pathname: '**',
//       },
//     ],
//   },
// };

// export default nextConfig;

// temporary test
// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "**", // This wildcards allows ALL domains
//       },
//     ],
//   },
// };

// export default nextConfig;
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   // We removed the export and unoptimized image rules!
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'images.unsplash.com',
//       },
//     ],
//   },
// };

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // We removed the export and unoptimized image rules!
  images: {
    unoptimized: false,
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    return [
    {
      source: '/(.*)',
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        {
          key: "Content-Security-Policy",
          value: isDev
            ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https://*.myshopify.com; img-src 'self' data: https://cdn.shopify.com https://images.unsplash.com https://picsum.photos; style-src 'self' 'unsafe-inline';"
            : "default-src 'self'; script-src 'self' 'unsafe-inline' https://checkout.razorpay.com; connect-src 'self' https://*.myshopify.com https://api.razorpay.com; img-src 'self' data: https://cdn.shopify.com https://images.unsplash.com https://picsum.photos; style-src 'self' 'unsafe-inline'; frame-src https://api.razorpay.com;",
        },
      ],
    },
  ];
},
}

export default nextConfig;
