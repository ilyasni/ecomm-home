import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: process.env.STRAPI_MEDIA_HOSTNAME ?? "localhost",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
