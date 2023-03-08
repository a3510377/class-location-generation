const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

module.exports = (phase) => {
  const isDev = phase == PHASE_DEVELOPMENT_SERVER;

  /** @type {import('next').NextConfig} */
  const nextConfig = {
    env: {
      API_BASE_URL: isDev ? 'http://localhost:8000' : process.env.API_BASE_URL,
    },
    trailingSlash: true,
    reactStrictMode: true,
  };

  return nextConfig;
};
