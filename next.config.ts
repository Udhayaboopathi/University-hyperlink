import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // required for Docker multi-stage build
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
