/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  images: {
    unoptimized: isDev,
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
  async headers() {
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
              ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https://*.myshopify.com; img-src 'self' data: blob: https://cdn.shopify.com https://images.unsplash.com https://picsum.photos; style-src 'self' 'unsafe-inline';"
              : "default-src 'self'; script-src 'self' 'unsafe-inline' https://checkout.razorpay.com; connect-src 'self' https://*.myshopify.com https://api.razorpay.com; img-src 'self' data: blob: https://cdn.shopify.com https://images.unsplash.com https://picsum.photos; style-src 'self' 'unsafe-inline'; frame-src https://api.razorpay.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;