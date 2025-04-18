// next.config.mjs
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sgkio84mub.ufs.sh',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
