/** @type {import('next').NextConfig} */
const nextConfig = {
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
