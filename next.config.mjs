/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';
const nextConfig = {
  output: 'export',
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