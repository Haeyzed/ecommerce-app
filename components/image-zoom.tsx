import Image from 'next/image'

import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

import { ImageZoom } from '@/components/ui/image-zoom'

function ImageZoomCell({ src, alt }: { src: string; alt: string }) {
  const { resolvedTheme } = useTheme()
  return (
    <ImageZoom
      backdropClassName={cn(
        resolvedTheme === 'dark'
          ? '[&_[data-rmiz-modal-overlay="visible"]]:bg-white/80'
          : '[&_[data-rmiz-modal-overlay="visible"]]:bg-black/80'
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={40}
        height={40}
        className='size-10 rounded-md object-cover'
        unoptimized
      />
    </ImageZoom>
  )
}

function ImageZoomView({ src, alt }: { src: string; alt: string }) {
  const { resolvedTheme } = useTheme()
  return (
    <ImageZoom
      backdropClassName={cn(
        resolvedTheme === 'dark'
          ? '[&_[data-rmiz-modal-overlay="visible"]]:bg-white/80'
          : '[&_[data-rmiz-modal-overlay="visible"]]:bg-black/80'
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={40}
        height={40}
        className='size-10 rounded-md object-cover'
        unoptimized
      />
    </ImageZoom>
  )
}

export { ImageZoomCell, ImageZoomView }
