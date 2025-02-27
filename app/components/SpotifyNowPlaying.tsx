'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FaSpotify, FaPlay, FaPause, FaMusic } from 'react-icons/fa'
import Image from 'next/image'
import useSWR from 'swr'

interface SpotifyData {
  isPlaying: boolean
  title: string
  artist: string
  albumImageUrl: string
  songUrl: string
  progress: number
  duration: number
  _timestamp?: number
  _songChanged?: boolean
}

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache'
    }
  })
  if (!res.ok) {
    // Yetkilendirme hatası varsa auth sayfasına yönlendir
    if (res.status === 401 || res.status === 403) {
      window.location.href = '/api/spotify/auth'
      return null
    }
    throw new Error('Failed to fetch Spotify data')
  }
  return res.json()
}

export default function SpotifyNowPlaying() {
  const { data, error, mutate } = useSWR('/api/spotify', fetcher, {
    refreshInterval: 500,
    revalidateOnFocus: true,
    dedupingInterval: 0,
    refreshWhenHidden: true,
    revalidateIfStale: true,
    onError: (err) => {
      // Sessizce başarısız ol
    }
  })

  // Her saniye force refresh yap
  useEffect(() => {
    const interval = setInterval(() => {
      mutate()
    }, 1000)
    return () => clearInterval(interval)
  }, [mutate])

  // Progress hesaplama
  const progress = useMemo(() => {
    if (!data?.isPlaying || !data?.progress || !data?.duration) return 0
    const timeSinceLastUpdate = Date.now() - (data._timestamp || Date.now())
    const currentProgress = Math.min(
      data.progress + timeSinceLastUpdate,
      data.duration
    )
    return (currentProgress / data.duration) * 100
  }, [data])

  // Yükleme durumu
  if (!data && !error) {
    return (
      <div className="relative overflow-hidden backdrop-blur-lg rounded-xl border border-white/10 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10" />
        <div className="flex items-center space-x-5 p-6 relative">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl animate-pulse shadow-lg" />
            <div className="absolute -top-2 -right-2 w-7 h-7 bg-gray-700 rounded-full animate-pulse shadow-lg" />
          </div>
          <div className="space-y-3 flex-1">
            <div className="h-5 w-2/3 bg-gray-800 rounded-full animate-pulse" />
            <div className="h-4 w-1/2 bg-gray-800/70 rounded-full animate-pulse" />
            <div className="h-2 w-full bg-gray-800/50 rounded-full animate-pulse mt-3" />
            <div className="flex justify-between mt-2">
              <div className="h-3 w-10 bg-gray-800/30 rounded-full animate-pulse" />
              <div className="h-3 w-10 bg-gray-800/30 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Hata durumu
  if (error) {
    return (
      <div className="relative overflow-hidden backdrop-blur-lg rounded-xl border border-red-500/20 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-700/5" />
        <div className="flex items-center space-x-5 p-6 relative">
          <motion.div 
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 5, 0, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-xl"
          >
            <FaSpotify className="w-10 h-10 text-red-500" />
          </motion.div>
          <div>
            <h3 className="text-red-400 font-medium text-lg">Spotify bağlantısı başarısız</h3>
            <p className="text-red-300/70 text-sm mb-3">Bağlantı hatası oluştu</p>
            <motion.button
              onClick={() => window.location.href = '/api/spotify/auth'}
              className="text-sm px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-lg inline-flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Yeniden bağlan</span>
            </motion.button>
          </div>
        </div>
      </div>
    )
  }

  // Şarkı çalmıyor
  if (!data?.isPlaying) {
    return (
      <div className="relative overflow-hidden backdrop-blur-lg rounded-xl border border-white/10 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10" />
        <div className="flex items-center space-x-5 p-6 relative">
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 2, 0, -2, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative w-16 h-16 flex items-center justify-center bg-black/30 rounded-xl backdrop-blur-lg shadow-lg"
          >
            <FaMusic className="w-8 h-8 text-green-600/60" />
          </motion.div>
          <div>
            <p className="text-gray-300 font-medium text-lg">Şu anda çalan şarkı yok</p>
            <div className="flex items-center space-x-2 mt-1">
              <FaSpotify className="w-4 h-4 text-[#1DB954]" />
              <p className="text-sm text-gray-400">Spotify</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden backdrop-blur-lg rounded-xl border border-white/10 shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10" />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="group p-6 relative"
      >
        <div className="flex items-center space-x-5">
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative w-20 h-20 rounded-xl overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.3)]"
            >
              <a
                href={data.songUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Image
                  src={data.albumImageUrl}
                  alt={`${data.title} album cover`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover rounded-xl"
                  priority
                />
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-xl flex items-center justify-center"
                >
                  {data.isPlaying ? (
                    <FaPause className="w-8 h-8 text-white" />
                  ) : (
                    <FaPlay className="w-8 h-8 text-white" />
                  )}
                </motion.div>
              </a>
            </motion.div>
            
            <motion.div
              animate={{
                scale: data.isPlaying ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 1.5,
                repeat: data.isPlaying ? Infinity : 0,
                repeatType: "reverse"
              }}
              className="absolute -top-2 -right-2 bg-[#1DB954] rounded-full p-1.5 shadow-[0_0_10px_rgba(29,185,84,0.5)]"
            >
              <FaSpotify className="w-4 h-4 text-black" />
            </motion.div>
          </div>
          
          <div className="flex-1 min-w-0">
            <a
              href={data.songUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-lg text-white hover:text-[#1DB954] transition-colors line-clamp-1 block"
            >
              {data.title}
            </a>
            <p className="text-gray-300 line-clamp-1 mb-3">{data.artist}</p>
            
            {/* Progress Bar */}
            <div className="relative">
              <div className="h-2 bg-black/30 rounded-full overflow-hidden backdrop-blur-lg">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#1DB954] to-green-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "linear" }}
                />
              </div>
              {/* Süre */}
              <div className="flex justify-between mt-2">
                <motion.span 
                  className="text-xs text-gray-400 font-medium"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {formatTime(Math.floor((progress / 100) * data.duration))}
                </motion.span>
                <span className="text-xs text-gray-400 font-medium">
                  {formatTime(data.duration)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Süreyi formatla (ms -> mm:ss)
function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
} 