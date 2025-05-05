/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Desativando para evitar renderizações duplas
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['placeholder.svg', 'v0.blob.vercel-storage.com'],
    unoptimized: true, // Desativando otimização de imagens
  },
  // Configurações críticas para resolver o problema
  output: 'export', // Mudando para export estático
  distDir: 'out', // Diretório de saída personalizado
  trailingSlash: true, // Adicionar barra no final das URLs
  skipTrailingSlashRedirect: true, // Pular redirecionamento de barra no final
  poweredByHeader: false,
  // Desativando headers personalizados para simplificar
  headers: async () => {
    return []
  },
}

export default nextConfig
