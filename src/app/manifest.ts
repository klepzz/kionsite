import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Daily Spin - Mystery Challenge',
    short_name: 'Daily Spin',
    description: 'Your daily mystery task generator.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050505',
    theme_color: '#8B5CF6',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
