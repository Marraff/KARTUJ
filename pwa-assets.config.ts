import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

// Regenerate icons after editing public/icon.svg:  npm run icons
const BRAND_BLUE = '#2563eb'

export default defineConfig({
  preset: {
    ...minimal2023Preset,
    maskable: {
      ...minimal2023Preset.maskable,
      resizeOptions: { background: BRAND_BLUE },
    },
    apple: {
      ...minimal2023Preset.apple,
      resizeOptions: { background: BRAND_BLUE },
    },
  },
  images: ['public/icon.svg'],
})
