import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const SPOTIFY_CONFIG_PATH = path.join(process.cwd(), 'config', 'spotify.json')

export async function GET() {
  try {
    const config = JSON.parse(fs.readFileSync(SPOTIFY_CONFIG_PATH, 'utf8'))

    if (!config.refresh_token) {
      return NextResponse.json({ error: 'No refresh token found' }, { status: 400 })
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${config.client_id}:${config.client_secret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: config.refresh_token
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error('Failed to refresh token')
    }

    // Yeni refresh token geldiyse güncelle
    if (data.refresh_token) {
      config.refresh_token = data.refresh_token
      fs.writeFileSync(SPOTIFY_CONFIG_PATH, JSON.stringify(config, null, 2))
    }

    return NextResponse.json({
      access_token: data.access_token,
      expires_in: data.expires_in
    })
  } catch (error) {
    console.error('Spotify Token Error:', error)
    return NextResponse.json({ error: 'Token refresh failed' }, { status: 500 })
  }
} 