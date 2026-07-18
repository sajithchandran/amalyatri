/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.amalyatri.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'test.amaltamara.com' },
    ],
  },
  experimental: {
    typedRoutes: false,
  },
};

module.exports = nextConfig;
