import { NextResponse } from 'next/server'

// Bu rotanın dinamik olduğunu belirterek statik oluşturma hatasını düzeltiyoruz
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Çevresel değişkenlerden Spotify bilgilerini al
    const clientId = process.env.SPOTIFY_CLIENT_ID
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI || 'https://hakan.anitilky.xyz/api/spotify/callback'

    if (!clientId) {
      console.error('Spotify Auth: CLIENT_ID eksik')
      return NextResponse.json({ error: 'Missing Spotify client ID' }, { status: 500 })
    }

    // Spotify yetkilendirme URL'sini oluştur
    const scope = 'user-read-currently-playing user-read-playback-state'
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&show_dialog=true`
    
    console.log('Spotify Auth Url:', authUrl)
    
    // Kullanıcıyı Spotify yetkilendirme sayfasına yönlendir
    return NextResponse.redirect(authUrl)
  } catch (error: any) {
    console.error('Spotify Auth Error:', error.message)
    return NextResponse.json({ error: 'Authorization failed', details: error.message }, { status: 500 })
  }
} 