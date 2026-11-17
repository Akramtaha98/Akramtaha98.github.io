/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Fully static build into ./out for GitHub Pages.
  output: 'export',
  // GitHub Pages has no image-optimization server.
  images: { unoptimized: true },
  // /about → /about/index.html, which GitHub Pages serves natively.
  trailingSlash: true,
};

export default nextConfig;
