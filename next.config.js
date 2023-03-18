/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: ".",
  images: {
    unoptimized: true
  },
  reactStrictMode: true,
  webpack: (config) => {
    config.experiments = {
      asyncWebAssembly: true,
    }
    return config;
  }
}

module.exports = nextConfig
