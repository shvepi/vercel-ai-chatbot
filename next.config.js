/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  // Remove the entire experimental object that contains serverActions
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com',
      },
    ],
  },
};