/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/essentials/:path*",
        destination: "/essentials/:path*",
      },
    ];
  },
};

export default nextConfig;
