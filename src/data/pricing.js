import { FaPaintBrush, FaUserAlt, FaUser, FaImage } from 'react-icons/fa'

export const pricingPlans = [
  {
    id: 'thumbnail',
    title: 'Thumbnail',
    price: 50,
    icon: FaImage,
    description: 'Thumbnail personalizada para video ou live',
    color: 'var(--neon-yellow)',
    startingFrom: true,
  },
  {
    id: 'icon',
    title: 'Ícone',
    price: 25,
    icon: FaPaintBrush,
    description: 'Emote ou ícone personalizado',
    color: 'var(--neon-blue)',
  },
  {
    id: 'halfbody',
    title: 'Meio-corpo',
    price: 50,
    icon: FaUserAlt,
    description: 'Personagem da cintura pra cima',
    color: 'var(--neon-pink)',
    featured: true,
  },
  {
    id: 'fullbody',
    title: 'Corpo inteiro',
    price: 80,
    icon: FaUser,
    description: 'Personagem completo, pose livre',
    color: 'var(--neon-green)',
  },
]

export const pricingNotes = [
  'Pagamento via PIX somente!!',
  'O preço pode variar para mais ou para menos dependendo da complexidade do pedido.',
  'Cenários, props e extras ficam a combinar.',
  'Pagamento antecipado (50% de entrada + 50% na entrega, ou valor total antecipado).',
]
