/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'i.scdn.co', // Spotify album art
      'cdn.discordapp.com', // Discord avatars and banners
      'media.discordapp.net', // Discord media
      'cdn.discordapp.com/app-assets', // Discord application assets
      'cdn.discordapp.com/avatars', // Discord avatars
      'cdn.discordapp.com/banners', // Discord banners
      'cdn.discordapp.com/badge-icons', // Discord badges
    ],
  },
  // Ana sayfanın statik oluşturulmasını devre dışı bırak
  // window bağımlılıkları nedeniyle
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig 