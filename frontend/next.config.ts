import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  images: {
    remotePatterns: [
      // Strapi (legacy local uploads)
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "cms",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: process.env.STRAPI_MEDIA_HOSTNAME ?? "localhost",
        pathname: "/uploads/**",
      },
      // MinIO (direct — dev only)
      {
        protocol: "http",
        hostname: "localhost",
        port: "9002",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "minio",
        port: "9000",
        pathname: "/**",
      },
      // Imgproxy (internal docker + local dev)
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "imgproxy",
        port: "8080",
        pathname: "/**",
      },
      // Imgproxy (production)
      ...(process.env.IMGPROXY_HOSTNAME
        ? [
            {
              protocol: "https" as const,
              hostname: process.env.IMGPROXY_HOSTNAME,
              pathname: "/**",
            },
          ]
        : []),
    ],
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: securityHeaders,
    },
  ],
};

export default nextConfig;
