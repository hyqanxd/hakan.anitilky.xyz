import { NextResponse } from 'next/server'

// Bu rotanın dinamik olduğunu belirterek statik oluşturma hatasını düzeltiyoruz
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      console.error('Spotify Callback: Code parametre eksik')
      return NextResponse.json({ error: 'No code provided' }, { status: 400 })
    }

    // Çevresel değişkenlerden Spotify bilgilerini al
    const clientId = process.env.SPOTIFY_CLIENT_ID
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI || 'https://hakan.anitilky.xyz/api/spotify/callback'

    if (!clientId || !clientSecret) {
      console.error('Spotify Callback: Client ID veya Client Secret eksik')
      return NextResponse.json({ 
        error: 'Missing Spotify credentials', 
        clientIdExists: !!clientId,
        clientSecretExists: !!clientSecret
      }, { status: 500 })
    }

    try {
      // Token'ı al
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Spotify token error:', JSON.stringify(errorData))
        return NextResponse.json({ 
          error: 'Failed to get token', 
          details: errorData,
          status: response.status 
        }, { status: response.status })
      }

      const data = await response.json()
      console.log('Spotify token received successfully')

      // Refresh token'ı dosya sistemine yazmak yerine ana sayfaya query parametre olarak gönder
      // Ana sayfaya yönlendir
      const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : process.env.NEXT_PUBLIC_BASE_URL 
          ? process.env.NEXT_PUBLIC_BASE_URL
          : 'https://hakan.anitilky.xyz';
      
      const homeUrl = new URL('/', baseUrl)
      
      // Token'ı URL'ye ekle - bu daha sonra ana sayfada işlenecek
      if (data.refresh_token) {
        homeUrl.searchParams.set('spotify_token', data.refresh_token)
      }
      
      console.log('Redirecting to:', homeUrl.toString())
      return NextResponse.redirect(homeUrl)
    } catch (tokenError: any) {
      console.error('Token fetching error:', tokenError.message)
      return NextResponse.json({ 
        error: 'Token fetching failed', 
        details: tokenError.message 
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('Spotify Callback Error:', error.message)
    return NextResponse.json({ 
      error: 'Authentication failed',
      details: error.message
    }, { status: 500 })
  }
} 