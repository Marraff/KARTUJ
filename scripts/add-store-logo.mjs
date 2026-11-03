// Converts any image (PNG, JPG, SVG, WebP) into a store logo for the catalog.
//
// Usage:  node scripts/add-store-logo.mjs <image file> <store id>
// Example: node scripts/add-store-logo.mjs ~/Downloads/albert.png albert
//
// Then add the store to src/features/stores/storeCatalog.ts (same id).
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

const [input, id] = process.argv.slice(2)
if (!input || !id || !/^[a-z0-9-]+$/.test(id)) {
  console.error('Usage: node scripts/add-store-logo.mjs <image file> <store id (a-z, 0-9, -)>')
  process.exit(1)
}

const outDir = join(import.meta.dirname, '..', 'public', 'logos')
mkdirSync(outDir, { recursive: true })
const output = join(outDir, `${id}.webp`)

await sharp(input, { density: 300 })
  .resize(128, 128, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .webp({ quality: 82 })
  .toFile(output)

console.log(`Saved ${output}`)
