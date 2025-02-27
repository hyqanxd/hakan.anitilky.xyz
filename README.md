# Kişisel Portföy Uygulaması

Bu proje, Next.js kullanılarak geliştirilmiş bir kişisel portföy web uygulamasıdır. Discord ve Spotify API entegrasyonları ile kullanıcının gerçek zamanlı aktivitelerini gösterir.

## Özellikler

- Responsive tasarım
- Spotify şu anda çalan müzik bilgisi entegrasyonu
- Discord aktivite durumu entegrasyonu
- Projeler bölümü
- Framer Motion ile animasyonlar

## Kurulum

### Gereksinimler

- Node.js 18.0 veya daha yüksek
- npm veya yarn

### Adımlar

1. Repoyu klonlayın:
```bash
git clone https://github.com/hyqanxd/hakan.anitilky.xyz.git
cd hakan.anitilky.xyz
```

2. Bağımlılıkları yükleyin:
```bash
npm install
# veya
yarn install
```

3. `.env.local` dosyası oluşturun ve gerekli API anahtarlarını ekleyin:
```
# Spotify API
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REFRESH_TOKEN=your_spotify_refresh_token
SPOTIFY_REDIRECT_URI=https://your-domain.com/api/spotify/callback
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# Discord API
DISCORD_ID=your_discord_id
DISCORD_BOT_TOKEN=your_discord_bot_token
DISCORD_GUILD_ID=your_discord_guild_id
```

4. Geliştirme sunucusunu başlatın:
```bash
npm run dev
# veya
yarn dev
```

5. Tarayıcınızda `http://localhost:3000` adresini açın.

## Spotify API Entegrasyonu Kurulumu

1. [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) üzerinden bir uygulama oluşturun
2. Uygulamanızın ayarlarından "Redirect URIs" bölümüne şunları ekleyin:
   - `https://your-domain.com/api/spotify/callback` (production)
   - `http://localhost:3000/api/spotify/callback` (geliştirme)

3. Geliştirme ortamında test ederken, `.env.local` dosyasında şunları kullanın:
```
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/spotify/callback
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Discord API Entegrasyonu

1. [Discord Developer Portal](https://discord.com/developers/applications) üzerinden bir uygulama oluşturun
2. Bot oluşturun ve token'ı `.env.local` dosyasına ekleyin
3. Kullanıcı ID'nizi ve sunucu ID'nizi `.env.local` dosyasında belirtin

## Canlı Ortama Dağıtım

Vercel kullanarak dağıtmak için:

1. GitHub reposunu Vercel'e bağlayın
2. Environment Variables bölümünde `.env.local` dosyasındaki tüm değişkenleri ekleyin
3. Dağıtımı gerçekleştirin

## Teknolojiler

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [SWR](https://swr.vercel.app/)
- [Spotify API](https://developer.spotify.com/documentation/web-api/)
- [Discord API](https://discord.com/developers/docs/intro)

## Lisans

MIT