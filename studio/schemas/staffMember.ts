import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'staffMember',
  title: 'Staff Member',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name',
      type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'role', title: 'Role',
      type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'qualifications',
      title: 'Qualifications',
      type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'photo', title: 'Photo',
      type: 'image',
      options: { hotspot: true } }),
    defineField({ name: 'contact', title: 'Contact',
      type: 'string' }),
    defineField({ name: 'order', title: 'Display Order',
      type: 'number' }),
  ],
})
