import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Loader({ onComplete = () => {} }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false)
      onComplete()
    }, 1600)
    return () => clearTimeout(t)
  }, [onComplete])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#05060a]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-32 w-32 rounded-full bg-gradient-to-br from-white/10 via-amber-200/10 to-fuchsia-400/10 backdrop-blur-xl border border-white/10 shadow-[0_0_120px_rgba(255,215,150,0.35)] flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
                className="absolute inset-0 rounded-full border-t border-amber-300/50"
              />
              <Sparkles className="text-amber-200" size={28} />
            </motion.div>
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <p className="text-sm tracking-[0.25em] uppercase text-white/60">Crafting</p>
              <p className="text-white text-lg font-medium">Unforgettable Moments</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
