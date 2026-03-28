import { Link } from 'react-scroll'
import { motion } from 'motion/react'
import { FaChevronDown } from 'react-icons/fa'
import './Hero.css'

const SCROLL_DURATION = 420

export default function Hero() {
  return (
    <section className="hero texture-noise" id="hero">
      <div className="hero__grid" />

      <div className="hero__content">
        <motion.p
          className="hero__tag"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {'// ARTISTA DIGITAL'}
        </motion.p>

        <motion.h1
          className="hero__title"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, type: 'spring' }}
        >
          <span className="hero__title-main glitch-hover">ISOLAS</span>
        </motion.h1>

        <motion.div
          className="hero__cta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link to="showcase" smooth duration={SCROLL_DURATION} offset={-68}>
            <button className="btn-primary">
              Ver trabalhos
              <span className="btn-primary__arrow">→</span>
            </button>
          </Link>
          <Link to="pricing" smooth duration={SCROLL_DURATION} offset={-68}>
            <button className="btn-secondary">Preços</button>
          </Link>
        </motion.div>

        <motion.div
          className="hero__scroll-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <Link to="showcase" smooth duration={SCROLL_DURATION} offset={-68}>
            <FaChevronDown className="hero__scroll-icon float" />
          </Link>
        </motion.div>
      </div>

      <div className="hero__splat hero__splat--1" />
      <div className="hero__splat hero__splat--2" />
    </section>
  )
}
