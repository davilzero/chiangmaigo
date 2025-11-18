/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
    unoptimized: false, // ใช้ optimization แต่ถ้า external images มีปัญหาให้ใช้ unoptimized ใน component
  },
}

module.exports = nextConfig

