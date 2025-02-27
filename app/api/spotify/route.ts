import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

let tokenCache = {
  access_token: '',
  expires_at: 0
}

let playerCache = {
  data: null as any,
  timestamp: 0,
  lastProgress: 0,
  lastProgressTime: 0,
  lastTitle: '',
  lastArtist: ''
}

async function getAccessToken() {
  try {
    if (tokenCache.access_token && Date.now() < tokenCache.expires_at) {
      return tokenCache.access_token
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
    
    let refreshToken = process.env.SPOTIFY_REFRESH_TOKEN
    
    if (!clientId || !clientSecret || !refreshToken) {
      throw new Error('Missing Spotify credentials or refresh token')
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${JSON.stringify(data)}`)
    }
    
    tokenCache = {
      access_token: data.access_token,
      expires_at: Date.now() + (data.expires_in * 1000) - 60000
    }
    
    return data.access_token
  } catch (error) {
    throw error
  }
}

export async function GET() {
  try {
    const accessToken = await getAccessToken()

    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      },
      cache: 'no-store'
    })

    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After') || '5'
      return new NextResponse(
        JSON.stringify({ isPlaying: false }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        }
      )
    }

    if (response.status === 204) {
      return new NextResponse(
        JSON.stringify({ 
          isPlaying: false,
          _timestamp: Date.now()
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        }
      )
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch currently playing track: ${response.status}`)
    }

    const data = await response.json()

    const now = Date.now()
    return new NextResponse(
      JSON.stringify({
        isPlaying: data.is_playing,
        title: data.item?.name,
        artist: data.item?.artists?.map((artist: any) => artist.name).join(', '),
        albumImageUrl: data.item?.album?.images?.[0]?.url,
        songUrl: data.item?.external_urls?.spotify,
        progress: data.progress_ms,
        duration: data.item?.duration_ms,
        _timestamp: now
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      }
    )
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ 
        error: 'Failed to fetch Spotify data',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      }
    )
  }
} 