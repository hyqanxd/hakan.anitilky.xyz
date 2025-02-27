'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaDiscord, FaGamepad, FaCode, FaSpotify, FaYoutube, FaUser } from 'react-icons/fa'
import Image from 'next/image'
import useSWR from 'swr'

interface DiscordData {
  status: 'online' | 'idle' | 'dnd' | 'offline'
  custom_status?: {
    state: string | null
    emoji?: {
      name: string
      id: string
      animated: boolean
      url: string
    }
  }
  activity?: {
    type: 'PLAYING' | 'STREAMING' | 'LISTENING' | 'WATCHING' | 'CUSTOM' | 'COMPETING' | 'SPOTIFY'
    name: string
    details?: string
    state?: string
    timestamps?: {
      start?: number
      end?: number
    }
    assets?: {
      large_image: string | null
      large_text?: string
      small_image?: string
      small_text?: string
    }
    buttons?: string[]
    url?: string
    sync_id?: string
  }
  avatar?: string
  banner?: string
  decoration?: {
    asset: string
    sku_id: string
  } | string
  theme_colors?: number[]
  badges?: string[]
  username?: string
  global_name?: string
  discriminator?: string
  accent_color?: number
  premium_type?: number
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const activityIcons: { [key: string]: React.ReactNode } = {
  PLAYING: <FaGamepad className="w-5 h-5 text-green-400" />,
  CODING: <FaCode className="w-5 h-5 text-blue-400" />,
  SPOTIFY: <FaSpotify className="w-5 h-5 text-[#1DB954]" />,
  LISTENING: <FaSpotify className="w-5 h-5 text-purple-400" />,
  WATCHING: <FaYoutube className="w-5 h-5 text-red-500" />,
}

export default function DiscordActivity() {
  const { data, error } = useSWR<DiscordData>('/api/discord', fetcher, {
    refreshInterval: 1000,
    revalidateOnFocus: true,
    dedupingInterval: 0,
    refreshWhenHidden: true,
    revalidateIfStale: true
  })

  const statusColors = {
    online: 'bg-green-500',
    idle: 'bg-yellow-500',
    dnd: 'bg-red-500',
    offline: 'bg-gray-500'
  }

  const statusText = {
    online: 'Çevrimiçi',
    idle: 'Boşta',
    dnd: 'Rahatsız Etmeyin',
    offline: 'Çevrimdışı'
  }

  const getElapsedTime = (start?: number) => {
    if (!start) return ''
    const elapsed = Date.now() - start
    const minutes = Math.floor(elapsed / 60000)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) {
      return `${hours} saat ${minutes % 60} dakika`
    }
    return `${minutes} dakika`
  }

  if (!data) {
    return (
      <div className="relative overflow-hidden backdrop-blur-lg rounded-xl border border-white/10 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/10" />
        <div className="flex items-start space-x-5 p-6 relative">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-700/30 to-indigo-600/20 rounded-full animate-pulse shadow-lg" />
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-gray-700 rounded-full animate-pulse shadow-lg" />
          </div>
          <div className="flex-1 space-y-3">
            <div className="h-5 w-36 bg-indigo-700/20 rounded-full animate-pulse" />
            <div className="h-28 w-full bg-indigo-700/10 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden backdrop-blur-lg rounded-xl border border-white/10 shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-600/10" />
      
      {/* Banner */}
      {data.banner && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative w-full h-28 overflow-hidden"
        >
          <Image
            src={data.banner}
            alt="Discord Banner"
            fill
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"
          />
        </motion.div>
      )}

      <div className="flex items-start space-x-5 p-6 relative">
        <div className="relative">
          {/* Avatar Decoration */}
          {data.decoration && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -inset-3 z-10"
            >
              <Image
                src={typeof data.decoration === 'string' ? data.decoration : data.decoration.asset}
                alt="Profile Decoration"
                width={96}
                height={96}
                className="w-full h-full"
                priority
              />
            </motion.div>
          )}
          
