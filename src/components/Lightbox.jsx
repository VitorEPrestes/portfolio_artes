import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import './Lightbox.css'

export default function Lightbox({ item, onClose, layoutIdPrefix = 'art' }) {
  useEffect(() => {
    if (!item) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [item, onClose])

  const content = (
    <AnimatePresence>
      {item && (
        <motion.div
          className="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <div className="lightbox__backdrop" />
          <motion.div
            className="lightbox__spotlight"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.28 }}
          />
          <motion.img
            className="lightbox__img"
            src={item.image}
            alt={item.title}
            layoutId={`${layoutIdPrefix}-${item.id}`}
            draggable={false}
            onContextMenu={(event) => event.preventDefault()}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
          />
          <motion.div
            className="lightbox__meta"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={(event) => event.stopPropagation()}
          >
            <p className="lightbox__title">{item.title}</p>
            {Array.isArray(item.categories) && item.categories.includes('thumbnail') && item.videoUrl && (
              <a
                className="lightbox__video-btn"
                href={item.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir video
              </a>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return createPortal(content, document.body)
}
