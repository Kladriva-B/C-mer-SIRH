import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker/self-host uses standalone. Vercel provides its own output.
  ...(process.env.VERCEL ? {} : { output: "standalone" as const }),
  serverExternalPackages: ["pg", "@prisma/client", "@prisma/adapter-pg"],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
