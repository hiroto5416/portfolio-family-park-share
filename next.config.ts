import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['dwxmlrbidwnplhjivfxd.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dwxmlrbidwnplhjivfxd.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
