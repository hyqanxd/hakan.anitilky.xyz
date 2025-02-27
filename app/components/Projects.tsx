'use client'

import { motion } from 'framer-motion'
import { FaExternalLinkAlt, FaPlay, FaDownload } from 'react-icons/fa'

const projects = [
  {
    title: 'AniTilky',
    description: 'Modern ve kullanıcı dostu anime izleme platformu. En yeni animeleri ve popüler serileri kolayca izleyebilirsiniz.',
    icon: <FaPlay className="text-white" />,
    url: 'https://anitilky.xyz/',
    color: 'from-red-500 to-rose-600',
    buttonColor: 'bg-gradient-to-r from-red-500 to-rose-600 text-white',
    iconBg: 'bg-gradient-to-br from-red-500 to-rose-600'
  },
  {
    title: 'TilkyDownloader',
    description: 'YouTube ve Instagram videolarını hızlı ve kolay bir şekilde indirmenizi sağlayan pratik bir servis.',
    icon: <FaDownload className="text-white" />,
    url: 'https://downloader.anitilky.xyz/',
    color: 'from-orange-400 to-amber-500',
    buttonColor: 'bg-gradient-to-r from-orange-400 to-amber-500 text-white',
    iconBg: 'bg-gradient-to-br from-orange-400 to-amber-500'
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      ease: 'easeOut'
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    }
  }
}

export default function Projects() {
  return (
    <div className="w-full">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-4xl font-bold mb-16 text-center bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text"
      >
        Projelerim
      </motion.h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-12"
      >
        {projects.map((project, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 overflow-hidden shadow-2xl transition-all"
          >
            <div className={`h-52 relative bg-gradient-to-r ${project.color}`}>
              <motion.div 
                initial={{ opacity: 0.6 }}
                whileHover={{ opacity: 0.8, scale: 1.05 }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0)_0%,rgba(0,0,0,0.4)_100%)]"
              />
              
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
              
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-20 h-20 flex items-center justify-center text-3xl ${project.iconBg} rounded-2xl shadow-lg`}
                >
                  {project.icon}
                </motion.div>
              </div>
              
              <div className="absolute bottom-4 left-6">
                <h3 className="text-2xl font-bold text-white drop-shadow-md">{project.title}</h3>
              </div>
            </div>
            
            <div className="p-8">
              <p className="text-gray-200 mb-8 text-lg leading-relaxed">{project.description}</p>
              
              <motion.a 
                href={project.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`inline-flex items-center space-x-2 px-6 py-3 rounded-xl ${project.buttonColor} shadow-lg transition-all`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="font-medium">Ziyaret Et</span>
                <FaExternalLinkAlt size={14} />
              </motion.a>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
} 