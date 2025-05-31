import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // experimental: {
  // serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"]
  // ]
images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
      },
    ],
  },
};

export default nextConfig;
