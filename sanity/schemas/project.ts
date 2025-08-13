import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'media', title: 'Media' },
    { name: 'details', title: 'Details' },
    { name: 'meta', title: 'Meta' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .slice(0, 96),
      },
      validation: (Rule) => Rule.required(),
      group: 'meta',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required(),
      group: 'media',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      group: 'media',
    }),
    defineField({
      name: 'background_video_url',
      title: 'Background Video URL',
      type: 'url',
      description: 'URL to the background video (e.g., Supabase storage)',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
      group: 'media',
    }),
    defineField({
      name: 'project_video_url',
      title: 'Project Video URL',
      type: 'url',
      description: 'URL to the project video (e.g., Supabase storage)',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
      group: 'media',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
              { title: 'Highlight', value: 'highlight' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'External Link',
                fields: [
                  { name: 'href', type: 'url', title: 'URL', validation: (Rule: any) => Rule.uri({ scheme: ['http','https'] }) },
                  { name: 'blank', type: 'boolean', title: 'Open in new tab', initialValue: true },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', title: 'Alt text', validation: (Rule: any) => Rule.required() },
            { name: 'caption', type: 'string', title: 'Caption' },
          ],
        },
        {
          name: 'mediaGallery',
          title: 'Media Gallery',
          type: 'object',
          fields: [
            {
              name: 'items',
              title: 'Media Items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'mediaItem',
                  fields: [
                    {
                      name: 'type',
                      title: 'Type',
                      type: 'string',
                      options: {
                        list: [
                          { title: 'Image', value: 'image' },
                          { title: 'Video', value: 'video' },
                        ],
                      },
                      validation: (Rule) => Rule.required(),
                    },
                    {
                      name: 'url',
                      title: 'URL',
                      type: 'url',
                      description: 'URL for the media (image URL or video URL)',
                      validation: (Rule) => Rule.required(),
                    },
                    {
                      name: 'alt',
                      title: 'Alt Text',
                      type: 'string',
                      description: 'Alternative text for accessibility',
                    },
                    {
                      name: 'thumbnail',
                      title: 'Video Thumbnail',
                      type: 'image',
                      options: {
                        hotspot: true,
                      },
                      hidden: ({ parent }: any) => parent?.type !== 'video',
                    },
                  ],
                  preview: {
                    select: {
                      type: 'type',
                      url: 'url',
                      alt: 'alt',
                    },
                    prepare({ type, url, alt }: any) {
                      return {
                        title: alt || url,
                        subtitle: type.charAt(0).toUpperCase() + type.slice(1),
                      }
                    },
                  },
                },
              ],
            },
          ],
          preview: {
            select: {
              items: 'items',
            },
            prepare({ items }: any) {
              return {
                title: 'Media Gallery',
                subtitle: `${items?.length || 0} items`,
              }
            },
          },
        },
      ],
      group: 'content',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Web Development', value: 'web' },
          { title: 'Mobile App', value: 'mobile' },
          { title: 'Desktop Software', value: 'desktop' },
          { title: 'UI/UX Design', value: 'ui' },
          { title: 'Branding', value: 'branding' },
          { title: 'Other', value: 'other' },
        ],
      },
      validation: (Rule) => Rule.required(),
      group: 'details',
    }),
    defineField({
      name: 'client_name',
      title: 'Client Name',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'client_website',
      title: 'Client Website',
      type: 'url',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
      group: 'details',
    }),
    defineField({
      name: 'duration',
      title: 'Project Duration',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'role',
      title: 'My Role',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'link',
      title: 'Project Link',
      type: 'url',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
      group: 'details',
    }),
    defineField({
      name: 'github',
      title: 'GitHub',
      type: 'url',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
      group: 'details',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
          { title: 'Archived', value: 'archived' },
        ],
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
      group: 'meta',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      group: 'meta',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'thumbnail',
      status: 'status',
    },
    prepare({ title, media, status }) {
      return {
        title,
        media,
        subtitle: status ? `Status: ${status}` : 'Draft',
      };
    },
  },
}); 