/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'], // Cho phép tải ảnh từ localhost
  },
}

module.exports = nextConfig
