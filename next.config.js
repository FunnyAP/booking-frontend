/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Cấu hình domains cho phép tải ảnh
  images: {
    domains: [
      'localhost',
      'aecgv.free.nf', 
      'pembbs.com',
      'example.com'
    ],
  },

  // Cấu hình rewrite để tránh lỗi CORS
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://aecgv.free.nf/api/:path*',
      },
    ];
  },

  // Cấu hình headers bảo mật
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
