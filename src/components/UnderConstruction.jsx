import { motion } from 'motion/react'
import { FaHardHat, FaCubes } from 'react-icons/fa'
import './UnderConstruction.css'

export default function UnderConstruction() {
  return (
    <section className="construction section" id="construction">
      {/* Tape strips */}
      <div className="construction__tape construction__tape--top">
        <div className="construction__tape-inner">
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i}>⚠ EM CONSTRUÇÃO&nbsp;&nbsp;</span>
          ))}
        </div>
      </div>

      <div className="container">
        <motion.div
          className="construction__content"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="construction__icons">
            <FaHardHat className="construction__icon construction__icon--hat" />
            <FaCubes className="construction__icon construction__icon--cubes float" />
            <FaHardHat className="construction__icon construction__icon--hat" />
          </div>

          <h2 className="construction__title">EM CONSTRUÇÃO</h2>
          <p className="construction__text">
            Modelos <span className="construction__highlight">Low Poly 3D</span> chegando em breve!
          </p>
          <p className="construction__subtext">
            Essa área ainda está em construção...
            Dê uma olhada em <a href="https://cara.app/isolas" target="_blank" rel="noopener noreferrer">https://cara.app/isolas</a> se quiser spoilers!
          </p>

          {/* Animated cones */}
          <div className="construction__cones">
            <span className="construction__cone">🚧</span>
            <span className="construction__cone">🚧</span>
            <span className="construction__cone">🚧</span>
          </div>
        </motion.div>
      </div>

      <div className="construction__tape construction__tape--bottom">
        <div className="construction__tape-inner">
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i}>⚠ EM CONSTRUÇÃO&nbsp;&nbsp;</span>
          ))}
        </div>
      </div>
    </section>
  )
}
