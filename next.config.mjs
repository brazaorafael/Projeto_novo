/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['www.akc.org', 'cdn.britannica.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  // Adicionar esta configuração para garantir que os assets estáticos sejam servidos corretamente
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined,
  // Desativar a compressão de imagens para evitar problemas
  compress: true,
  // Configuração para permitir imagens de qualquer origem
  experimental: {
    images: {
      allowFutureImage: true,
    },
  },
};

export default nextConfig;
