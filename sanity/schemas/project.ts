import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
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
    }),
    defineField({
      name: 'background_video_url',
      title: 'Background Video URL',
      type: 'url',
      description: 'URL to the background video (from Supabase)',
    }),
    defineField({
      name: 'project_video_url',
      title: 'Project Video URL',
      type: 'url',
      description: 'URL to the project video (from Supabase)',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image' },
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
    }),
    defineField({
      name: 'client_name',
      title: 'Client Name',
      type: 'string',
    }),
    defineField({
      name: 'client_website',
      title: 'Client Website',
      type: 'url',
    }),
    defineField({
      name: 'duration',
      title: 'Project Duration',
      type: 'string',
    }),
    defineField({
      name: 'role',
      title: 'My Role',
      type: 'string',
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies Used',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
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