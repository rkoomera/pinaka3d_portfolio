'use client';

import { PortableText } from '@portabletext/react'
import { urlForImage } from '@/sanity/lib/image'
import ClientVideoSection from '@/components/project/ClientVideoSection'
import type { Image as SanityImage } from 'sanity'

interface MediaItem {
  type: 'image' | 'video';
  url?: string;
  alt?: string;
  thumbnail?: SanityImage;
}

interface ProcessedMediaItem {
  type: 'image' | 'video';
  url: string;
  alt: string;
  thumbnail?: string;
}

const components = {
  types: {
    image: ({ value }: { value: SanityImage }) => {
      if (!value?.asset?._ref) {
        return null
      }
      const imageUrl = urlForImage(value)?.url() || '';
      const altText = (value.alt as string) || 'Project image';
      return (
        <div className="relative w-full h-96 my-6 overflow-hidden rounded-lg">
          <img
            src={imageUrl}
            alt={altText}
            className="object-cover"
          />
        </div>
      )
    },
    mediaGallery: ({ value }: { value: { items: MediaItem[] } }) => {
      if (!value?.items) {
        return null
      }
      
      const items: ProcessedMediaItem[] = value.items.map((item: MediaItem) => {
        if (item.type === 'image' && item.url) {
          return {
            type: 'image',
            url: item.url,
            alt: item.alt || '',
          }
        }
        if (item.type === 'video' && item.url) {
          return {
            type: 'video',
            url: item.url,
            alt: item.alt || '',
            thumbnail: item.thumbnail ? urlForImage(item.thumbnail)?.url() || '' : undefined,
          }
        }
        return null
      }).filter((item): item is ProcessedMediaItem => item !== null)

      return (
        <div className="my-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item, index) => (
              <div 
                key={`${item.type}-${index}`}
                className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"
              >
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.alt}
                    className="w-full h-full object-cover"
                  />
                ) : item.type === 'video' && (
                  <ClientVideoSection
                    backgroundVideoUrl={item.url}
                    popupVideoUrl={item.url}
                    height="aspect-video"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )
    },
  },
}

export function RichTextContent({ content }: { content: any[] }) {
  return <PortableText value={content} components={components} />
} 