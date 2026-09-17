import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Сжимает nginx, а не Node — иначе brotli достаётся только статике с диска. */
  compress: false,
  experimental: {
    /**
     * Стили едут прямо в HTML: для лендинга, куда в основном заходят впервые,
     * размен «HTML тяжелее / нет блокирующего запроса за CSS» выгодный.
     */
    inlineCss: true,
  },
  images: {
    remotePatterns: [{ hostname: "localhost" }],
    /** Без allowlist Next молча роняет `quality={90}` из компонентов до дефолтных 75. */
    qualities: [70, 75, 80, 90],
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
