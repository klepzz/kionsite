import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Kion - JPG ve PNG PDF Dönüştürücü',
    short_name: 'Kion',
    description: 'JPG ve PNG görsellerini PDF dosyasına dönüştür.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8f9f5',
    theme_color: '#346b52',
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
