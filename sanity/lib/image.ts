import createImageUrlBuilder from '@sanity/image-url'
import type { Image } from 'sanity'

import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

export const urlForImage = (source: Image) => {
  if (!source?.asset?._ref) {
    return undefined
  }

  return imageBuilder?.image(source).auto('format').fit('max')
}

// Helper function to generate image URL with specific dimensions
export const urlForImageWithDimensions = (
  source: Image,
  width?: number,
  height?: number
) => {
  if (!source?.asset?._ref) {
    return undefined
  }

  let builder = imageBuilder?.image(source).auto('format')

  if (width) {
    builder = builder.width(width)
  }
  if (height) {
    builder = builder.height(height)
  }

  return builder.fit('max').url()
}
