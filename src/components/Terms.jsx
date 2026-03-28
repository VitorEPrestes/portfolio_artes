import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { termsData } from '../data/terms'
import { FaChevronDown } from 'react-icons/fa'
import './Terms.css'

export default function Terms() {
  const [openId, setOpenId] = useState(null)

  const toggle = (id) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <section className="terms section texture-noise" id="terms">
      <div className="container">
        <div className="section-title">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            Termos de serviço
          </motion.h2>
        </div>

        <div className="terms__list">
          {termsData.map((item, i) => (
            <motion.div
              key={item.id}
              className={`terms__item ${openId === item.id ? 'terms__item--open' : ''}`}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <button
                className="terms__item-header"
                onClick={() => toggle(item.id)}
                aria-expanded={openId === item.id}
              >
                <span className="terms__item-title">{item.title}</span>
                <FaChevronDown
                  className={`terms__item-arrow ${openId === item.id ? 'terms__item-arrow--open' : ''}`}
                />
              </button>

              <AnimatePresence>
                {openId === item.id && (
                  <motion.div
                    className="terms__item-body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <ul className="terms__item-list">
                      {item.content.map((line, j) => (
                        <li key={j}>{line}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
