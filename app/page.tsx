'use client'

import { motion } from 'framer-motion'
import SpotifyNowPlaying from './components/SpotifyNowPlaying'
import DiscordActivity from './components/DiscordActivity'
import Projects from './components/Projects'
import { FaGithub } from 'react-icons/fa'
import { HiCode, HiOutlineDesktopComputer } from 'react-icons/hi'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [isMounted, setIsMounted] = useState(false)
  const { data: discordData } = useSWR('/api/discord', fetcher, {
    refreshInterval: 1000
  })

  useEffect(() => {
    setIsMounted(true)
    
    const checkForSpotifyToken = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search)
        const spotifyToken = params.get('spotify_token')
        
        if (spotifyToken) {
          localStorage.setItem('spotify_refresh_token', spotifyToken)
          
          const newUrl = new URL(window.location.href)
          newUrl.searchParams.delete('spotify_token')
          window.history.replaceState({}, document.title, newUrl.toString())
        }
      }
    }
    
    checkForSpotifyToken()
    
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    })

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    const handleScroll = () => setScrollY(window.scrollY)
    
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const getRandomPosition = (index: number) => {
    if (!isMounted) return { x: [0, 0], y: [0, 0] }
    
    return {
      x: [
        Math.random() * windowSize.width,
        Math.random() * windowSize.width,
      ],
      y: [
        Math.random() * windowSize.height,
        Math.random() * windowSize.height,
      ],
    }
  }

  if (!isMounted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-dark to-black text-white flex items-center justify-center">
        <div className="text-white text-2xl">Yükleniyor...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-dark to-black text-white">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-700/20 to-pink-500/20"
          style={{
            y: scrollY * 0.5,
            opacity: 1 - scrollY * 0.002
          }}
        />
        
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,#121212_80%)]" />
        </div>
        
        {isMounted && (
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 15 }).map((_, i) => {
              const positions = getRandomPosition(i)
              return (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-white/30"
                  animate={{
                    x: positions.x,
                    y: positions.y,
                    opacity: [0.2, 0.8, 0.2],
                    scale: [1, Math.random() * 2 + 1, 1],
                  }}
                  transition={{
                    duration: Math.random() * 20 + 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              )
            })}
          </div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 text-center z-10"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-8"
          >
            {discordData?.avatar && (
              <div className="relative w-36 h-36 mx-auto mb-6">
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-70"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, 0, -5, 0]
                  }}
                  transition={{ 
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div 
                  className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <img
                    src={discordData?.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
            )}
          </motion.div>

          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-gradient"
          >
            Merhaba, Ben {discordData?.global_name || discordData?.username || 'Loading...'}
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mb-10"
          >
            <motion.span 
              className="px-5 py-2.5 bg-gradient-to-r from-purple-500/10 to-purple-600/20 rounded-full text-purple-300 border border-purple-500/20 backdrop-blur-sm"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <HiCode className="inline-block mr-2" />
              Full Stack Developer
            </motion.span>
            <motion.span 
              className="px-5 py-2.5 bg-gradient-to-r from-blue-500/10 to-blue-600/20 rounded-full text-blue-300 border border-blue-500/20 backdrop-blur-sm"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <HiOutlineDesktopComputer className="inline-block mr-2" />
              UI/UX Enthusiast
            </motion.span>
          </motion.div>

          <motion.div 
            className="flex justify-center space-x-6 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <SocialLink href="https://github.com/hyqanxd" icon={<FaGithub size={24} />} />
          </motion.div>
        </motion.div>
      </section>

      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-blue-500/5" />
        <div className="container mx-auto px-4 relative">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold mb-16 text-center bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text"
          >
            Şu anda ne yapıyorum?
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl border border-white/10 shadow-2xl"
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <SpotifyNowPlaying />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl border border-white/10 shadow-2xl"
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <DiscordActivity />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5" />
        <div className="absolute left-0 top-24 w-40 h-40 rounded-full bg-purple-700/20 blur-3xl" />
        <div className="absolute right-0 bottom-24 w-60 h-60 rounded-full bg-blue-700/20 blur-3xl" />
        <div className="container mx-auto px-4 max-w-5xl relative">
          <Projects />
        </div>
      </section>
    </main>
  )
}

const SocialLink = ({ href, icon }: { href: string; icon: React.ReactNode }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.1, y: -3 }}
    whileTap={{ scale: 0.95 }}
    className="text-white/80 hover:text-white transition-colors p-4 bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-lg shadow-xl"
  >
    {icon}
  </motion.a>
) 