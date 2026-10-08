/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lets a phone on the same Wi-Fi load the dev server (hot reload, assets). Update if your IP changes.
  allowedDevOrigins: ["172.23.2.121", "192.168.0.103", "*.local"],
  images: {
    formats: ["image/webp"],
    // Test-only switch: lets the optimizer fetch images from a local fake Supabase. Never set in production.
    ...(process.env.ALLOW_LOCAL_IMAGES === "1" ? { dangerouslyAllowLocalIP: true } : {}),
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
      ...(process.env.ALLOW_LOCAL_IMAGES === "1" ? [{ protocol: "http", hostname: "localhost", port: "54321" }] : []),
    ],
  },
}

export default nextConfig
