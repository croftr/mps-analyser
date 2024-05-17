/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'members-api.parliament.uk',
            port: '',
            pathname: '/**',
          },
        ],
      },    
};

export default nextConfig;
