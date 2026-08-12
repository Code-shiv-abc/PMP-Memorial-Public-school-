import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'course',
  title: 'Course',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name',
      type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'department', title: 'Department',
      type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'credits', title: 'Credits',
      type: 'number', validation: (Rule) => Rule.required() }),
    defineField({ name: 'description', title: 'Description',
      type: 'text', validation: (Rule) => Rule.required() }),
    defineField({ name: 'prerequisites',
      title: 'Prerequisites',
      type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'schedule', title: 'Schedule',
      type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'instructor', title: 'Instructor',
      type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'capacity', title: 'Capacity',
      type: 'number', validation: (Rule) => Rule.required() }),
    defineField({ name: 'enrolled', title: 'Enrolled',
      type: 'number', initialValue: 0 }),
  ],
})
