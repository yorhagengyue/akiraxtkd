/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static export for Cloudflare Pages
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Disable features that don't work with static export
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig
