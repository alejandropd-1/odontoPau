import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allow access to remote image placeholder.
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**', // This allows any path under the hostname
      },
    ],
  },
  transpilePackages: ['motion'],
  async redirects() {
    return [
      {
        source: '/tratamientos/implantes',
        destination: '/tratamientos/rehabilitacion',
        permanent: true,
      },
      {
        source: '/tratamientos/implantes/casos/:casoId',
        destination: '/tratamientos/rehabilitacion/casos/:casoId',
        permanent: true,
      },
      {
        source: '/articulos/tratamiento/implantes/:path*',
        destination: '/articulos/tratamiento/rehabilitacion/:path*',
        permanent: true,
      },
    ];
  },
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
