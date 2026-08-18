/** @type {import('next').NextConfig} */
const { execSync } = require('node:child_process');

let buildVersion = process.env.NEXT_PUBLIC_BUILD_VERSION || process.env.CF_PAGES_COMMIT_SHA || '';
if (!buildVersion) {
  try {
    buildVersion = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  } catch {
    buildVersion = 'dev';
  }
}

const nextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_VERSION: buildVersion,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
  },
};
module.exports = nextConfig;
