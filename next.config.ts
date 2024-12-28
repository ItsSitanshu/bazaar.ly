import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blonmglhfntabwhwswez.supabase.co',
        pathname: '/storage/v1/object/public/logos/**',
      },
      {
        protocol: 'https',
        hostname: 'blonmglhfntabwhwswez.supabase.co',
        pathname: '/storage/v1/object/public/products/**',
      },
    ],
  }
};

export default nextConfig;
