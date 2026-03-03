'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProductImageGalleryProps {
  images: string[]
  alt: string
  sold?: boolean
}

export function ProductImageGallery({ images, alt, sold = false }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const displayImages = images.length > 0 ? images : ['/images/products/chr5-min-276x300.jpg']

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] w-full bg-[#f5f5f5] overflow-hidden rounded">
        <Image
          src={displayImages[selectedIndex] || displayImages[0]!}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 55vw"
          priority
          unoptimized={displayImages[selectedIndex]?.startsWith('http')}
        />
        {sold && (
          <div className="absolute top-0 right-0 w-[6.5rem] h-[6.5rem] overflow-hidden pointer-events-none z-10">
            <div
              className="absolute left-0 top-0 w-48 bg-red-600 flex items-center justify-center py-3 text-white text-sm font-bold uppercase tracking-widest"
              style={{
                transform: 'translate(-20px, 20px) rotate(45deg)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                textShadow: '0 0 1px rgba(0,0,0,0.5)',
              }}
            >
              Vendu
            </div>
          </div>
        )}
      </div>
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {displayImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={`relative flex-shrink-0 w-16 h-16 overflow-hidden transition-all rounded ${
                selectedIndex === i ? 'ring-2 ring-[var(--accent)] ring-offset-2' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Image src={img} alt={`${alt} ${i + 1}`} fill className="object-cover" sizes="64px" unoptimized={img.startsWith('http')} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
