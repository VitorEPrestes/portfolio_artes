import { useState } from 'react'
import { motion } from 'motion/react'
import { showcaseItems } from '../data/gallery'
import Lightbox from './Lightbox'
import './Showcase.css'

export default function Showcase() {
  const [lightboxImage, setLightboxImage] = useState(null)

  return (
    <section className="showcase section texture-noise" id="showcase">
      <div className="container">
        <div className="section-title">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            Melhores trabalhos
          </motion.h2>
        </div>

        <div className="showcase__grid">
          {showcaseItems.map((item, i) => (
            <motion.div
              key={item.id}
              className="showcase__card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              onClick={() => setLightboxImage(item)}
            >
              <div className="showcase__card-image">
                <motion.img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  layoutId={`showcase-${item.id}`}
                  draggable={false}
                  onContextMenu={(event) => event.preventDefault()}
                />
                <div className="showcase__card-overlay">
                  <span className="showcase__card-label">{item.title}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Lightbox
        item={lightboxImage}
        layoutIdPrefix="showcase"
        onClose={() => setLightboxImage(null)}
      />
    </section>
  )
}
