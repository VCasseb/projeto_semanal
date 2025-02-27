/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Gera um build estático
  images: {
    unoptimized: true, // Evita otimização de imagens (Azure SWA não suporta Next.js Image Optimization)
  },
};

module.exports = nextConfig;