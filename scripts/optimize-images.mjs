import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const INPUT_DIR = path.resolve('src/imgs')
const OUTPUT_DIR = path.resolve('src/imgs/optimized')
const MAX_WIDTH = 1600
const WEBP_QUALITY = 76
const WATERMARK_TEXT = 'ISOLASBS'
const WATERMARK_TEXT_2 = '@ISOLASBS'
const WATERMARK_OPACITY = 0.16
const WATERMARK_FONT_SIZE = 32
const WATERMARK_STEP_X = 320
const WATERMARK_STEP_Y = 180

const RASTER_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif'])
const PASS_THROUGH_EXTENSIONS = new Set(['.gif'])

function formatMB(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

async function ensureOutputDir() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true })
}

async function clearOutputDir() {
  const entries = await fs.readdir(OUTPUT_DIR, { withFileTypes: true })
  await Promise.all(entries.map(async (entry) => {
    const target = path.join(OUTPUT_DIR, entry.name)

    if (entry.isDirectory()) {
      await fs.rm(target, { recursive: true, force: true })
      return
    }

    await fs.unlink(target)
  }))
}

async function optimizeRasterImage(inputPath, outputBaseName) {
  const outputPath = path.join(OUTPUT_DIR, `${outputBaseName}.webp`)
  const inputStats = await fs.stat(inputPath)
  const source = sharp(inputPath).rotate()
  const metadata = await source.metadata()

  const sourceWidth = metadata.width || MAX_WIDTH
  const sourceHeight = metadata.height || MAX_WIDTH
  const resizedWidth = Math.min(sourceWidth, MAX_WIDTH)
  const resizedHeight = Math.max(1, Math.round((sourceHeight / sourceWidth) * resizedWidth))
  const watermarkSvg = createWatermarkSvg(resizedWidth, resizedHeight)

  await source
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .composite([{ input: Buffer.from(watermarkSvg), blend: 'over' }])
    .webp({ quality: WEBP_QUALITY, effort: 5 })
    .toFile(outputPath)

  const outputStats = await fs.stat(outputPath)

  return {
    inputBytes: inputStats.size,
    outputBytes: outputStats.size,
    outputFile: path.basename(outputPath),
  }
}

function createWatermarkSvg(width, height) {
  const escapedPrimary = WATERMARK_TEXT.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const escapedSecondary = WATERMARK_TEXT_2.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <pattern id="wm" width="${WATERMARK_STEP_X}" height="${WATERMARK_STEP_Y}" patternUnits="userSpaceOnUse">
        <g transform="translate(${WATERMARK_STEP_X / 2} ${WATERMARK_STEP_Y / 2}) rotate(-27)">
          <text
            x="0"
            y="0"
            text-anchor="middle"
            dominant-baseline="central"
            font-family="Arial, Helvetica, sans-serif"
            font-size="${WATERMARK_FONT_SIZE}"
            fill="rgba(255,255,255,${WATERMARK_OPACITY})"
            letter-spacing="2"
            font-weight="700"
          >${escapedPrimary}</text>
          <text
            x="0"
            y="36"
            text-anchor="middle"
            dominant-baseline="central"
            font-family="Arial, Helvetica, sans-serif"
            font-size="18"
            fill="rgba(0,0,0,${Math.max(0.08, WATERMARK_OPACITY - 0.07)})"
            letter-spacing="1"
            font-weight="600"
          >${escapedSecondary}</text>
        </g>
      </pattern>
    </defs>
    <rect x="0" y="0" width="${width}" height="${height}" fill="url(#wm)" />
  </svg>
  `
}
async function copyPassthrough(inputPath, fileName) {
  const outputPath = path.join(OUTPUT_DIR, fileName)
  const inputStats = await fs.stat(inputPath)

  await fs.copyFile(inputPath, outputPath)

  return {
    inputBytes: inputStats.size,
    outputBytes: inputStats.size,
    outputFile: path.basename(outputPath),
  }
}

async function run() {
  await ensureOutputDir()
  await clearOutputDir()

  const entries = await fs.readdir(INPUT_DIR, { withFileTypes: true })
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)

  let totalInputBytes = 0
  let totalOutputBytes = 0

  for (const fileName of files) {
    const extension = path.extname(fileName).toLowerCase()
    const inputPath = path.join(INPUT_DIR, fileName)
    const outputBaseName = fileName.replace(/\.[^.]+$/, '')

    let result = null

    if (RASTER_EXTENSIONS.has(extension)) {
      result = await optimizeRasterImage(inputPath, outputBaseName)
    } else if (PASS_THROUGH_EXTENSIONS.has(extension)) {
      result = await copyPassthrough(inputPath, fileName)
    } else {
      continue
    }

    totalInputBytes += result.inputBytes
    totalOutputBytes += result.outputBytes

    const ratio = result.inputBytes > 0
      ? ((1 - (result.outputBytes / result.inputBytes)) * 100).toFixed(1)
      : '0.0'

    console.log(`${fileName} -> ${result.outputFile} | ${formatMB(result.inputBytes)} -> ${formatMB(result.outputBytes)} (${ratio}% menor)`)
  }

  const totalRatio = totalInputBytes > 0
    ? ((1 - (totalOutputBytes / totalInputBytes)) * 100).toFixed(1)
    : '0.0'

  console.log('')
  console.log(`Total original: ${formatMB(totalInputBytes)}`)
  console.log(`Total otimizado: ${formatMB(totalOutputBytes)}`)
  console.log(`Reducao total: ${totalRatio}%`)
}

run().catch((error) => {
  console.error('Falha ao otimizar imagens:', error)
  process.exitCode = 1
})
