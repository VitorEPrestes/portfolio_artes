/*
  GALERIA — Dados das imagens

  Organização automática:
  - Adicione imagens em src/imgs/
  - Categorias são inferidas pelo nome do arquivo
  - Exemplo: "meiocorpooutro" entra em Meio-corpo e Outros
*/

const imageModules = import.meta.glob('../imgs/optimized/*.{webp,gif,avif}', {
  eager: true,
  import: 'default',
})

// Edite os titulos individualmente por nome de arquivo (sem extensao).
// Exemplo:
// "meiocorpooutro_isolas": {
//   title: "Meu Titulo Personalizado",
//   categories: ['halfbody', 'other'],
//   videoUrl: 'https://youtube.com/watch?v=...'
// }
const IMAGE_CONFIG = {
  corpotodo_desenhoantigo: { title: 'Bibi Thor ( 2024 )' },
  FanartDrossel_MeioCorpoIcone: { title: 'Fanart Drossel' },
  fanart_meiocorpo_2pessoas: { title: 'Kira e Killer Queen' },
  IconeTwitter: { title: 'Levi Ícone ( OC )' },
  icone_isolas: { title: 'Icone Isolas ( 2025 )' },
  icone_oc: { title: 'Icone OC ( 2023 )' },
  icone_oc2: { title: 'Icone OC ( 2024 )' },
  icone_oc3: { title: 'Icone OC ( 2024 )' },
  icone_starshimas: { title: 'Fanart Starshimas' },
  meiocorpooutro_isolas: { title: 'Card Brawl Stars Isolas' },
  meiocorpooutro_starshimas: { title: 'Card Brawl Stars Starshimas' },
  meiocorpo_isolas_e_ninne: { title: 'Isolas e Ninne' },
  meiocorpo_oc: { title: 'Comission ( 2024 )' },
  meuoccorpotodo: { title: 'Isolas Chroma' },
  mini_animacao_giftuberfalando: { title: 'Mini Animacao Gif Tuber Falando' },
  outro_meeplecenario: { title: 'Meeple Cenario' },
  outro_memeollie: { title: 'Meme Ollie' },
  porteiro: { title: 'Porteiro ( OC )' },
  Thumb_BSALP: { title: 'Gameplay BSAL', videoUrl:'https://youtu.be/rB5ft3e4RZU?si=d7VxeXSy9Rdxfjri' },
  thumb_casal: { title: 'Desafio Casal', videoUrl:'https://youtu.be/mbr8Xohel-o?si=fctjhlpEllcBFfAf' },
  thumb_desafiochatgpt: { title: 'Desafio jogando com ChatGPT', videoUrl:'https://youtu.be/gO6s3s-ur0s?si=0augsxLeBjL-g540' },
  thumb_desafiodesenho: { title: 'Desafio Desenho pela memória', videoUrl:'https://youtu.be/hIt0qKfs1cQ?si=71sHi30bI8CsHg8O' },
  thumb_desafiodoug: { title: 'Desafio Doug 1K', videoUrl:'https://youtu.be/TIiBaMuWlx4?si=Z7BJ_X2vNE5CVNVE' },
  thumb_desafioenxergar: { title: 'Desafio Sem Enxergar', videoUrl:'https://youtu.be/Vl-jO-iiTkk?si=oLevUne15Zu93K8X' },
  Thumb_GameplayWIllow: { title: 'Gameplay Willow' },
  thumb_live: { title: 'Live ( sem fundo )' },
  thumb_live2: { title: 'Live ( com fundo )' },
  thumb_odeio_mortis: { title: 'Gameplay Mortis', videoUrl:'https://youtu.be/Mek00FhNvDI?si=XQ7NprqMUnyCU4vP' },
  Thumb_OllieBea: { title: 'Gameplay Bea', videoUrl:'https://youtu.be/vU9SuX01IgQ?si=qTFW-gKBW_yVtftg' },
}

// Escolha manualmente quais arquivos aparecem em "Melhores trabalhos".
// Use o nome do arquivo sem extensao.
const SHOWCASE_FILES = [
  'meiocorpooutro_isolas',
  'Thumb_GameplayWIllow',
  'icone_starshimas',
  'Thumb_OllieBea',
  'thumb_live2',
  'thumb_desafioenxergar',
]

const CATEGORY_ORDER = {
  thumbnail: 1,
  icon: 2,
  halfbody: 3,
  fullbody: 4,
  other: 5,
}

function formatTitle(rawName) {
  const cleaned = rawName
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  return cleaned.replace(/\b\w/g, (char) => char.toUpperCase())
}

function inferCategories(fileName) {
  const name = fileName.toLowerCase()
  const categories = []

  if (name.includes('thumb')) {
    categories.push('thumbnail')
  }

  if (name.includes('icon') || name.includes('icone')) {
    categories.push('icon')
  }

  if (name.includes('meiocorpo')) {
    categories.push('halfbody')
  }

  if (
    name.includes('corpotodo')
    || name.includes('corpointeiro')
    || name.includes('fullbody')
  ) {
    categories.push('fullbody')
  }

  if (name.includes('outro') || name.includes('outros')) {
    categories.push('other')
  }

  if (categories.length === 0) {
    categories.push('other')
  }

  return [...new Set(categories)]
}

const allImages = Object.entries(imageModules)
  .map(([path, image]) => {
    const fileName = path.split('/').pop()?.replace(/\.[^.]+$/, '') || 'Sem título'
    const itemConfig = IMAGE_CONFIG[fileName] || {}
    const categories = itemConfig.categories || inferCategories(fileName)

    return {
      fileName,
      title: itemConfig.title || formatTitle(fileName),
      categories,
      videoUrl: itemConfig.videoUrl,
      image,
    }
  })
  .sort((a, b) => {
    const categoryDiff = (CATEGORY_ORDER[a.categories[0]] || 99) - (CATEGORY_ORDER[b.categories[0]] || 99)

    if (categoryDiff !== 0) {
      return categoryDiff
    }

    return a.title.localeCompare(b.title, 'pt-BR')
  })

export const categories = [
  { id: 'all', label: 'Todos' },
  { id: 'thumbnail', label: 'Thumbnails' },
  { id: 'icon', label: 'Ícones' },
  { id: 'halfbody', label: 'Meio-corpo' },
  { id: 'fullbody', label: 'Corpo inteiro' },
  { id: 'other', label: 'Outros' },
]

const imageByFileName = new Map(allImages.map((item) => [item.fileName, item]))

const selectedShowcase = SHOWCASE_FILES
  .map((fileName) => imageByFileName.get(fileName))
  .filter(Boolean)

const fallbackShowcase = allImages.filter((item) => !SHOWCASE_FILES.includes(item.fileName))

const showcaseSource = [...selectedShowcase, ...fallbackShowcase].slice(0, 6)

export const showcaseItems = showcaseSource.map((item, index) => ({
  id: `s${index + 1}`,
  title: item.title,
  image: item.image,
  videoUrl: item.videoUrl,
}))

export const galleryItems = allImages.map((item, index) => ({
  id: index + 1,
  fileName: item.fileName,
  title: item.title,
  categories: item.categories,
  videoUrl: item.videoUrl,
  image: item.image,
}))
