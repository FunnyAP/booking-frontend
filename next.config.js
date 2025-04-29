/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'anhemphim.free.nf',
        pathname: '/uploads/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://anhemphim.free.nf/api/:path*", // Proxy Laravel backend thực tế
      },
    ];
  },
};

export default nextConfig;
