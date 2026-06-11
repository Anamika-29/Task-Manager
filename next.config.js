/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"],
  },
  // Ensure API routes are never statically generated
  output: undefined,
}
module.exports = nextConfig
