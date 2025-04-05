import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};
module.exports = {
  experimental: {
    turbo: false, // Disable Turbopack
  },
};

export default nextConfig;
