/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Ensure trailing slashes are handled correctly
  trailingSlash: false,
  // Ensure proper handling of images
  images: {
    domains: ['placeholder.com'],
    unoptimized: true,
  },
  // We'll handle redirects in the page component instead
  // to avoid conflicts with middleware
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
