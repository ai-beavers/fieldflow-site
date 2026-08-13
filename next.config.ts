import type { NextConfig } from "next";

const rawPrefix = process.env.SEOENGINE_BLOG_PATH_PREFIX || process.env.NEXT_PUBLIC_BLOG_PATH_PREFIX || "blog";
const blogPathPrefix = rawPrefix.trim() === "/" ? "" : rawPrefix.trim().replace(/^\/+|\/+$/g, "") || "blog";

const nextConfig: NextConfig = {
  async rewrites() {
    if (!blogPathPrefix || blogPathPrefix === "blog") return [];
    return [
      {
        source: `/${blogPathPrefix}`,
        destination: "/blog",
      },
      {
        source: `/${blogPathPrefix}/:path*`,
        destination: "/blog/:path*",
      },
    ];
  },
};

export default nextConfig;
