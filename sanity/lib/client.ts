import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, useCdn } from '../env'

export const client = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
  perspective: 'published',
})

// For preview mode
export const previewClient = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn: false,
  perspective: 'previewDrafts',
  token: process.env.SANITY_API_TOKEN,
})

// Helper function to choose the correct client
export const getClient = (preview = false) => (preview ? previewClient : client)
