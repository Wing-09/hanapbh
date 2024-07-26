/** @type {import('next').NextConfig} */

const places_api = process.env.GOOGLE_PLACES_API_KEY;
if (!places_api)
  throw new Error("GOOGLE_PLACES_API_KEY is missing on your .env.local file");

const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "maps.googleapis.com",
        port: "",
        pathname: "/maps/api/place/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/nearby",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
