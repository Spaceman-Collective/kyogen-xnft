/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true
  },
  reactStrictMode: true,
  webpack: (config) => {
    config.experiments = {
      asyncWebAssembly: true,
    }
    config.module.rules.push({
        test: /\.mp3$/,
        type: "asset/resource",
    })
    return config;
  }
}

module.exports = nextConfig
