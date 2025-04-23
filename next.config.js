/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    // Only apply the rewrite rule in development
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          // Target the Flask dev server when running locally
          destination: 'http://127.0.0.1:5328/api/:path*',
        },
      ];
    }
    // In production, return an empty array or omit the rewrites entirely.
    // Vercel's vercel.json rewrites will handle production routing.
    return [];
  },
};

module.exports = nextConfig;