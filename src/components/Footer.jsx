import { motion } from 'motion/react'
import { FaTwitter, FaInstagram, FaYoutube, FaDiscord } from 'react-icons/fa'
import './Footer.css'

const socialLinks = [
  { icon: FaTwitter, label: 'Twitter Arte', href: 'https://twitter.com/todeelevi', color: '#1da1f2' },
  { icon: FaTwitter, label: 'Twitter Canal', href: 'https://twitter.com/isolasbs', color: '#1da1f2' },
  { icon: FaInstagram, label: 'Instagram', href: 'https://www.instagram.com/isolasbs', color: '#e1306c' },
  { icon: FaYoutube, label: 'YouTube', href: 'https://www.youtube.com/@isolasbs', color: '#ff0000' },
  { icon: FaDiscord, label: 'Discord', handle: 'isolasbs', color: '#5865f2' },
]

export default function Footer() {
  return (
    <footer className="footer texture-noise" id="contact">
      <div className="container">
        {/* Social icons */}
        <motion.div
          className="footer__socials"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="footer__socials-title">Me encontre nas redes</h3>
          <div className="footer__socials-grid">
            {socialLinks.map((link, i) => {
              const Icon = link.icon

              if (!link.href) {
                return (
                  <motion.div
                    key={link.label}
                    className="footer__social-link footer__social-link--static"
                    style={{ '--social-color': link.color }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Icon />
                    <span>{link.label}</span>
                    <span className="footer__social-handle">{link.handle}</span>
                  </motion.div>
                )
              }

              return (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="footer__social-link"
                  style={{ '--social-color': link.color }}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.15, y: -4 }}
                >
                  <Icon />
                  <span>{link.label}</span>
                </motion.a>
              )
            })}
          </div>
        </motion.div>

        {/* Divider */}
        <div className="footer__divider" />

        {/* Bottom */}
        <div className="footer__bottom">
          <p className="footer__logo">ISOLAS</p>
          <p className="footer__copy">
            &copy; {new Date().getFullYear()} Isolas. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
