/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
};

module.exports = {
  ...nextConfig,
  webpack: (config) => {
    config.externals = [
      ...config.externals,
      {
        bufferutil: "bufferutil",
        "utf-8-validate": "utf-8-validate",
      },
    ];

    return config;
  },
};
