import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'notice',
  title: 'Notice',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title',
      type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'body', title: 'Body',
      type: 'text', validation: (Rule) => Rule.required() }),
    defineField({ name: 'date', title: 'Date',
      type: 'datetime', validation: (Rule) => Rule.required() }),
    defineField({ name: 'category', title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'General', value: 'general' },
          { title: 'Academic', value: 'academic' },
          { title: 'Sports', value: 'sports' },
          { title: 'Cultural', value: 'cultural' },
        ]
      }
    }),
  ],
})
