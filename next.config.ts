import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

// Resolve from config directory so Tailwind is found in this project's node_modules (fixes "resolve in parent" on dev)
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  async redirects() {
    return [
      { source: '/services/maintenance', destination: '/services?service=maintenance', permanent: true },
      { source: '/services/reconditionnement', destination: '/services?service=reconditionnement', permanent: true },
      { source: '/services/location', destination: '/services?service=location', permanent: true },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'public.blob.vercel-storage.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
        pathname: '/**',
      },
    ],
    unoptimized: false,
  },
};

export default nextConfig;
