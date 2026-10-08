import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/our-packages",
        destination: "/packages",
        permanent: true,
      },
      {
        source: "/our-packages/",
        destination: "/packages",
        permanent: true,
      },
      {
        source: "/agreement-policies",
        destination: "/agreement",
        permanent: true,
      },
      {
        source: "/agreement-policies/",
        destination: "/agreement",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
