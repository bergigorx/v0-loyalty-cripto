/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações básicas
  reactStrictMode: false,
  swcMinify: true,
  
  // Ignorar erros durante o build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configuração de imagens
  images: {
    domains: ['placeholder.svg', 'v0.blob.vercel-storage.com'],
    unoptimized: true,
  },
  
  // Desativar o header X-Powered-By
  poweredByHeader: false,
  
  // Desativar a exportação estática
  // output: 'export', // Remover esta linha
  
  // Configurações experimentais
  experimental: {
    // Desativar a pré-renderização
    disablePrerender: true,
    // Desativar a otimização de CSS
    optimizeCss: false,
  },
}

export default nextConfig
