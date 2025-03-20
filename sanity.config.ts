'use client'

/**
 * This configuration is used to for the Sanity Studio that's mounted on the `/app/admin/studio/[[...index]]/page.tsx` route
 */

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'

import { schema } from './sanity/schema'
import { apiVersion, dataset, projectId } from './sanity/env'

export default defineConfig({
  basePath: '/admin/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    deskTool(),
    // Vision is a tool that lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
