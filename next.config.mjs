/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';
const nextConfig = {
  distDir: process.env.NODE_ENV === "production" ? "../app" : "./.next",
  output:
    process.env.NEXT_PUBLIC_FOR_ELECTRON === "true" &&
    process.env.NODE_ENV === "production"
      ? "export"
      : "standalone",
  reactStrictMode: false,
  crossOrigin: 'anonymous',
  images: {
    unoptimized: true,
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
})(nextConfig);