          {/* Avatar */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-20 h-20 bg-indigo-800/30 rounded-full overflow-hidden relative z-20 shadow-xl"
            style={{
              boxShadow: data.theme_colors?.[0]
                ? `0 0 20px rgba(${
                    parseInt(data.theme_colors[0].toString(16).slice(0, 2), 16)
                  }, ${
                    parseInt(data.theme_colors[0].toString(16).slice(2, 4), 16)
                  }, ${
                    parseInt(data.theme_colors[0].toString(16).slice(4, 6), 16)
                  }, 0.3)`
                : undefined,
            }}
          >
            {data.avatar ? (
              <Image
                src={data.avatar}
                alt={data.username || 'Discord Avatar'}
                width={80}
                height={80}
                className="rounded-full"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaUser className="w-8 h-8 text-indigo-300" />
              </div>
            )}
          </motion.div>

          {/* Status Indicator */}
          <motion.div
            className={`absolute bottom-0 right-0 w-6 h-6 ${statusColors[data.status]} rounded-full border-2 border-gray-900 z-30 shadow-lg`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center flex-wrap gap-2 mb-2">
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="font-bold text-lg text-indigo-300"
            >
              {data.global_name || data.username}
            </motion.span>
            
            {data.premium_type && data.premium_type > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="text-xs px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full font-semibold border border-indigo-500/30"
              >
                Nitro
              </motion.span>
            )}
            
            <span className="text-sm text-indigo-400/60">•</span>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-1 px-2.5 py-0.5 bg-indigo-800/20 rounded-full border border-indigo-500/20 backdrop-blur-sm"
            >
              <span className={`inline-block w-2 h-2 ${statusColors[data.status]} rounded-full`}></span>
              <span className="text-xs text-indigo-300 capitalize">{statusText[data.status]}</span>
            </motion.div>
          </div>

          {/* Badges */}
          {data.badges && data.badges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-2 mb-3"
            >
              {data.badges.map((badge, index) => (
                badge && (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-6 h-6 relative"
                  >
                    <Image
                      src={badge}
                      alt="Discord Badge"
                      width={24}
                      height={24}
                      className="rounded-full shadow-lg"
                    />
                  </motion.div>
                )
              ))}
            </motion.div>
          )}

          {/* Custom Status */}
          {data.custom_status && (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center space-x-2 mb-3 px-3 py-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20"
            >
              {data.custom_status.emoji && (
                <Image
                  src={data.custom_status.emoji.url}
                  alt={data.custom_status.emoji.name}
                  width={18}
                  height={18}
                  className={data.custom_status.emoji.animated ? "animate-bounce" : ""}
                />
              )}
              <span className="text-sm text-indigo-200">
                {data.custom_status.state}
              </span>
            </motion.div>
          )}

          {/* Activity */}
          {data.activity && (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`bg-black/20 backdrop-blur-xl rounded-xl p-4 border ${
                data.activity.type === 'SPOTIFY' ? 'border-[#1DB954]/30' : 'border-indigo-500/20'
              }`}
              style={{
                borderColor: data.activity.type !== 'SPOTIFY' && data.theme_colors?.[0]
                  ? `#${data.theme_colors[0].toString(16)}33`
                  : undefined,
              }}
            >
              <div className="flex items-start space-x-4">
                {/* Activity Image */}
                {data.activity.assets?.large_image && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative flex-shrink-0"
                  >
                    <a
                      href={data.activity.url || undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative"
                    >
                      <Image
                        src={data.activity.assets.large_image}
                        alt={data.activity.name}
                        width={70}
                        height={70}
                        className={`rounded-lg ${data.activity.type === 'SPOTIFY' ? 'shadow-lg shadow-[#1DB954]/20' : 'shadow-lg'}`}
                      />
                      {data.activity.assets.small_image && (
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center shadow-lg">
                          <Image
                            src={data.activity.assets.small_image}
                            alt="Activity Icon"
                            width={18}
                            height={18}
                            className="rounded-full"
                          />
                        </div>
                      )}
                    </a>
                  </motion.div>
                )}

                {/* Activity Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    {activityIcons[data.activity.type] && (
                      <span>{activityIcons[data.activity.type]}</span>
                    )}
                    <p className={`font-semibold truncate ${
                      data.activity.type === 'SPOTIFY' ? 'text-[#1DB954]' : 'text-white'
                    }`}>
                      {data.activity.type === 'SPOTIFY' ? 'Spotify Dinliyor' : data.activity.name}
                    </p>
                  </div>
                  {data.activity.details && (
                    <p className="text-sm text-indigo-200 truncate mt-1">
                      {data.activity.details}
                    </p>
                  )}
                  {data.activity.state && (
                    <p className="text-sm text-indigo-300/70 truncate">
                      {data.activity.state}
                    </p>
                  )}
                  {data.activity.timestamps?.start && (
                    <motion.p 
                      className="text-xs text-indigo-400/50 mt-2 inline-block px-2 py-1 bg-indigo-500/10 rounded-full"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {getElapsedTime(data.activity.timestamps.start)} önce başladı
                    </motion.p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
} 