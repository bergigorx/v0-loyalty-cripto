/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["placeholder.svg", "v0.blob.vercel-storage.com"],
    unoptimized: true,
  },
  poweredByHeader: false,
  // Desabilitar a geração estática para evitar problemas com useSearchParams
  output: "standalone",
}

module.exports = nextConfig
