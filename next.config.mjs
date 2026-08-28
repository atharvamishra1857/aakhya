/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';

const payuDomains = "https://test.payu.in https://secure.payu.in https://*.payu.in";

const devCSP = `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' ${payuDomains}; connect-src 'self' https://*.myshopify.com ${payuDomains}; img-src 'self' data: blob: https://cdn.shopify.com https://images.unsplash.com https://picsum.photos https://*.payu.in; style-src 'self' 'unsafe-inline'; frame-src ${payuDomains};`;

const prodCSP = `default-src 'self'; script-src 'self' 'unsafe-inline' ${payuDomains}; connect-src 'self' https://*.myshopify.com ${payuDomains}; img-src 'self' data: blob: https://cdn.shopify.com https://images.unsplash.com https://picsum.photos https://*.payu.in; style-src 'self' 'unsafe-inline'; frame-src ${payuDomains};`;

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
            value: isDev ? devCSP : prodCSP,
          },
        ],
      },
    ];
  },
};

export default nextConfig;