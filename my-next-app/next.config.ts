import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // @ts-ignore: Next.js experimental config with allowedDevOrigins not recognized in current types
  experimental: {
    allowedDevOrigins: ["http://192.168.56.1"],
  },
};

export default nextConfig;
