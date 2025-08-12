import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'message',
  title: 'Message',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', title: 'Name', validation: (Rule) => Rule.required() }),
    defineField({ name: 'email', type: 'string', title: 'Email', validation: (Rule) => Rule.required() }),
    defineField({ name: 'subject', type: 'string', title: 'Subject' }),
    defineField({ name: 'message', type: 'text', title: 'Message', validation: (Rule) => Rule.required() }),
    defineField({ name: 'read', type: 'boolean', title: 'Read', initialValue: false }),
    defineField({ name: 'createdAt', type: 'datetime', title: 'Created At', initialValue: () => new Date().toISOString() }),
  ],
})


