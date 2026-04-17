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
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
  },
};
export default nextConfig;
