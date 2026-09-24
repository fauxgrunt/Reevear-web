import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 95],
  },
  async redirects() {
    return [
      { source: "/about", destination: "/pages/our-story", permanent: false },
      { source: "/contact", destination: "/pages/contact", permanent: false },
      { source: "/privacy", destination: "/pages/privacy", permanent: false },
      { source: "/terms", destination: "/pages/terms", permanent: false },
      { source: "/delivery", destination: "/pages/shipping", permanent: false },
      { source: "/returns", destination: "/pages/returns", permanent: false },
      { source: "/size-guide", destination: "/pages/size-guide", permanent: false },
      { source: "/bestsellers", destination: "/collections/all", permanent: false },
      { source: "/faq", destination: "/pages/contact", permanent: false },
      { source: "/account", destination: "/pages/account", permanent: false },
      {
        source: "/collections/signature-pieces",
        destination: "/pages/signature-pieces",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
