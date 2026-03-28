import { motion } from 'motion/react'
import { pricingPlans, pricingNotes } from '../data/pricing'
import { FaInfoCircle } from 'react-icons/fa'
import './Pricing.css'

export default function Pricing() {
  return (
    <section className="pricing section texture-noise" id="pricing">
      <div className="container">
        <div className="section-title">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            Tabela de preços
          </motion.h2>
        </div>

        <div className="pricing__grid">
          {pricingPlans.map((plan, i) => {
            const Icon = plan.icon
            return (
              <motion.div
                key={plan.id}
                className={`pricing__card ${plan.featured ? 'pricing__card--featured' : ''}`}
                style={{ '--card-accent': plan.color }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                {plan.featured && <span className="pricing__badge">Popular</span>}
                <div className="pricing__card-icon" style={{ color: plan.color }}>
                  <Icon />
                </div>
                <h3 className="pricing__card-title">{plan.title}</h3>
                <div className="pricing__card-price">
                  {plan.startingFrom && (
                    <span className="pricing__price-prefix">A partir de</span>
                  )}
                  <span className="pricing__currency">R$</span>
                  <span className="pricing__value">{plan.price}</span>
                </div>
                <p className="pricing__card-desc">{plan.description}</p>
                <a
                  href="#contact"
                  className="pricing__card-btn"
                  style={{ '--card-accent': plan.color }}
                >
                  Encomendar
                </a>
              </motion.div>
            )
          })}
        </div>

        {/* Notes */}
        <motion.div
          className="pricing__notes"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <FaInfoCircle className="pricing__notes-icon" />
          <ul>
            {pricingNotes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}
