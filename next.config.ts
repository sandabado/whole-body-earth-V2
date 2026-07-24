import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/services",
        destination: "/pillars/studios/services",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
