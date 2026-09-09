/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';

const payuDomains = "https://test.payu.in https://secure.payu.in https://*.payu.in";
const metaDomains = "https://connect.facebook.net";
const metaConnect = "https://www.facebook.com https://connect.facebook.net";
const metaImg = "https://www.facebook.com";

const devCSP = `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' ${payuDomains} ${metaDomains}; connect-src 'self' https://*.myshopify.com ${payuDomains} https://api.web3forms.com ${metaConnect}; img-src 'self' data: blob: https://cdn.shopify.com https://images.unsplash.com https://picsum.photos https://*.payu.in ${metaImg}; style-src 'self' 'unsafe-inline'; frame-src ${payuDomains};`;

const prodCSP = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' ${payuDomains} https://static.cloudflareinsights.com ${metaDomains};
  connect-src 'self' https://*.myshopify.com ${payuDomains} https://api.web3forms.com https://static.cloudflareinsights.com ${metaConnect};
  img-src 'self' data: blob: https://cdn.shopify.com https://images.unsplash.com https://picsum.photos https://*.payu.in ${metaImg};
  style-src 'self' 'unsafe-inline' ${payuDomains};
  frame-src ${payuDomains};
  font-src 'self' ${payuDomains};
`.replace(/\n/g, " ").trim();
const nextConfig = {
  images: {
    unoptimized: isDev,
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "api.web3forms.com" },
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