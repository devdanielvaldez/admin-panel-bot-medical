/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
      crossOrigin: 'anonymous',
      images: {
        unoptimized: true, // Deshabilitar la optimización de imágenes
      },
};

export default withPWA({
  dest: "public",         // destination directory for the PWA files
  register: true,         // register the PWA service worker
  skipWaiting: true,      // skip waiting for service worker activation
})(nextConfig);