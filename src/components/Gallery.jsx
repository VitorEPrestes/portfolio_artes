import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { categories, galleryItems } from '../data/gallery'
import Lightbox from './Lightbox'
import './Gallery.css'

const MOBILE_INITIAL_COUNT = 6

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [lightboxImage, setLightboxImage] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const getItemCategories = (item) => {
    if (Array.isArray(item.categories)) {
      return item.categories
    }

    if (item.category) {
      return [item.category]
    }

    return ['other']
  }

  const filtered = activeCategory === 'all'
    ? galleryItems
    : galleryItems.filter((item) => getItemCategories(item).includes(activeCategory))

  const displayedItems = isMobile && !isExpanded
    ? filtered.slice(0, MOBILE_INITIAL_COUNT)
    : filtered

  const hiddenCount = filtered.length - MOBILE_INITIAL_COUNT

  const isThumbnail = (item) => getItemCategories(item).includes('thumbnail')

  return (
    <section className="gallery section texture-noise" id="gallery">
      <div className="container">
        <div className="section-title">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            Galeria
          </motion.h2>
        </div>

        {/* Category filters */}
        <motion.div
          className="gallery__filters"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`gallery__filter-btn ${activeCategory === cat.id ? 'gallery__filter-btn--active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Gallery grid */}
        <motion.div className="gallery__grid">
          <AnimatePresence>
            {displayedItems.map((item) => (
              <motion.div
                key={item.id}
                className="gallery__item"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onClick={() => setLightboxImage(item)}
              >
                <div className="gallery__item-image">
                  <motion.img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    layoutId={`gallery-${item.id}`}
                    draggable={false}
                    onContextMenu={(event) => event.preventDefault()}
                  />
                </div>
                <div className="gallery__item-info">
                  <span className="gallery__item-title">{item.title}</span>
                  <span className="gallery__item-category">
                    {getItemCategories(item)
                      .map((catId) => categories.find((c) => c.id === catId)?.label)
                      .filter(Boolean)
                      .join(' • ')}
                  </span>
                </div>
                {isThumbnail(item) && item.videoUrl && (
                  <a
                    className="gallery__video-btn"
                    href={item.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(event) => event.stopPropagation()}
                  >
                    Ver video
                  </a>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <Lightbox
        item={lightboxImage}
        layoutIdPrefix="gallery"
        onClose={() => setLightboxImage(null)}
      />

      {/* Mobile expand/collapse FAB */}
      <div className="gallery__expand-fab">
        <button
          className="gallery__expand-btn"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          {isExpanded ? '▲ Recolher' : `▼ Mostrar mais (${hiddenCount > 0 ? hiddenCount : filtered.length})`}
        </button>
      </div>
    </section>
  )
}
