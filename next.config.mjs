/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lets a phone on the same Wi-Fi load the dev server (hot reload, assets). Update if your IP changes.
  allowedDevOrigins: ["192.168.0.103"],
  images: {
    formats: ["image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
}

export default nextConfig
