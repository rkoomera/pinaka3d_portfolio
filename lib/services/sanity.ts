import { createClient } from 'next-sanity'
import { groq } from 'next-sanity'
import { Project } from '@/types'
import { apiVersion, dataset, projectId, useCdn } from '@/sanity/env'

export const client = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
})

// Get all projects
export async function getAllProjects(): Promise<Project[]> {
  return client.fetch(
    groq`*[_type == "project" && status == "published"] | order(publishedAt desc) {
      _id,
      _createdAt,
      _updatedAt,
      title,
      "slug": slug.current,
      description,
      content,
      summary,
      subtitle,
      thumbnail,
      gallery,
      status,
      category,
      client_name,
      client_website,
      duration,
      role,
      tech_stack,
      background_video_url,
      project_video_url,
      publishedAt
    }`
  )
}

// Get a single project by slug
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return client.fetch(
    groq`*[_type == "project" && slug.current == $slug][0] {
      _id,
      _createdAt,
      _updatedAt,
      title,
      "slug": slug.current,
      description,
      content,
      summary,
      subtitle,
      thumbnail,
      gallery,
      status,
      category,
      client_name,
      client_website,
      duration,
      role,
      tech_stack,
      background_video_url,
      project_video_url,
      publishedAt
    }`,
    { slug }
  )
}

// Get related projects
export async function getRelatedProjects(projectId: string, limit: number = 4): Promise<Project[]> {
  return client.fetch(
    groq`*[_type == "project" && status == "published" && _id != $projectId][0...$limit] {
      _id,
      _createdAt,
      _updatedAt,
      title,
      "slug": slug.current,
      description,
      thumbnail,
      status,
      category
    }`,
    { projectId, limit }
  )
} 