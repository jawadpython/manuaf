/**
 * Images from public/images/random-images - used across the website
 */
const RANDOM_BASE = '/images/random-images'

export const RANDOM_IMAGES = [
  `${RANDOM_BASE}/ewwewewescas.webp`,
  `${RANDOM_BASE}/Gemini_Generated_Image_1wsmpf1wsmpf1wsm.webp`,
  `${RANDOM_BASE}/Gemini_Generated_Image_25w09h25w09h25w0.webp`,
  `${RANDOM_BASE}/Gemini_Generated_Image_8j8nlm8j8nlm8j8n.webp`,
  `${RANDOM_BASE}/Gemini_Generated_Image_94i3jy94i3jy94i3.webp`,
  `${RANDOM_BASE}/Gemini_Generated_Image_9gg7mn9gg7mn9gg7.webp`,
  `${RANDOM_BASE}/Gemini_Generated_Image_a02dfja02dfja02d.webp`,
  `${RANDOM_BASE}/Gemini_Generated_Image_dd8dcgdd8dcgdd8d.webp`,
  `${RANDOM_BASE}/Gemini_Generated_Image_ix9v09ix9v09ix9v.webp`,
  `${RANDOM_BASE}/Gemini_Generated_Image_ngj5wingj5wingj5.webp`,
  `${RANDOM_BASE}/Gemini_Generated_Image_pcjovapcjovapcjo.webp`,
  `${RANDOM_BASE}/Gemini_Generated_Image_pvdofhpvdofhpvdo.webp`,
  `${RANDOM_BASE}/Gemini_Generated_Image_s4zmzus4zmzus4zm.webp`,
  `${RANDOM_BASE}/Gemini_Generated_Image_u12czau12czau12c.webp`,
  `${RANDOM_BASE}/Gemini_Generated_Image_w0ub9bw0ub9bw0ub.webp`,
] as const

export function getRandomImage(index: number): string {
  return RANDOM_IMAGES[index % RANDOM_IMAGES.length]
}
