/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects() {
    return [
      {
        source: "/propiedades",
        destination: "/propiedades/1",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
