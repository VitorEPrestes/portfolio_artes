import { motion } from 'motion/react'
import { FaDiscord } from 'react-icons/fa'
import './Discord.css'

export default function Discord() {
  return (
    <section className="discord section" id="discord">
      <div className="container">
        <motion.div
          className="discord__card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="discord__card-bg" />
          <div className="discord__card-content">
            <FaDiscord className="discord__icon" />
            <div className="discord__info">
              <h3 className="discord__title">Servidor do Discord</h3>
              <p className="discord__text">
                Participe da comunidade do meu canal para conversar sobre arte, comissões, jogos e muito mais! É um espaço amigável para fãs, clientes e qualquer pessoa interessada em arte digital.
              </p>
              <div className="discord__meta">
                <span className="discord__status">
                  <span className="discord__dot" /> Online
                </span>
                <span className="discord__members">Junte-se a nós!</span>
              </div>
            </div>
            <a
              href="https://discord.gg/DuPVgkMmS6"
              className="discord__btn"
              onClick={(e) => e.preventDefault()}
            >
              <FaDiscord />
              Entrar no servidor
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
