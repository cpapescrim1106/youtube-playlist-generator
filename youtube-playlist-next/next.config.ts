import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  
  images: {
    domains: ["i.ytimg.com", "img.youtube.com"],
  },
};

export default nextConfig;
