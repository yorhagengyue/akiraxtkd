/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Disabled for next-on-pages compatibility
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig
