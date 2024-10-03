/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  exportPathMap: async function () {
    return {
      "/sitemap.xml": { page: "/sitemap.xml" },
    };
  },
};

export default nextConfig;
